# Patch TS Language Service

VSCode extension that allows users to plug-in and patch the internals of VSCode's TS language service.

## Extension Settings

```json
{
  "crcarrick.patchTsLanguageService.scriptPath": "/path/to/script.js"
}
```

## Usage (JS)

Create a javascript file somewhere on your local machine, and export an object whose properties mirror the API of typescripts `LanguageService`.

```js
// /path/to/script.js
module.exports = {
  getSyntacticDiagnostics({ logger }, original, ...args) {
    // provided logger to easily write to tsserver.log
    logger.log('info', 'Hello from getSyntacticDiagnostics')

    const result = original(..args)
    // do something with result...
    return result
  },
}
```

## Usage (TS)

You can install the `patch-ts-language-service-types` package and get typescript intellisense support when writing your patched `LanguageService` API.

```console
npm add -D patch-ts-language-service-types
pnpm add -D patch-ts-language-service-types
yarn add -D patch-ts-language-service-types
```

```ts
import type { PatchedLanguageService } from 'patch-ts-language-service-types'

const patchedService: PatchedLanguageService = {
  // `utils`, `original`, and `args` are strongly typed
  getSyntacticDiagnostics(utils, original, ...args) {
    const result = original(...args)
    // do something with result...
    return result
  },
}

// export default will work as well
export = patchedService
```

You'll need to compile the typescript file to javascript in some way before providing the path to the file in the extension settings.

For a working example, see [here](https://github.com/crcarrick/patch-ts-language-service/tree/main/example).

## Release Notes

### 0.0.1

Initial release of Patch TS Language Service
