/*
* SYNLogger - A flexible logging utility for Synview application
*/


/**
* Enum representing different log levels
*/
export enum LogLevel {
 ERROR = 0,
 WARN = 1,
 INFO = 2,
 DEBUG = 3,
 TRACE = 4,
}


/**
* Logger interface defining methods for different log levels
*/
export interface Logger {
 /**
  * Log an error message
  * @param message The message to log
  * @param ...args Additional arguments to include
  */
 error(message: string, ...args: unknown[]): void;


 /**
  * Log a warning message
  * @param message The message to log
  * @param ...args Additional arguments to include
  */
 warn(message: string, ...args: unknown[]): void;


 /**
  * Log an info message
  * @param message The message to log
  * @param ...args Additional arguments to include
  */
 info(message: string, ...args: unknown[]): void;


 /**
  * Log a debug message
  * @param message The message to log
  * @param ...args Additional arguments to include
  */
 debug(message: string, ...args: unknown[]): void;


 /**
  * Log a trace message
  * @param message The message to log
  * @param ...args Additional arguments to include
  */
 trace(message: string, ...args: unknown[]): void;


 /**
  * Set the current log level
  * @param level The log level to set
  */
 setLevel(level: LogLevel): void;


 /**
  * Get the current log level
  * @returns The current log level
  */
 getLevel(): LogLevel;
}


/**
* Default implementation of the Logger interface
*/
export class SYNLogger implements Logger {
 private level: LogLevel;
 private context: string;


 /**
  * Create a new SYNLogger instance
  * @param context The context for this logger (e.g., class or module name)
  * @param level The initial log level (defaults to INFO)
  */
 constructor(context: string, level: LogLevel = LogLevel.INFO) {
   this.level = level;
   this.context = context;
 }


 /**
  * Format a log message with timestamp and context
  * @param level The log level as a string
  * @param message The message to format
  * @param args Additional arguments
  * @returns Formatted log parts
  */
 private formatLog(level: string, message: string, args: unknown[]): [string, ...unknown[]] {
   const timestamp = new Date().toISOString();
   const formattedMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;
   return [formattedMessage, ...args];
 }


 /**
  * Log a message if the current level permits
  * @param level The level of this log message
  * @param levelStr The string representation of the level
  * @param message The message to log
  * @param args Additional arguments
  */
 private log(level: LogLevel, levelStr: string, message: string, ...args: unknown[]): void {
   if (this.level >= level) {
     const logParts = this.formatLog(levelStr, message, args);


     switch (level) {
       case LogLevel.ERROR:
         console.error(...logParts);
         break;
       case LogLevel.WARN:
         console.warn(...logParts);
         break;
       case LogLevel.INFO:
         console.info(...logParts);
         break;
       case LogLevel.DEBUG:
       case LogLevel.TRACE:
         console.debug(...logParts);
         break;
     }
   }
 }


 error(message: string, ...args: unknown[]): void {
   this.log(LogLevel.ERROR, "ERROR", message, ...args);
 }


 warn(message: string, ...args: unknown[]): void {
   this.log(LogLevel.WARN, "WARN", message, ...args);
 }


 info(message: string, ...args: unknown[]): void {
   this.log(LogLevel.INFO, "INFO", message, ...args);
 }


 debug(message: string, ...args: unknown[]): void {
   this.log(LogLevel.DEBUG, "DEBUG", message, ...args);
 }


 trace(message: string, ...args: unknown[]): void {
   this.log(LogLevel.TRACE, "TRACE", message, ...args);
 }


 setLevel(level: LogLevel): void {
   this.level = level;
 }


 getLevel(): LogLevel {
   return this.level;
 }
}


/**
* Create a logger instance for the given context
* @param context The context for this logger
* @param level Optional initial log level
* @returns A new logger instance
*/
export function createLogger(context: string, level?: LogLevel): Logger {
 return new SYNLogger(context, level);
}


// Default root logger
export const rootLogger = createLogger("root");



