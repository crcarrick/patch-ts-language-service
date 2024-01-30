import fs from 'node:fs/promises'

import * as vscode from 'vscode'
import winston from 'winston'

import { createLogger } from './logger'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'
export type VSCode = typeof vscode

export class Extension {
  protected logger: winston.Logger

  constructor(private vscode: VSCode) {
    this.logger = createLogger(
      this.vscode.window.createOutputChannel(
        'Patch TS Language Service',
        'log',
      ),
    )
  }

  public log(message: string, level: LogLevel = 'info') {
    this.logger.log(level, message)
  }

  public async loadScriptPath() {
    return new Promise<void>(async (resolve, reject) => {
      const scriptPath: string =
        this.vscode.workspace
          .getConfiguration('crcarrick.patchTsLanguageService')
          .get('scriptPath') ?? ''

      this.log(`Loaded script path: ${scriptPath}`)

      try {
        await this.ensureScriptPath(scriptPath)
        await this.vscode.commands.executeCommand(
          '_typescript.configurePlugin',
          'plugin-patch-ts-language-service',
          {
            scriptPath,
          },
        )

        this.log('Script path passed to TS language service.')
        resolve()
      } catch (err) {
        this.log(
          `Failed to pass script path to TS language service: ${err}`,
          'error',
        )
        reject(err)
      }
    })
  }

  protected ensureScriptPath(scriptPath: string) {
    return fs.access(scriptPath)
  }

  protected passScriptPathToTsServer(scriptPath: string) {
    return this.vscode.commands.executeCommand(
      '_typescript.configurePlugin',
      'plugin-instrument-ts-server',
      {
        scriptPath,
      },
    )
  }
}

export async function activate(context: vscode.ExtensionContext) {
  const extension = new Extension(vscode)

  extension.log('Patching TS language service...')

  async function instrument() {
    try {
      await extension.loadScriptPath()
      extension.log('Patched TS language service.')
    } catch (err) {
      extension.log(`Failed to patch TS language service: ${err}`, 'error')
    }
  }

  await instrument()

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration('crcarrick.patchTsLanguageService')) {
        extension.log('Extension settings changed.')
        await instrument()
      }
    }),
  )
}

export function deactivate(context: vscode.ExtensionContext) {
  context.subscriptions.forEach((disposable) => disposable.dispose())
}
