import path, { basename } from "node:path"
import type { Config } from "#/config"
import type { PepeRarity } from "#contracts/generators"

export const buildUrlRenderer = (config: Config) => {
  if (!config.renderer || !config.renderer.basePath || !config.renderer.locations) {
    throw new Error("No configuration for renderer")
  }

  if (
    !config.renderer.locations ||
    !config.renderer.locations.simple ||
    !config.renderer.locations.rare ||
    !config.renderer.locations.ultra ||
    !config.renderer.locations.peplication
  ) {
    throw new Error(
      "missing configuration in config.renderer.locatioons, one of ['simple', 'rare', 'ultra', 'peplication']",
    )
  }

  const basePath = config.renderer.basePath
  if (!basePath) {
    throw new Error("missing configuration config.renderer.basePath")
  }
  const prefixes = {
    simple: config.renderer.locations.simple,
    rare: config.renderer.locations.rare,
    ultra: config.renderer.locations.ultra,
    peplication: config.renderer.locations.peplication,
  }

  return {
    render: (type: PepeRarity, file: string) => {
      const basepath = basePath
      const prefix = prefixes[type]
      const name = basename(file)

      return new URL(path.join(prefix, name), basepath).href
    },
  }
}
