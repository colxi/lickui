import { isChainable, LoggerColorRGB } from './helpers'
import {
  LoggerFontBackground,
  LoggerFontColor,
  LoggerFontStyle,
  LoggerFormattedTextOptions,
  LoggerOptions
} from './types'


export default class Logger {
  constructor(options: LoggerOptions) {
    this.#renderTime = options.renderTime || false
    this.#contextTree = Array.isArray(options.context) ? options.context : [options.context]
  }

  #contextTree: LoggerFormattedTextOptions[]
  #renderTime: boolean

  public createChild(options: LoggerOptions): Logger {
    const context = Array.isArray(options.context) ? options.context : [options.context]
    return new Logger({
      renderTime: 'renderTime' in options ? options.renderTime : this.#renderTime,
      context: [...this.#contextTree, ...context]
    })
  }

  static hexColor(hexColor: string): LoggerColorRGB {
    return new LoggerColorRGB(hexColor)
  }

  public hexColor(hexColor: string): LoggerColorRGB {
    return new LoggerColorRGB(hexColor)
  }

  public formatText(options: LoggerFormattedTextOptions): string {
    let text = options.text
    let result = ''
    if (options.style) result += LoggerFontStyle[options.style]
    if (options.background) {
      result += options.background instanceof LoggerColorRGB
        ? options.background.backgroundToANSI()
        : LoggerFontBackground[options.background]
    }
    if (options.color) {
      result += options.color instanceof LoggerColorRGB
        ? options.color.colorToANSI()
        : LoggerFontColor[options.color]
    }
    if (options.padding) text = text.padStart(text.length + options.padding).padEnd(text.length + (options.padding * 2))
    result += text
    if (options.reset !== false) result += LoggerFontStyle.reset
    return result
  }

  public log(message: string, ...args: unknown[]): void {
    const items: any[] = []
    // render the contexts
    for (const context of this.#contextTree) {
      const formatted = this.formatText(context)
      if (!items.length) items.push(formatted)
      else items[items.length - 1] = [items[0], formatted].join('')
    }

    // add an arrow at th end of te context
    if (this.#contextTree[this.#contextTree.length - 1].background) {
      const ending = this.formatText({
        color: this.#contextTree[this.#contextTree.length - 1].background,
        text: ''
      })
      items[items.length - 1] = [items[0], ending].join('')
    }

    // add message
    items.push(message)
    if (args.length) items.push('\n')

    // metadata
    for (const arg of args) {
      const last: any = items[items.length - 1]
      if (isChainable(last) && isChainable(arg)) items[items.length - 1] = [last, arg].join('')
      else items.push(arg)
    }

    // render message data
    console.log(...items, LoggerFontStyle.reset)
  }
}
