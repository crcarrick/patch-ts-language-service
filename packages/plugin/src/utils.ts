export function isExtensionConfigUpdate(config: unknown): config is {
  scriptPath: string
} {
  return typeof config === 'object' && config !== null && 'scriptPath' in config
}

export interface Fn {
  (...args: any[]): any
}

export const CALLED = Symbol('CALLED')

export interface Spy<T extends Fn> {
  (...args: Parameters<T>): ReturnType<T>
  [CALLED]: boolean
}

export function createSpy<T extends Fn>(fn: T): Spy<T> {
  function spy(...args: Parameters<T>): ReturnType<T> {
    spy[CALLED] = true
    return fn(...args)
  }
  spy[CALLED] = false
  return spy
}
