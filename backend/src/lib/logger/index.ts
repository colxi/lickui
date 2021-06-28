import {
  LoggerFontBackground,
  LoggerFontColor,
  LoggerFontStyle,
  LoggerFormattedTextOptions
} from './types'


function isChainable(i: any): boolean {
  return typeof i === 'string' || typeof i === 'number' || typeof i === 'boolean'
}

class Logger {
  public formatText(options: LoggerFormattedTextOptions): string {
    let result = ''
    if (options.style) result += LoggerFontStyle[options.style]
    if (options.background) result += LoggerFontBackground[options.background]
    if (options.color) result += LoggerFontColor[options.color]
    if (options.padding) options.text = options.text.padStart(options.text.length + options.padding).padEnd(options.text.length + (options.padding * 2))
    result += options.text
    if (options.reset !== false) result += LoggerFontStyle.reset
    return result
  }

  public log(...args: unknown[]): void {
    const items: any[] = []
    for (const arg of args) {
      const last: any = items[items.length - 1]
      if (isChainable(last) && isChainable(arg)) items[items.length - 1] = [last, arg].join('')
      else items.push(arg)
    }
    console.log(...items, LoggerFontStyle.reset)
  }

  public info(...args: unknown[]): void {
    this.log(
      this.formatText({
        background: 'blue',
        color: 'white',
        style: 'bold',
        padding: 1,
        text: 'INFO'
      }),
      ' ',
      ...args
    )
  }

  public warning(...args: unknown[]): void {
    this.log(
      this.formatText({
        background: 'yellow',
        color: 'white',
        style: 'bold',
        padding: 1,
        text: 'WARNING'
      }),
      ' ',
      ...args
    )
  }

  public error(...args: unknown[]): void {
    this.log(
      this.formatText({
        background: 'red',
        color: 'white',
        style: 'bold',
        padding: 1,
        text: 'ERROR'
      }),
      ' ',
      ...args
    )
  }

  public event(emitter: string, title: string, ...args: unknown[]): void {
    this.log(
      this.formatText({
        background: 'black',
        color: 'yellow',
        style: 'bold',
        padding: 1,
        text: '⚡︎ EVENT'
      }),
      this.formatText({
        background: 'black',
        color: 'white',
        style: 'dim',
        padding: 0,
        text: `from `
      }),
      this.formatText({
        background: 'black',
        color: 'white',
        padding: 0,
        text: `${emitter} `
      }),
      this.formatText({
        background: 'white',
        color: 'black',
        padding: 1,
        text: title
      }),
    )
    if (args.length) this.log(...args)
  }

  public notification(type: string, title: string, ...args: unknown[]): void {
    this.log(
      this.formatText({
        background: 'green',
        color: 'white',
        style: 'bold',
        padding: 1,
        text: type
      }),
      this.formatText({
        background: 'white',
        color: 'black',
        padding: 1,
        text: title
      }),
    )
    if (args.length) this.log(...args)
  }

}

export default new Logger()