import type { Logger } from 'winston'

interface Fn {
  (...args: any[]): any
}

interface PatchFnUtils {
  logger: Logger
}

interface PatchFn<T extends Fn> {
  (utils: PatchFnUtils, original: T, ...args: Parameters<T>): ReturnType<T>
}

export interface Configuration {
  userProvidedCallbacks: Record<string, PatchFn<Fn>>
}

export class ConfigurationManager {
  private configuration: Configuration = {
    userProvidedCallbacks: {},
  }

  public get<K extends keyof Configuration>(key: K): Configuration[K] {
    return this.configuration[key]
  }

  public async updateCallbacksFromScriptPath(scriptPath: string) {
    const script = require(scriptPath)
    this.configuration.userProvidedCallbacks = script.default
      ? script.default
      : script
  }
}
