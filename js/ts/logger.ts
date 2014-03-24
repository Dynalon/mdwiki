
module MDwiki.Util
{
    export enum LogLevel {
        TRACE,
        DEBUG,
        INFO,
        WARN,
        ERROR,
        FATAL
    }
    export class Logger {
        private logLevel: LogLevel = LogLevel.ERROR;

        constructor(level: LogLevel) {
            this.logLevel = level;
        }
        private log(loglevel: string, msg: string) {
            console.log('[' + loglevel.toUpperCase() + '] ' + msg);
        }
        public trace(msg: string) {
            if (this.logLevel >= LogLevel.TRACE)
                this.log('TRACE', msg);
        }
        public info(msg: string) {
            if (this.logLevel >= LogLevel.INFO)
                this.log('INFO', msg);
        }
        public debug(msg: string) {
            if (this.logLevel >= LogLevel.DEBUG)
                this.log('DEBUG', msg);
        }
        public warn(msg: string) {
            if (this.logLevel >= LogLevel.WARN)
                this.log('WARN', msg);
        }
        public error(msg: string) {
            if (this.logLevel >= LogLevel.ERROR)
                this.log('ERROR', msg);
        }
        public fatal(msg: string) {
            if (this.logLevel >= LogLevel.FATAL)
                this.log('FATAL', msg);
        }
    }

}
