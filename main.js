/**
 * add word to momo vocab
 */

const { 
  processAddWords, 
} = require('./src/index');

function supportLanguages() {
    return ['auto', 'zh-Hans', 'en'];
}

/**
 * Bob translate interface
 * @param {Object} query Bob query object
 */
function translate(query) {
  const { text, detectFrom, onCompletion } = query;
  const { momoToken, notepadName, enableLemmatization, aiApiKey } = $option;

  if (detectFrom !== "en") {
    onCompletion({
      error: {
        type: "unsupportedLanguage",
        message: "只支持添加英文单词",
      },
    });
    return;
  }

  if (!momoToken) {
    onCompletion({
      error: {
        type: "secretKey",
        message: "请先配置墨墨背单词 Token",
      },
    });
    return;
  }

  const trimmedText = text.trim();
  
  if (!trimmedText || trimmedText.split(/\s+/).length > 2) {
    onCompletion({
      error: {
        type: "invalidFormat",
        message: "未识别到有效单词",
      },
    });
    return;
  }
  
  const word = trimmedText;
  
  const useLemmatization = (enableLemmatization === '1' && aiApiKey);
  
  // return success response immediately
  onCompletion({
    result: {
      toParagraphs: [`${word} 添加${useLemmatization ? ' (将使用词形还原)' : ''}成功`],
    },
  });

  processAddWords([word], notepadName, useLemmatization);
}

module.exports = {
  supportLanguages,
  translate
};
