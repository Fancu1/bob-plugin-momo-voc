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

// ai
const BASE_FORM_CONVERTER_PROMPT = "Return the base form of any word or phrase by removing regular inflectional endings. Convert regularly inflected forms to their root (e.g., change 'running' to 'run', 'books' to 'book', 'watches' to 'watch'). Preserve irregular forms as separate entries (keep 'mice', 'went', 'better' as they are). This helps standardize vocabulary entries while maintaining important irregular forms for memorization.";

module.exports = {
  API_ENDPOINT,
  PENDING_WORDS_CACHE_PATH,
  DEFAULT_NOTEPAD_NAME,
  LOG_FILE_PATH,
  LOG_LEVEL,
  DEFAULT_LOG_LEVEL,
  BASE_FORM_CONVERTER_PROMPT
};
