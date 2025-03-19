/**
 * Bob 翻译插件入口文件
 * 墨墨云词本插件 - 将查询的单词添加到墨墨背单词
 */

const { 
  processAddWords, 
  clearDebugLogs, 
  getDebugLogPath 
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
  const { momoToken, notepadName } = $option;

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

  // handle debug commands
  if (text.trim().startsWith("!debug")) {
    handleDebugCommands(text, onCompletion);
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
  
  // return success response immediately
  onCompletion({
    result: {
      toParagraphs: [`${word} 添加成功`],
    },
  });

  processAddWords([word], notepadName);
}

/**
 * handle debug commands
 * @param {string} text input text
 * @param {Function} onCompletion completion callback
 */
function handleDebugCommands(text, onCompletion) {
  const command = text.trim().toLowerCase();
  
  if (command === "!debug clear") {
    clearDebugLogs();
    onCompletion({
      result: {
        toParagraphs: ["日志已清空"],
      },
    });
  } else if (command === "!debug path") {
    onCompletion({
      result: {
        toParagraphs: [`日志路径: ~/Library/Containers/com.hezongyidev.Bob/Data/Documents/InstalledPluginSandbox/你的插件ID/momo-voc-debug.log`],
      },
    });
  } else if (command === "!debug help") {
    onCompletion({
      result: {
        toParagraphs: [
          "=== 调试命令帮助 ===",
          "!debug clear - 清空日志文件",
          "!debug path - 显示日志文件路径",
          "!debug help - 显示此帮助信息"
        ],
      },
    });
  } else {
    onCompletion({
      result: {
        toParagraphs: [
          "未知的调试命令，可用命令：",
          "!debug clear - 清空日志文件",
          "!debug path - 显示日志文件路径",
          "!debug help - 显示帮助信息"
        ],
      },
    });
  }
}


module.exports = {
  supportLanguages,
  translate
};
