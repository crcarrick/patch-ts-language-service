import type { LanguageService } from 'typescript'
import type { Logger } from 'winston'

interface Fn {
  (...args: any[]): any
}

interface PatchFnUtils {
  logger: Logger
}

interface PatchFn<T extends Fn> {
  (utils: PatchFnUtils, fn: T, ...args: Parameters<T>): ReturnType<T>
}

export type PatchedLanguageService<T = LanguageService> = {
  [K in keyof T]?: T[K] extends Fn ? PatchFn<T[K]> : T[K]
}
