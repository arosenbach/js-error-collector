(function () {

  function LogEntry(date, level, message, stack) {
    this.date = date;
    this.level = level;
    this.message = message;
    this.stack = stack;
  }

  if (window.logEvents) return;

  function captureUnhandled(errorMsg, url, lineNumber, column, errorObj) {
    const logEntry = new LogEntry(new Date(), 'error', errorMsg, errorObj.stack);
    window.logEvents.push(logEntry);
  }

  function capture(level) {
    return function cap() {
      const args = Array.prototype.slice.call(arguments, 0);
      const logEntry = new LogEntry(new Date(), level, '', '');
      args.forEach(arg => {
        if (arg instanceof Error) {
          logEntry.message += arg.message + '\\n';
          logEntry.stack += arg.stack + '\\n';
        } else {
          logEntry.message += arg + '\\n';
        }
      });

      window.logEvents.push(logEntry);
    }
  }
  console = console || {};
  console.warn = capture('warning');
  console.error = capture('error');

  const window_onerror = window.onerror;
  window.onerror = function onError() {
    captureUnhandled.call(this, arguments);
    window_onerror.call(this, arguments);
  };
  window.logEvents = [];
}());