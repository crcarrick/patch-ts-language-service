import type { PatchedLanguageService } from 'patch-ts-language-service-types'

const patchedService: PatchedLanguageService = {
  getSyntacticDiagnostics({ logger }, original, ...args) {
    logger.log('info', 'Hello world!')

    return original(...args)
  },
}

export = patchedService
