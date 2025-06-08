# Cursor 中文本地化补丁

这是一个为 [Cursor](https://cursor.sh/) 编辑器提供非官方中文本地化的补丁工具。

由于 Cursor 的部分界面文本（尤其是一些自定义设置）是直接编译在核心 JavaScript 文件中的，无法通过标准的 VS Code 语言包插件进行翻译。本项目通过直接读取并修改这些核心文件，实现了对这些特殊文本的中文本地化。

## ✨ 特性

- **独立的翻译文件**：所有翻译内容都集中在 `translations/zh-cn.json` 文件中，方便维护和贡献。
- **安全备份与还原**：脚本会自动备份原始文件，并提供一键还原功能，随时可在中英文间切换。
- **简单易用**：通过简单的 npm 命令即可应用或还原翻译。

## 🚀 如何使用

### 准备工作

1.  确保您的电脑上已安装 [Node.js](https://nodejs.org/) (推荐 LTS 版本)。
2.  将本项目克隆或下载到您的电脑上。

### 安装与应用

1.  **进入项目目录**：
    ```bash
    cd /path/to/cursor-chinese-pack
    ```

2.  **应用中文补丁**：
    ```bash
    npm run translate
    ```
    该命令会执行 `scripts/apply.js` 脚本，它将：
    - 自动在 Cursor 安装目录创建原始文件的备份（`workbench.desktop.main.js.original`）。
    - 读取 `translations/zh-cn.json` 中的词条。
    - 将翻译写入 Cursor 的核心文件中。

3.  **重启 Cursor**：
    为了让更改生效，请**完全退出** Cursor (在 macOS 上按 `Cmd+Q`) 然后重新启动。

### 还原为英文

如果您想恢复到原始的英文界面，可以运行以下命令：

```bash
npm run restore
```
该命令会将备份的原始文件恢复。同样，操作完成后需要**完全重启 Cursor**。

## ✍️ 如何贡献翻译

1.  打开 `translations/zh-cn.json` 文件。
2.  这是一个简单的 JSON 文件，格式为 `"英文原文": "中文译文"`。
3.  您可以修改现有翻译，或添加新的词条。
4.  保存文件后，重新运行 `npm run translate` 并重启 Cursor 即可看到您的更改。

## ⚠️ 注意事项

- **Cursor 版本更新**：当 Cursor 进行版本更新时，其核心文件 `workbench.desktop.main.js` 可能会被覆盖。如果更新后发现翻译失效，您只需**重新运行一次 `npm run translate`** 即可。
- **脚本路径**：本脚本默认 Cursor 安装在 macOS 的标准路径 (`/Applications/Cursor.app`)。如果您的安装路径不同，请修改 `scripts/apply.js` 文件顶部的 `CURSOR_APP_PATH` 变量。 