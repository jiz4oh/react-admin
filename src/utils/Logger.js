import _ from "lodash"

const logConfig = {
  log: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    debug: (process.env.REACT_APP_DEBUG_LOGGER || '').split(',').filter(Boolean),
    info: (process.env.REACT_APP_INFO_LOGGER || '').split(',').filter(Boolean),
    warn: (process.env.REACT_APP_WARN_LOGGER || '').split(',').filter(Boolean),
    error: (process.env.REACT_APP_ERROR_LOGGER || '').split(',').filter(Boolean),
  }
}

const stringifyPattern = pattern => typeof pattern !== 'string' ? JSON.stringify(pattern) : pattern

class Logger {

  // 定义一些预设的日志级别
  // 目前只有4种级别

  static LOG_LEVEL_DEBUG = 1;
  static LOG_LEVEL_INFO = 2;
  static LOG_LEVEL_WARN = 3;
  static LOG_LEVEL_ERROR = 4;

  /*暂存所有logger*/
  static loggerMap = new Map();

  // 是否为某些logger单独指定了日志级别?
  static debugLoggers = new Set();
  static infoLoggers = new Set();
  static warnLoggers = new Set();
  static errorLoggers = new Set();

  /*默认的logger*/
  static defaultLogger = new Logger();  // 注意这一行代码的位置, 必须在所有Map/Set声明完毕之后

  /**
   * 获取一个Logger实例
   *
   * @param name
   * @returns {*}
   */
  static getLogger(name) {
    if (!!name) return Logger.defaultLogger
    // 从缓存中获取
    if (Logger.loggerMap.has(name)) return Logger.loggerMap.get(name);

    const logger = new Logger(name);
    Logger.loggerMap.set(name, logger);
    return logger;
  }

  constructor(name = 'default') {
    this.name = name;  // logger的名字

    // 是否单独设置了这个logger的日志级别?
    if (Logger.debugLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_DEBUG;
      return;
    }
    if (Logger.infoLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_INFO;
      return;
    }
    if (Logger.warnLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_WARN;
      return;
    }
    if (Logger.errorLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_ERROR;
      return;
    }

    // 如果没有单独设置, 就使用全局日志级别，默认 info
    const configLogLevel = logConfig.log.level;
    switch (configLogLevel) {
      case 'debug':
        this.logLevel = Logger.LOG_LEVEL_DEBUG;
        return
      case 'warn':
        this.logLevel = Logger.LOG_LEVEL_WARN;
        return
      case 'error':
        this.logLevel = Logger.LOG_LEVEL_ERROR;
        return
      default:
        this.error('unsupported logLevel: %s, use INFO instead', configLogLevel);
        this.logLevel = Logger.LOG_LEVEL_INFO;
        return
    }
  }

  /**
   * 打印info日志
   *
   * @param pattern 日志格式, 支持%d/%s等占位符
   * @param args 可变参数, 用于替换pattern中的占位符
   */
  info(pattern, ...args) {
    // 先判断日志级别
    if (this.logLevel > Logger.LOG_LEVEL_INFO)
      return;

    args.unshift(`${this.name}: ${stringifyPattern(pattern)}`);
    console.log.apply(console, args);
  }

  /**
   * 打印error日志
   *
   * @param pattern
   * @param args
   */
  error(pattern, ...args) {
    if (this.logLevel > Logger.LOG_LEVEL_ERROR)
      return;

    args.unshift('background: red; color: #bada55;');
    args.unshift(`${this.name}: ${stringifyPattern(pattern)}`);
    console.error.apply(console, args);
  }

  /**
   * 打印debug日志
   *
   * @param pattern
   * @param args
   */
  debug(pattern, ...args) {
    if (this.logLevel > Logger.LOG_LEVEL_DEBUG)
      return;

    args.unshift('background: black; color: #bada55;');
    args.unshift(`${this.name}: ${stringifyPattern(pattern)}`);
    console.debug.apply(console, args);
  }

  /**
   * 打印warn日志
   *
   * @param pattern
   * @param args
   */
  warn(pattern, ...args) {
    if (this.logLevel > Logger.LOG_LEVEL_WARN)
      return;

    args.unshift('background: yellow; color: black;');
    args.unshift(`${this.name}: ${stringifyPattern(pattern)}`);
    console.warn.apply(console, args);
  }
}

// 从配置中设置 logger 单独的日志级别
['debug', 'info', 'warn', 'error'].forEach((level) => {
  if (_.isArray(logConfig.log[level])) {
    for (const logger of logConfig.log[level]) {
      Logger[`${_.lowerCase(level)}Loggers`].add(logger);
    }
  }
});

export default Logger;
