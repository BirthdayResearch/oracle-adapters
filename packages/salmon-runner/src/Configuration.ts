export function getEnv<T extends string = string> (name: string, validate?: (value: string) => boolean): T {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`Required Env.${name} not found.`)
  }

  if (!validate?.(value)) {
    throw new Error(`Required Env.${name} failed validation.`)
  }

  return value as T
}
