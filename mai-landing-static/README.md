---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 3046022100e56d9fa9ab0fdd03ca03a28a37a40ffd013a5ea56935dfdad1a71933513e4508022100ec5dd13971ab673fbeaf1e4858f467b6fe9654c509d61c8b7ae5f3f8b69145cf
    ReservedCode2: 304402204f9920afa3fb1de117dc2f9eb0080ed0ec6e8e1f7fc41743aa9746f52618098d022019876c21600d6a0089a5ccb8722893e3561fc941f97652d436d776dc92ab3f96
---

# M.AI Landing Page - 静态文件

这是M.AI科技公司Landing Page的静态文件版本。

## 文件结构

```
mai-landing-static/
├── index.html          # 主HTML文件
├── assets/
│   ├── index-DFAciXZ8.js    # JavaScript文件
│   └── index-yzagm9RC.css   # CSS文件
└── README.md           # 说明文件
```

## 使用方法

### 方法1：直接在浏览器中打开
1. 双击 `index.html` 文件
2. 将在默认浏览器中打开网站

### 方法2：使用本地服务器
如果您想要更好的开发体验，可以使用简单的HTTP服务器：

```bash
# 使用Python 3
python -m http.server 8000

# 使用Node.js (需要先安装 http-server)
npx http-server

# 使用PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

## 特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 使用Inter字体
- ✅ 银灰色科技感配色方案
- ✅ Hero区域使用GrainGradient动效背景
- ✅ 纯静态文件，无需服务器端支持

## 技术栈

- React (构建工具生成的静态文件)
- TypeScript
- Tailwind CSS
- @paper-design/shaders-react (GrainGradient组件)