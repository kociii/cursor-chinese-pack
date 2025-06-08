const fs = require('fs');
const path = require('path');

// 注意：此路径是硬编码的，需要根据您的实际安装位置进行调整
// 对于 macOS 用户，通常是这个路径。
const CURSOR_APP_PATH = '/Applications/Cursor.app';
const ORIGINAL_JS_PATH = path.join(CURSOR_APP_PATH, 'Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js');

const PROJECT_ROOT = path.join(__dirname, '..');
const TRANSLATIONS_DIR = path.join(PROJECT_ROOT, 'translations');
const TRANSLATION_MAP_PATH = path.join(TRANSLATIONS_DIR, 'zh-cn.json');
const OUTPUT_JS_PATH = path.join(TRANSLATIONS_DIR, 'workbench.desktop.main.js');

function build() {
    console.log('开始构建中文语言包...');

    // 1. 检查原始文件是否存在
    if (!fs.existsSync(ORIGINAL_JS_PATH)) {
        console.error(`错误：在路径 ${ORIGINAL_JS_PATH} 中找不到原始的 workbench.desktop.main.js 文件。`);
        console.error('请确认 Cursor 已安装，并且此构建脚本中的路径是正确的。');
        process.exit(1);
    }

    // 2. 读取翻译映射文件
    console.log(`读取翻译文件: ${TRANSLATION_MAP_PATH}`);
    const translations = JSON.parse(fs.readFileSync(TRANSLATION_MAP_PATH, 'utf-8'));

    // 3. 读取原始 JS 文件
    console.log(`读取原始 JS 文件: ${ORIGINAL_JS_PATH}`);
    let originalContent = fs.readFileSync(ORIGINAL_JS_PATH, 'utf-8');

    // 4. 执行替换
    console.log('正在替换文本...');
    for (const [key, value] of Object.entries(translations)) {
        // 我们优先替换 label:"key" 格式，以提高准确性
        const searchStringAsLabel = `label:"${key}"`;
        const replaceStringAsLabel = `label:"${value}"`;
        
        const initialContent = originalContent;
        originalContent = originalContent.replace(new RegExp(searchStringAsLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceStringAsLabel);

        if (initialContent !== originalContent) {
            console.log(`  - 成功替换标签 "${key}" -> "${value}"`);
        } else {
             // 如果找不到 label:"key"，再尝试替换普通的 "key"
            const searchString = `"${key}"`;
            const replaceString = `"${value}"`;
            const secondTryContent = originalContent;
            originalContent = originalContent.replace(new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceString);
            if (secondTryContent !== originalContent) {
                console.log(`  - 成功替换字符串 "${key}" -> "${value}"`);
            } else {
                console.warn(`  - 警告：在文件中未找到词条 "${key}"`);
            }
        }
    }
    
    // 5. 写入构建后的文件
    console.log(`写入已翻译的文件到: ${OUTPUT_JS_PATH}`);
    fs.writeFileSync(OUTPUT_JS_PATH, originalContent, 'utf-8');

    console.log('构建成功！现在您可以打包或安装此插件。');
}

build(); 