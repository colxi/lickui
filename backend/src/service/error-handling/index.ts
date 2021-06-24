interface ErrorLocation {
  filename: string
  line: string
}

class ErrorHandlingService {
  constructor() { /**/ }

  readonly errorBackgroundColor = '\x1b[41m'
  readonly errorFontColor = '\x1b[37m'

  public async start(): Promise<void> {
    process.on('uncaughtException', (error) => this.handleErrors(error, 'Unhandled exception'))
    process.on('unhandledRejection', (error) => this.handleErrors(error, 'Unhandled promise rejection'))
  }

  private handleErrors(error: unknown, type: string): void {
    console.log()
    console.log(`${this.errorBackgroundColor} ${this.errorFontColor} [${type.toUpperCase()}]`)
    if (error instanceof Error) {
      const { filename, line } = this.getErrorLocation(error)
      console.log(error.name, ':', error.message)
      console.log('File:', filename)
      console.log('Line:', line)
    } else console.log(error)
    console.log('\x1b[0m')
    process.exit()
  }

  private getErrorLocation(error: Error): ErrorLocation {
    const [, filename, line] = error.stack?.match(/\/([/\w-_.]+\.js):(\d*):(\d*)/) || []
    return {
      filename: filename || 'UNKNOWN_ERR_FILE',
      line: line || 'UNKNOWN_ERR_LINE'
    }
  }
}

export default new ErrorHandlingService()