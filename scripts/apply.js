const fs = require('fs');
const path = require('path');

// --- 配置 ---
// macOS 上 Cursor 的默认安装路径。如果您的安装位置不同，请修改此路径。
const CURSOR_APP_PATH = '/Applications/Cursor.app';
// --- 配置结束 ---

const WORKBENCH_PATH = 'Contents/Resources/app/out/vs/workbench';
const JS_FILE_NAME = 'workbench.desktop.main.js';

const originalJsPath = path.join(CURSOR_APP_PATH, WORKBENCH_PATH, JS_FILE_NAME);
const backupJsPath = path.join(CURSOR_APP_PATH, WORKBENCH_PATH, `${JS_FILE_NAME}.original`);

const projectRoot = path.resolve(__dirname, '..');
const translationMapPath = path.join(projectRoot, 'translations', 'zh-cn.json');

/**
 * 将翻译应用到 Cursor 核心文件
 */
function applyTranslations() {
    console.log('🚀 开始应用中文语言补丁...');

    // 1. 检查原始文件是否存在
    if (!fs.existsSync(originalJsPath)) {
        console.error(`❌ 错误：在路径 ${originalJsPath} 中找不到原始 JS 文件。`);
        console.error('   请确认 Cursor 已安装，并且脚本中的 CURSOR_APP_PATH 配置是正确的。');
        process.exit(1);
    }

    // 2. 如果备份不存在，则创建备份
    if (!fs.existsSync(backupJsPath)) {
        console.log('✨ 检测到首次运行，正在创建原始文件备份...');
        fs.copyFileSync(originalJsPath, backupJsPath);
        console.log(`   备份已创建于: ${backupJsPath}`);
    }

    // 3. 读取翻译文件
    console.log(`📖 正在读取翻译文件: ${translationMapPath}`);
    const translations = JSON.parse(fs.readFileSync(translationMapPath, 'utf-8'));

    // 4. 从备份文件读取内容，确保每次都从纯净的原始版本开始
    console.log('📄 正在读取原始 JS 文件内容...');
    let content = fs.readFileSync(backupJsPath, 'utf-8');

    // 5. 执行文本替换
    let replacementsCount = 0;
    console.log('🔍 正在查找并替换词条...');
    for (const [original, translated] of Object.entries(translations)) {
        // 使用正则表达式全局替换，确保替换所有出现的地方
        // 通过 `("...` 或 `'...` 来定位，避免错误替换
        const regex = new RegExp(`(["'])${escapeRegExp(original)}\\1`, 'g');
        const originalContent = content;
        content = content.replace(regex, `$1${translated}$1`);

        if (originalContent !== content) {
            console.log(`  ✅ 已替换 "${original}" -> "${translated}"`);
            replacementsCount++;
        } else {
            console.warn(`  ⚠️  警告：在文件中未找到词条 "${original}"`);
        }
    }

    if (replacementsCount === 0) {
        console.error('❌ 错误: 未执行任何替换。请检查 zh-cn.json 中的词条是否正确。');
        process.exit(1);
    }

    // 6. 将修改后的内容写回目标文件
    console.log(`✍️ 正在将翻译后的内容写入: ${originalJsPath}`);
    fs.writeFileSync(originalJsPath, content, 'utf-8');

    console.log('\n🎉 补丁成功应用！请完全重启 Cursor (Cmd+Q) 以查看效果。');
}

/**
 * 从备份还原原始文件
 */
function restoreOriginal() {
    console.log('🚀 开始还原原始英文文件...');
    if (fs.existsSync(backupJsPath)) {
        fs.copyFileSync(backupJsPath, originalJsPath);
        console.log('✅ 已从备份还原原始文件。');
        fs.unlinkSync(backupJsPath);
        console.log('🗑️ 备份文件已删除。');
        console.log('\n🎉 还原成功！请重启 Cursor。');
    } else {
        console.warn('🤷‍♂️ 未找到备份文件，无需还原。');
    }
}

/**
 * 用于转义字符串中的正则表达式特殊字符
 * @param {string} string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


// --- 脚本入口 ---
const command = process.argv[2];

if (command === 'restore') {
    restoreOriginal();
} else {
    applyTranslations();
} 