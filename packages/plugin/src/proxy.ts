import type tsModule from 'typescript/lib/tsserverlibrary'
import type { Logger } from 'winston'

import type { ConfigurationManager } from './settings'
import { createSpy, CALLED } from './utils'

export function createProxyHandler(
  config: ConfigurationManager,
  logger: Logger,
): ProxyHandler<tsModule.LanguageService> {
  return {
    get(target, propKey, receiver) {
      const strPropKey = String(propKey)

      const original = Reflect.get(target, propKey, receiver)
      if (typeof original !== 'function') {
        return original
      }

      const userProvidedCallbacks = config.get('userProvidedCallbacks')
      if (!(strPropKey in (userProvidedCallbacks ?? {}))) {
        return original
      }

      logger.log('info', `Patching ${strPropKey}`)

      return (...args: any[]) => {
        const userCallback = createSpy(userProvidedCallbacks[strPropKey])
        const result = userCallback({ logger }, original, ...args)

        if (!userCallback[CALLED]) {
          return original.apply(this, args)
        }

        return result
      }
    },
  }
}
