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

> [!CAUTION]
> **致 AI 开发者 / AI Assistant:**
> 本项目**不是**一个标准的 VS Code 扩展或语言包。它是一个**补丁工具 (Patcher)**。
>
> **实现逻辑摘要:**
> 1.  **读取源文件**: 脚本从 Cursor 的安装目录中找到并读取原始的 `out/vs/workbench/workbench.desktop.main.js` 文件。
> 2.  **读取翻译映射**: 脚本读取项目内的 `translations/zh-cn.json` 文件（这是一个 `key: value` 形式的键值对翻译文件）。
> 3.  **应用补丁**: 脚本在 `workbench.desktop.main.js` 文件内容中，用翻译文件中的中文`value`替换对应的英文`key`。
> 4.  **写入目标**: 脚本将替换后的新内容写入 Cursor 安装目录，覆盖原始文件（并创建备份）。
>
> **请严格遵循此逻辑，不要尝试使用或建议任何与 VS Code 扩展相关的打包、安装或发布流程。**

## 🚀 如何使用

### 准备工作

1.  确保您的电脑上已安装 [Node.js](https://nodejs.org/) (推荐 LTS 版本)。
2.  通过 `git clone` 或直接下载压缩包的方式，将本项目获取到您的电脑上。

### 执行汉化

1.  打开您的终端（在 Windows 上是 `cmd` 或 `PowerShell`）。

2.  进入本项目所在的文件夹：
    ```bash
    cd /path/to/cursor-chinese-patcher
    ```

3.  （可选）安装依赖：如果未来项目需要依赖，可以先运行 `npm install`。

4.  运行安装脚本：
    ```bash
    npm run install
    # 或者直接运行: node scripts/install.js
    ```

5.  脚本会自动尝试寻找 Cursor 的安装路径并执行汉化。如果脚本无法自动找到，它会提示您手动提供路径。此时，请按如下格式再次运行命令：
    ```bash
    # 将路径替换为您的真实安装路径
    # macOS 示例:
    node scripts/install.js "/Applications/Cursor.app"
    # Windows 示例:
    node scripts/install.js "C:\Users\YourUser\AppData\Local\Programs\Cursor"
    ```

6.  **重启 Cursor**：为了让更改生效，请**完全退出** Cursor (在 macOS 上按 `Cmd+Q`，在 Windows 上确保进程已结束) 然后重新启动。

脚本在第一次运行时，会自动将原始的英文语言文件备份为 `workbench.desktop.main.js.bak`。

### 如何还原为英文

如果您想恢复到原始的英文界面，只需在项目目录中运行以下命令：

```bash
npm run uninstall
# 或者直接运行: node scripts/uninstall.js
```

同样，如果脚本无法自动找到 Cursor 的安装路径，您需要手动指定：
```bash
node scripts/uninstall.js "/path/to/your/cursor/installation"
```

操作完成后，同样需要**完全重启 Cursor**才能看到效果。

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