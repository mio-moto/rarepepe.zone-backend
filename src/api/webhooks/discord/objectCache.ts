export const buildObjectCache = <
  // biome-ignore lint/suspicious/noExplicitAny: irrelevant
  Func extends (...args: any) => Promise<Payload>,
  Payload = Awaited<ReturnType<Func>>,
>(
  fetchFn: Func,
  argumentIndex: number,
  selector: (object: Payload) => string,
) => {
  const entries: Record<string, Payload> = {}

  return {
    get: async (...args: Parameters<Func>): Promise<Payload | undefined> => {
      const discriminator = args[argumentIndex]
      if (typeof discriminator !== "string") {
        throw new Error("Invalid index for args")
      }
      const entry = entries[discriminator]
      if (entry) {
        return entry
      }
      const result = await fetchFn(args)
      if (result) {
        entries[selector(result)] = result
      }
      return result
    },
    getAll: () => entries,
    set: (payload: Payload) => {
      entries[selector(payload)] = payload
    },
  }
}
