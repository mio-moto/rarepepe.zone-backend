export const camelize = (str: string) =>
  str
    .replace("-", " ")
    .replace("_", " ")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, "")
