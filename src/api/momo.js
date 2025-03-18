/**
 * momo api module
 */

const { API_ENDPOINT } = require('../config');
const logger = require('../utils/logger');

/**
 * get request header
 * @returns {Object} request header
 */
function getHeader() {
  const token = $option.momoToken;
  logger.debug(`using token: ${token ? token.substring(0, 10) + '...' : 'undefined'}`);
  return {
    "Content-Type": "application/json",
    Authorization: token.startsWith("Bearer") ? token : `Bearer ${token}`,
  };
}

/**
 * get all notepads list, return name and id key-value pair
 * @returns {Promise<Object[]>} array of objects with name and id key-value pair
 */
async function listNotepads() {
  const header = getHeader();
  return $http.request({
    method: "GET",
    url: `${API_ENDPOINT}/notepads`,
    header,
  }).then((resp) => {
    const response = resp.data;
    return response.data.notepads.map((notepad) => ({
      name: notepad.title,
      id: notepad.id,
    }));
  });
}

/**
 * create new notepad and add words
 * @param {string[]} words words to add
 * @returns {Promise<string>} success message
 */
async function createNotepad(words, notepadName) {
  const header = getHeader();
  const todayDate = new Date().toLocaleDateString("en-CA");
  
  logger.debug(`create new notepad, date: ${todayDate}, words: ${words.join(", ")}`);

  return $http
    .request({
      method: "POST",
      url: `${API_ENDPOINT}/notepads`,
      header,
      body: {
        notepad: {
          status: "PUBLISHED",
          content: `# ${todayDate}\n${words.join("\n")}\n`,
          title: notepadName,
          brief: "new notepad",
          tags: ["词典"],
        },
      },
    })
    .then((resp) => {
      const response = resp.data;
      if (response.success && response.data?.notepad) {
        const notepadId = response.data.notepad.id;
        logger.info(`notepad created successfully, id: ${notepadId}`);
        
        return `notepad created successfully, words ${words.join(", ")} added`;
      } else {
        logger.error(`create notepad failed, response: ${JSON.stringify(response)}`);
        throw new Error(response.message);
      }
    });
}

/**
 * add words to existing notepad
 * @param {string} notepadId notepad id
 * @param {string[]} words words to add
 * @returns {Promise<string>} success message
 */
async function addWordsToNotepad(notepadId, words) {
  const header = getHeader();
  const todayDate = new Date().toLocaleDateString("en-CA");
  
  logger.debug(`add words to notepad ${notepadId}, words: ${words.join(", ")}`);

  return $http
    .request({
      method: "GET",
      url: `${API_ENDPOINT}/notepads/${notepadId}`,
      header,
    })
    .then((resp) => {
      const response = resp.data;
      
      if (response.success && response.data && response.data.notepad) {
        const { status, content, title, brief, tags } = response.data.notepad;
        const lines = content.split("\n").map((line) => line.trim());
        let targetLineIndex = lines.findIndex((line) =>
          line.startsWith(`# ${todayDate}`)
        );

        if (targetLineIndex === -1) {
          logger.debug(`today date not found, add new date title`);
          lines.unshift("");
          lines.unshift(`# ${todayDate}`);
          targetLineIndex = 0;
        }
        lines.splice(targetLineIndex + 1, 0, ...words);
        logger.debug(`new words inserted after date title`);

        return {
          status,
          content: lines.join("\n"),
          title,
          brief,
          tags,
        };
      } else {
        logger.error(`add words to notepad failed, response: ${JSON.stringify(response)}`);
        throw new Error(response.message);
      }
    })
    .then((notepad) => {
      logger.debug(`prepare to update notepad ${notepadId}`);
      return $http.request({
        method: "POST",
        url: `${API_ENDPOINT}/notepads/${notepadId}`,
        header,
        body: {
          notepad,
        },
      });
    })
    .then((resp) => {
      const response = resp.data;
      
      if (response?.success) {
        const successMsg = `words ${words.join(", ")} added to notepad ${notepadId}`;
        logger.info(successMsg);
        return successMsg;
      } else {
        logger.error(`add words to notepad failed, response: ${JSON.stringify(response)}`);
        throw new Error(response.message);
      }
    });
}

module.exports = {
  createNotepad,
  addWordsToNotepad,
  listNotepads,
};
