/**
 * AI API module for word lemmatization
 */

const logger = require('../utils/logger');
const { BASE_FORM_CONVERTER_PROMPT } = require('../config');

/**
 * Build the API request header
 * @param {string} apiKey - The API key for authentication
 * @returns {Object} The header object
 */
function buildHeader(apiKey) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
}

/**
 * Remove any trailing slashes from the URL
 * @param {string} url - The URL to process
 * @returns {string} The URL without trailing slashes
 */
function ensureNoTrailingSlash(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Convert a word to its base form using AI
 * @param {string} word - The word to convert
 * @returns {Promise<string>} The base form of the word
 */
async function lemmatizeWord(word) {
  const { aiBaseUrl, aiModel, aiApiKey } = $option;
  
  if (!aiBaseUrl || !aiModel || !aiApiKey) {
    logger.warn("AI configuration is incomplete. Using original word.");
    return word;
  }
  
  const baseUrl = ensureNoTrailingSlash(aiBaseUrl);
  const endpoint = `${baseUrl}/v1/chat/completions`;
  const header = buildHeader(aiApiKey);
  
  logger.debug(`Lemmatizing word: ${word} using model: ${aiModel}`);
  
  try {
    const response = await $http.request({
      method: "POST",
      url: endpoint,
      header,
      body: {
        model: aiModel,
        messages: [
          {
            role: "system",
            content: BASE_FORM_CONVERTER_PROMPT
          },
          {
            role: "user",
            content: word
          }
        ],
        temperature: 0.2,
        max_tokens: 50
      }
    });
    
    if (response.error) {
      logger.error(`AI API error: ${JSON.stringify(response.error)}`);
      return word;
    }
    
    const result = response.data;
    if (!result.choices || result.choices.length === 0) {
      logger.error("AI API returned no choices");
      return word;
    }
    
    const lemmatizedWord = result.choices[0].message.content.trim();
    logger.info(`Word "${word}" lemmatized to "${lemmatizedWord}"`);
    
    return lemmatizedWord;
  } catch (error) {
    logger.error(`Error calling AI API: ${error.message}`);
    return word;
  }
}

module.exports = {
  lemmatizeWord
};
