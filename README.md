# Mermaid 在线图表导出器

一个基于 Next.js 的在线 Mermaid 图表编辑和导出工具，支持实时编辑、画布预览、主题切换和 SVG 导出。

在线演示：[https://mermaid-exporter-delta.vercel.app/](https://mermaid-exporter-delta.vercel.app/)

## 功能特性

- **实时编辑预览**：使用 Monaco Editor 编写 Mermaid 代码。
- **Leafer 画布预览**：Mermaid 生成 SVG 后，通过 Leafer 渲染到画布中，支持更好的预览交互。
- **全屏预览**：预览区支持一键全屏，方便查看复杂图表。
- **多主题支持**：支持 Mermaid 内置主题切换。
- **示例模板**：提供常用图表模板，快速开始。
- **SVG 导出**：支持导出高质量 SVG 图表。
- **响应式布局**：适配桌面端和移动端。

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Mermaid
- Leafer UI
- Monaco Editor

## 快速开始

```bash
pnpm install
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

```text
http://localhost:3000
```

生产构建：

```bash
pnpm build
pnpm start
```

## 项目结构

```text
src/
├── app/
│   ├── editor/
│   ├── help/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    ├── ExampleTemplates.tsx
    ├── ExportPanel.tsx
    ├── MermaidEditor.tsx
    ├── MermaidPreview.tsx
    ├── Navigation.tsx
    └── ThemeSelector.tsx
```

## 使用方式

1. 打开 `/editor`。
2. 输入 Mermaid 代码，或选择示例模板。
3. 在右侧查看 Leafer 画布预览。
4. 需要查看大图时，点击预览区右上角全屏按钮。
5. 点击导出按钮下载 SVG。

## 许可证

MIT

## 致谢

- [Mermaid](https://mermaid.js.org/)
- [Leafer](https://www.leaferjs.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Next.js](https://nextjs.org/)
