export async function waitUntil(condition: () => boolean, everyMs = 1000): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    if (condition()) {
      resolve(true)
      return
    }
    const interval = setInterval(() => {
      if (condition()) {
        resolve(true)
        clearInterval(interval)
      }
    }, everyMs)
  })
}

export async function waitFor(milliseconds: number) {
  return await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}
