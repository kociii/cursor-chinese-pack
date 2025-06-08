const fs = require('fs');
const path = require('path');
const os = require('os');

// --- 配置 ---
const JS_FILE_NAME = 'workbench.desktop.main.js';
const JS_FILE_SUB_PATH = path.join('out', 'vs', 'workbench');
// --- 配置结束 ---

/**
 * 自动寻找或使用指定的 Cursor 安装路径
 * @param {string | undefined} customPath 用户提供的自定义路径
 * @returns {string | null} Cursor 的安装路径或 null
 */
function findCursorPath(customPath) {
    if (customPath) {
        if (fs.existsSync(customPath)) {
            console.log(`✅ 使用了自定义路径: ${customPath}`);
            return customPath;
        } else {
            console.error(`❌ 错误: 自定义路径不存在: ${customPath}`);
            process.exit(1);
        }
    }

    let defaultPath;
    const platform = os.platform();

    if (platform === 'darwin') { // macOS
        defaultPath = '/Applications/Cursor.app';
    } else if (platform === 'win32') { // Windows
        const localAppData = process.env.LOCALAPPDATA;
        const programFiles = process.env.ProgramFiles;
        const potentialPaths = [
            localAppData && path.join(localAppData, 'Programs', 'Cursor'),
            programFiles && path.join(programFiles, 'Cursor'),
        ].filter(Boolean);

        for (const p of potentialPaths) {
            if (fs.existsSync(p)) {
                defaultPath = p;
                break;
            }
        }
    } else { // Linux
        const potentialPaths = [
            path.join(os.homedir(), '.local/share/cursor'),
            '/opt/cursor'
        ];
        for (const p of potentialPaths) {
            if (fs.existsSync(p)) {
                defaultPath = p;
                break;
            }
        }
    }

    if (defaultPath && fs.existsSync(defaultPath)) {
        console.log(`✅ 自动检测到 Cursor 安装路径: ${defaultPath}`);
        return defaultPath;
    }

    console.error('\n❌ 错误: 未能自动检测到 Cursor 安装路径。');
    console.error('   请在命令后面添加您的 Cursor 安装路径作为参数。');
    console.error('   例如: npm run apply -- "/path/to/your/cursor/installation"');
    process.exit(1);
}


/**
 * 获取平台特定的资源文件路径
 * @param {string} cursorPath Cursor 安装根路径
 * @returns {{appPath: string, targetFile: string, backupFile: string}}
 */
function getPlatformPaths(cursorPath) {
    let appPath;
    const platform = os.platform();

    if (platform === 'darwin') {
        appPath = path.join(cursorPath, 'Contents', 'Resources', 'app');
    } else { // Windows, Linux
        appPath = path.join(cursorPath, 'resources', 'app');
    }

    const targetFile = path.join(appPath, JS_FILE_SUB_PATH, JS_FILE_NAME);
    const backupFile = `${targetFile}.original`;

    return { appPath, targetFile, backupFile };
}


/**
 * 将翻译应用到 Cursor 核心文件
 * @param {('direct'|'bilingual')} mode 翻译模式
 * @param {string} cursorPath Cursor 安装路径
 */
function applyTranslations(mode, cursorPath) {
    console.log(`🚀 开始应用中文语言补丁 (模式: ${mode})...`);
    const { targetFile, backupFile } = getPlatformPaths(cursorPath);

    // 1. 检查原始文件是否存在
    if (!fs.existsSync(targetFile)) {
        console.error(`❌ 错误：在路径 ${targetFile} 中找不到目标文件。`);
        console.error('   请确认 Cursor 安装正确，或手动指定正确的路径。');
        process.exit(1);
    }

    // 2. 如果备份不存在，则创建备份
    if (!fs.existsSync(backupFile)) {
        console.log('✨ 检测到首次运行，正在创建原始文件备份...');
        fs.copyFileSync(targetFile, backupFile);
        console.log(`   备份已创建于: ${backupFile}`);
    } else {
        console.log('ℹ️  备份文件已存在，跳过备份步骤。');
    }

    // 3. 读取翻译文件并处理嵌套结构
    const projectRoot = path.resolve(__dirname, '..');
    const translationMapPath = path.join(projectRoot, 'translations', 'zh-cn.json');
    console.log(`📖 正在读取翻译文件: ${translationMapPath}`);
    const groupedTranslations = JSON.parse(fs.readFileSync(translationMapPath, 'utf-8'));

    // 将嵌套的翻译对象扁平化为单层键值对
    const translations = Object.values(groupedTranslations).reduce((acc, group) => {
        return { ...acc, ...group };
    }, {});


    // 4. 从备份文件读取内容，确保每次都从纯净的原始版本开始
    console.log('📄 正在读取原始 JS 文件内容...');
    let content = fs.readFileSync(backupFile, 'utf-8');

    // 5. 执行文本替换
    let replacementsCount = 0;
    let notFound = [];
    console.log('🔍 正在查找并替换词条...');
    for (const [original, translated] of Object.entries(translations)) {
        // 使用正则表达式全局替换，确保替换所有出现的地方
        // 通过 `("...")` 或 `('...')` 来定位，避免错误替换
        const regex = new RegExp(`(["'])${escapeRegExp(original)}\\1`, 'g');
        const originalContent = content;
        
        let replacementString;
        if (mode === 'bilingual') {
            // 在替换字符串中，需要转义 `$` 字符，防止其被误认为特殊替换模式
            const escapedOriginalForReplacement = original.replace(/\$/g, '$$$$');
            replacementString = `$1${escapedOriginalForReplacement}\\n${translated}$1`;
        } else { // 'direct' 模式
            replacementString = `$1${translated}$1`;
        }
        
        content = content.replace(regex, replacementString);

        if (originalContent !== content) {
            replacementsCount++;
        } else {
            notFound.push(original);
        }
    }

    console.log(`✅ 成功替换 ${replacementsCount} 个词条。`);
    if (notFound.length > 0) {
        console.warn(`\n⚠️  注意：有 ${notFound.length} 个词条在文件中未找到，这可能是因为 Cursor 版本更新。`);
        console.warn('   未找到的词条:', notFound.slice(0, 10).join('", "'), notFound.length > 10 ? '...' : '');
    }

    if (replacementsCount === 0) {
        console.error('\n❌ 错误: 未执行任何替换。请检查:');
        console.error('   1. `zh-cn.json` 中的英文原文是否与代码中的完全一致。');
        console.error('   2. Cursor 是否为最新版本。');
        process.exit(1);
    }

    // 6. 将修改后的内容写回目标文件
    console.log(`✍️  正在将翻译后的内容写入: ${targetFile}`);
    fs.writeFileSync(targetFile, content, 'utf-8');

    console.log('\n🎉 补丁成功应用！请完全重启 Cursor (Cmd+Q 或 Ctrl+Q) 以查看效果。');
}

/**
 * 从备份还原原始文件
 * @param {string} cursorPath Cursor 安装路径
 */
function restoreOriginal(cursorPath) {
    console.log('🚀 开始还原原始英文文件...');
    const { targetFile, backupFile } = getPlatformPaths(cursorPath);

    if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, targetFile);
        console.log('✅ 已从备份还原原始文件。');
        fs.unlinkSync(backupFile);
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


/**
 * 脚本主入口
 */
function main() {
    console.log('--- Cursor 汉化脚本 ---');
    const args = process.argv.slice(2);

    const isRestore = args.includes('restore');

    let mode = 'direct';
    if (args.includes('bilingual')) {
        mode = 'bilingual';
    }

    // 查找路径参数，它不是 'restore', 'bilingual', 或 'direct'
    const pathArg = args.find(arg => !['restore', 'bilingual', 'direct'].includes(arg));

    if (isRestore) {
        console.log('模式: 还原');
    } else {
        console.log(`模式: ${mode === 'bilingual' ? '双语 (保留原文)' : '直接翻译'}`);
    }

    const cursorPath = findCursorPath(pathArg);

    if (isRestore) {
        restoreOriginal(cursorPath);
    } else {
        applyTranslations(mode, cursorPath);
    }
}

main(); 