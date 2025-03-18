/**
 * config
 */

// momo
const API_ENDPOINT = "https://open.maimemo.com/open/api/v1";
const DEFAULT_NOTEPAD_NAME = "Bob-Plugin";

// log
const LOG_FILE_PATH = "$sandbox/momo-voc.log";
const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// cache
const PENDING_WORDS_CACHE_PATH = "$sandbox/pending_words.json";

module.exports = {
  API_ENDPOINT,
  PENDING_WORDS_CACHE_PATH,
  DEFAULT_NOTEPAD_NAME,
  LOG_FILE_PATH,
  LOG_LEVEL,
};
