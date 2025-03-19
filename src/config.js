/**
 * config
 */

// momo
const API_ENDPOINT = "https://open.maimemo.com/open/api/v1";
const DEFAULT_NOTEPAD_NAME = "Bob-Plugin";

// log
const LOG_FILE_PATH = "$sandbox/momo-voc.log";
const LOG_LEVEL = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};
const DEFAULT_LOG_LEVEL = LOG_LEVEL.INFO;

// cache
const PENDING_WORDS_CACHE_PATH = "$sandbox/pending_words.json";

module.exports = {
  API_ENDPOINT,
  PENDING_WORDS_CACHE_PATH,
  DEFAULT_NOTEPAD_NAME,
  LOG_FILE_PATH,
  LOG_LEVEL,
  DEFAULT_LOG_LEVEL
};
