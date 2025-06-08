<!--
 * @description: 
 * @author: liutq
-->
<div align="center">
  <h1>Cursor 简体中文汉化补丁</h1>
  <p>
    一个通过脚本直接修补 Cursor 应用文件，从而实现深度汉化的非官方工具。
  </p>
</div>

# Cursor 中文补丁工具

一个为 Cursor 编辑器提供中文本地化的非官方补丁工具。

## ✨ 功能特性

- **一键汉化**: 自动检测 Cursor 安装路径并应用汉化补丁。
- **两种模式**:
    - **直接翻译**: 将界面英文替换为中文。
    - **双语模式**: 保留英文，在下方换行显示中文，方便对照学习。
- **安全备份**: 首次运行时自动备份原始文件。
- **轻松还原**: 支持一键还原到原始英文界面。
- **跨平台**: 支持 macOS, Windows, 和 Linux。

## 🖥️ 环境要求

- [Node.js](https://nodejs.org/) v16 或更高版本。

## 🚀 使用方法

### 1. 下载项目

你可以通过 `git` 克隆本项目：

```bash
# 注意：请将下面的地址替换为实际的项目仓库地址
git clone https://github.com/your-repo/cursor-chinese-patcher.git
cd cursor-chinese-patcher
```

或者直接下载 ZIP 压缩包并解压。

### 2. 安装依赖

在项目根目录下，打开终端并执行：

```bash
npm install
```

### 3. 应用补丁

**重要提示**: 在操作前，请确保已完全退出 Cursor。

#### 模式一：直接翻译

执行以下命令，将界面替换为中文：

```bash
npm run apply
```

#### 模式二：双语模式 (中英对照)

执行以下命令，将在保留原英文的基础上，换行显示中文：

```bash
npm run apply:bilingual
```

---

**自定义路径**:

如果工具未能自动找到您的 Cursor 安装位置，你可以在命令后手动指定路径：

```bash
# macOS 示例
npm run apply -- "/Users/yourname/Applications/Cursor.app"

# Windows 示例
npm run apply -- "C:\\Users\\yourname\\AppData\\Local\\Programs\\Cursor"
```

### 4. 还原英文

如果你想恢复到原始的英文界面，执行：

```bash
npm run restore
```

## ⚠️ 免责声明

- 本项目是一个非官方工具，通过修改 Cursor 的核心 `workbench.desktop.main.js` 文件来实现汉化。
- 每次 Cursor 更新后，你可能需要重新运行此脚本。
- 请自行承担使用本工具可能带来的任何风险。建议在操作前自行备份重要数据。

## 🤝 贡献

欢迎提交 PR 或 Issue 来帮助改进本项目。

## ✍️ 如何贡献翻译

我们非常欢迎社区贡献，以保持翻译的准确和全面！

1.  核心翻译文件位于 `translations/zh-cn.json`。
2.  该文件是一个 **JSON 键值对 (key-value)** 对象。
3.  `key` 是需要翻译的**英文原文**，`value` 是对应的**中文译文**。
4.  您可以添加新的键值对或修改现有的中文译文。
    ```json
    {
      "Original English Text": "翻译后的中文",
      "Another String to Translate": "另一个翻译好的字符串"
    }
    ```
5.  **重要**：请确保您的修改符合 JSON 格式。`key` 和 `value` 都必须是使用双引号 `"` 包裹的字符串。
6.  完成修改后，重新运行 `npm run install` 即可在您的本地看到更改。欢迎通过 Pull Request 将您的贡献提交到本项目！

## ⚠️ 注意事项

- **Cursor 版本更新**：当 Cursor 更新后，其核心文件 `workbench.desktop.main.js` 可能会发生变动，这可能导致汉化失效或显示不全。届时，需要社区协作，从新版 Cursor 中提取最新的字符串，更新到 `translations/zh-cn.json` 中。
- **管理员权限**：在 Windows 系统上，如果汉化失败，请尝试**以管理员身份运行终端**。

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。 