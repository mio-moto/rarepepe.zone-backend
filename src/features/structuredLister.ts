import { watch } from "node:fs"
import { exists, readdir, stat } from "node:fs/promises"
import { basename, join } from "node:path"
import sizeOf from "image-size"
import type { Config } from "#/config"
import { loggerFactory } from "#/logging"
import {
  type PepeRarity,
  type PepeResult,
  type PepeResultByRarity,
  type PeplicationResult,
  UltraResult,
} from "#contracts/generators"
import type { Database } from "#database/datastore"
import type { RarePepeMetaParameter, SimplePepeMetaParameter } from "#database/datastore/meta-data"
import { buildUrlRenderer } from "./url-renderer"

const logger = loggerFactory("SYS:Feature:Lister")

interface File {
  path: string
  modified: number
  created: number
}

const errornousImageFiles: string[] = []

const readdirRecursive = async (path: string) => {
  const dir = await readdir(path, { withFileTypes: true })

  let files: File[] = []
  for (const entry of dir) {
    if (entry.isDirectory()) {
      files = [...files, ...(await readdirRecursive(entry.name))]
    }

    if (entry.isFile()) {
      const localizedPath = join(path, entry.name)
      const stats = await stat(localizedPath)
      const latestChangeTime = Math.max(stats.ctimeMs, stats.atimeMs, stats.birthtimeMs, stats.mtimeMs)
      files.push({
        path: join(path, entry.name),
        modified: latestChangeTime,
        created: stats.ctimeMs,
      })
    }
  }
  return files
}

const updateUntrackedEntries = async (entry: File[], rarity: PepeRarity, database: Database) => {
  if (rarity === "peplication") {
    return
  }
  const trackedEntries = await database.metadata.getAll(rarity)
  const untrackedEntries = entry.filter((x) => !trackedEntries.some((y) => y.filename === basename(x.path)))
  if (untrackedEntries.length > 0) {
    logger.info(`Trying to track [${untrackedEntries.length}] new entries of rarity '${rarity}'`)
  }
  for (const untrackedEntry of untrackedEntries) {
    // primarily to avoid pollution of the system logs
    if (errornousImageFiles.includes(untrackedEntry.path)) {
      continue
    }
    try {
      const size = await sizeOf(untrackedEntry.path)
      const baseData = {
        title: null,
        filename: basename(untrackedEntry.path),
        location: untrackedEntry.path,
        created: untrackedEntry.created,
        updated: untrackedEntry.modified,
        width: size.width ?? 0,
        height: size.height ?? 0,
      }

      logger.info(`New entry for '${baseData.filename}' (${rarity} | ${baseData.width}x${baseData.height}px)`)

      switch (rarity) {
        case "ultra":
          await database.metadata.createOrUpdate(rarity, {
            ...baseData,
            collectorsNumber: Number.parseInt(baseData.filename.substring(0, 3)),
          } as RarePepeMetaParameter)
          continue
        case "rare":
          await database.metadata.createOrUpdate(rarity, baseData as RarePepeMetaParameter)
          continue
        case "simple":
          await database.metadata.createOrUpdate(rarity, baseData as SimplePepeMetaParameter)
          continue
      }
    } catch {
      logger.error(`Cannot parse image size of ${untrackedEntry.path}, skipping`)
      errornousImageFiles.push(untrackedEntry.path)
    }
  }
}

const loadListing = async (path: string, type: PepeRarity, database: Database) => {
  const doesExist = path ? await exists(path) : false
  if (!doesExist) {
    throw new Error(`The given path does not exist, value was: '${path}'`)
  }

  let files = await readdirRecursive(path)
  updateUntrackedEntries(files, type, database)
  let lastModified = 0
  for (const file of files) {
    lastModified = Math.max(lastModified, file.modified)
  }
  if (type !== "peplication") {
    watch(path, { recursive: true }, async (_evt, _filename) => {
      files = await readdirRecursive(path)
      updateUntrackedEntries(files, type, database)
      lastModified = Math.max(...files.map((x) => x.modified))
    })
  }

  return {
    getFiles: () => files,
    modified: () => lastModified,
  }
}

const loadAllListings = async (paths: string[] | undefined, type: PepeRarity, database: Database) => {
  if (paths === undefined) {
    throw new Error("The given paths were undefined, not configured perhaps?")
  }
  const listeners: Awaited<ReturnType<typeof loadListing>>[] = []
  for (const path of paths) {
    listeners.push(await loadListing(path, type, database))
  }
  return {
    getfiles: () => listeners.flatMap((x) => x.getFiles()),
    lastModified: () => Math.max(...listeners.map((x) => x.modified())),
  }
}

const buildTransformer = (urlRenderer: ReturnType<typeof buildUrlRenderer>, database: Database) => {
  const peplicationCache: PeplicationResult[] = []

  return async <T extends PepeRarity>(type: PepeRarity, file: File): Promise<PepeResultByRarity<PepeRarity>> => {
    switch (type) {
      case "simple":
      case "rare":
      case "ultra":
        return {
          type: type,
          path: file.path,
          filename: basename(file.path),
          url: urlRenderer.render(type, file.path),
        }
      // peplication is not stored in DB, because the data set is massive for no gain
      case "peplication": {
        const filename = basename(file.path)
        const [idText, indexText] = filename.replace(".png", "").split("-")
        const id = Number.parseInt(idText, 10)
        const index = Number.parseInt(indexText, 10)
        return {
          type: type,
          path: file.path,
          filename: basename(file.path),
          url: urlRenderer.render(type, file.path),
          meta: {
            id,
            index,
          },
        }
        // let result = peplicationCache.find((x) => x.metadata.id === id && x.metadata.index === index)
        /*
        if (!result) {
          // const metadata = await database.peplication.getByFile(id, index)
          result = {
            type: type,
            path: file.path,
            filename: basename(file.path),
            url: urlRenderer.render(type, file.path),
          }
          peplicationCache.push(result)
        }
        return result as Omit<PeplicationResult, 'metadata'>
        */
      }
    }
  }
}

/**
 * Retains a permanently updated list of files in the returned categories
 */
export const buildLister = async (config: Config, database: Database) => {
  const urlRenderer = buildUrlRenderer(config)

  const simples = await loadAllListings(config?.directory?.paths?.simple, "simple", database)
  const rares = await loadAllListings(config?.directory?.paths?.rare, "rare", database)
  const peplications = await loadAllListings(config?.directory?.paths?.peplication, "peplication", database) // { getfiles: () => [] as File[], lastModified: () => 0 }; // await loadAllListings(config?.directory?.paths?.peplication, "peplication", database);
  const ultras = await loadAllListings(config?.directory?.paths?.ultra, "ultra", database)

  const transformResult = buildTransformer(urlRenderer, database)
  const transformResults = async (type: PepeRarity, paths: File[]): Promise<PepeResult[]> => {
    const result: PepeResult[] = []
    for (const path of paths) {
      result.push(await transformResult(type, path))
    }
    return result
  }

  const all = {
    getFiles: () => ({
      simples: transformResults("simple", simples.getfiles()),
      rares: transformResults("rare", rares.getfiles()),
      peplications: transformResults("peplication", peplications.getfiles()),
      ultras: transformResults("ultra", ultras.getfiles()),
    }),
  }

  return {
    simples: {
      getfiles: () => transformResults("simple", simples.getfiles()),
      lastModified: simples.lastModified,
    },
    rares: {
      getfiles: () => transformResults("rare", rares.getfiles()),
      lastModified: rares.lastModified,
    },
    peplications: {
      getfiles: () => transformResults("peplication", peplications.getfiles()),
      lastModified: peplications.lastModified,
    },
    ultras: {
      getfiles: () => transformResults("ultra", ultras.getfiles()),
      lastModified: ultras.lastModified,
    },
    all: all,
    lastModified: () => Math.max(simples.lastModified(), rares.lastModified(), ultras.lastModified()),
  }
}

export type Lister = Awaited<ReturnType<typeof buildLister>>
