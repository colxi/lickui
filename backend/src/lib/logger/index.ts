class Logger {
  constructor() { /**/ }

  public log(...args: unknown[]): void {
    console.log(...args, this.style.special.reset)
  }

  public info(...args: unknown[]): void {
    this.log(this.style.background.blue, ...args)
  }

  public warning(...args: unknown[]): void {
    this.log(this.style.background.magenta, ...args)
  }

  public error(...args: unknown[]): void {
    this.log(this.style.background.red, ...args)
  }

  public event(title: string, ...args: unknown[]): void {
    this.log(
      `${this.style.background.yellow}${this.style.color.black}`,
      'EVENT',
      `${this.style.background.white}${this.style.color.black}`,
      title,
      `${this.style.special.reset}`,
      ...args
    )
  }

  public readonly style = {
    special: {
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      dim: "\x1b[2m",
      underscore: "\x1b[4m",
      blink: "\x1b[5m",
    },
    color: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
    },
    background: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
    }
  }
}

export default new Logger()