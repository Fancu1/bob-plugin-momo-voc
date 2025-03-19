/**
 * log utility module
 * supporting writing logs to local files
 */

const config = require('../config');

const { LOG_FILE_PATH, LOG_LEVEL, DEFAULT_LOG_LEVEL } = config;

let currentLogLevel = DEFAULT_LOG_LEVEL;

/**
 * get current timestamp
 * @returns {string} formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString();
}

/**
 * write log to file
 * @param {string} level log level
 * @param {string} message log message
 */
function writeToFile(level, message) {
  try {
    let logContent = "";
    
    // check if log file exists
    if ($file.exists(LOG_FILE_PATH)) {
      // read existing log content
      logContent = $file.read(LOG_FILE_PATH).toUTF8();
      
      // if log file is too large (over 1MB), clear log
      if (logContent.length > 1024 * 1024) {
        logContent = "";
        $log.info("log file is too large, cleared");
      }
    } else {
      // ensure sandbox directory exists
      $file.mkdir("$sandbox");
    }
    
    const logEntry = `[${getTimestamp()}] [${level}] ${message}\n`;
    logContent += logEntry;
    
    // write to log file
    $file.write({
      data: $data.fromUTF8(logContent),
      path: LOG_FILE_PATH
    });
  } catch (e) {
    $log.error(`write log file failed: ${e.message}`);
  }
}

/**
 * record debug log
 * @param {string} message log message
 */
function debug(message) {
  if (currentLogLevel <= LOG_LEVEL.DEBUG) {
    $log.info(`[DEBUG] ${message}`);
    writeToFile("DEBUG", message);
  }
}

/**
 * record info log
 * @param {string} message log message
 */
function info(message) {
  if (currentLogLevel <= LOG_LEVEL.INFO) {
    $log.info(message);
    writeToFile("INFO", message);
  }
}

/**
 * record warning log
 * @param {string} message log message
 */
function warn(message) {
  if (currentLogLevel <= LOG_LEVEL.WARN) {
    $log.info(`[WARN] ${message}`);
    writeToFile("WARN", message);
  }
}

/**
 * record error log
 * @param {string} message log message
 */
function error(message) {
  if (currentLogLevel <= LOG_LEVEL.ERROR) {
    $log.error(message);
    writeToFile("ERROR", message);
  }
}

/**
 * clear log file
 */
function clearLogFile() {
  try {
    if ($file.exists(LOG_FILE_PATH)) {
      $file.write({
        data: $data.fromUTF8(""),
        path: LOG_FILE_PATH
      });
      $log.info("log file cleared");
    }
  } catch (e) {
    $log.error(`clear log file failed: ${e.message}`);
  }
}

/**
 * get log file path
 * @returns {string} log file path
 */
function getLogFilePath() {
  return LOG_FILE_PATH;
}

module.exports = {
  LOG_LEVEL,
  setLogLevel,
  debug,
  info,
  warn,
  error,
  clearLogFile,
  getLogFilePath
}; 
