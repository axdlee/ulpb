# 双拼练习大师 🎯

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](package.json)
[![Vue](https://img.shields.io/badge/Vue-3.0+-4FC08D.svg)](https://vuejs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-1.0+-FFC131.svg)](https://tauri.app/)

> 现代化、智能化的双拼输入法学习应用，助您高效掌握双拼输入技能

![应用截图](docs/images/screenshot.png)

## ✨ 特性亮点

### 🎯 核心功能
- **智能学习系统** - 自适应难度调节，个性化学习路径
- **多方案支持** - 内置小鹤双拼、微软双拼等主流方案
- **自定义方案** - 支持创建和导入自定义双拼方案
- **游戏化练习** - 趣味游戏模式，寓教于乐
- **详细统计** - 全方位数据分析，追踪学习进度

### 🎨 界面设计
- **现代化UI** - 简洁美观的用户界面
- **多主题支持** - 默认、暗黑、明亮、暖色、冷色五种主题
- **响应式布局** - 完美适配桌面和移动设备
- **流畅动画** - 精心设计的交互动效

### 📊 数据管理
- **本地存储** - 学习数据安全存储在本地
- **数据导入导出** - 支持学习进度和设置的备份恢复
- **离线使用** - 无需联网即可完整使用

## 🚀 快速开始

### 系统要求
- **操作系统**: Windows 10+, macOS 10.14+, Linux
- **内存**: 4GB RAM 或更多
- **存储空间**: 100MB 可用空间

### 安装方式

#### 方式一：下载预编译版本（推荐）
1. 访问 [Releases](https://github.com/axdlee/ulpb/releases) 页面
2. 下载适合您操作系统的安装包
3. 运行安装程序并按提示完成安装

#### 方式二：从源码构建
```bash
# 克隆项目
git clone https://github.com/axdlee/ulpb.git
cd ulpb

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建桌面应用
npm run tauri:build
```

## 📚 功能介绍

### 🏠 控制台
- **学习概览** - 查看今日学习进度和统计数据
- **快速入口** - 一键进入各种学习模式
- **智能推荐** - 基于学习情况的个性化建议
- **成就展示** - 展示最新解锁的成就和里程碑

### ⌨️ 键位学习
- **分步指导** - 从声母到韵母的渐进式学习
- **可视化键盘** - 实时显示按键位置和手指定位
- **练习提示** - 智能提供拼音和键位提示
- **进度跟踪** - 详细记录每个键位的掌握程度

### ✍️ 打字练习
- **多种模式** - 字符练习、词汇练习、文章练习
- **实时反馈** - 即时显示速度、准确率等指标
- **错误分析** - 智能识别常见错误并提供改进建议
- **自定义文本** - 支持导入自定义练习材料

### 🎮 趣味游戏
- **打字消除** - 经典的打字消除游戏
- **速度竞赛** - 挑战极限打字速度
- **文字拼图** - 通过拼音组合完成文字拼图
- **挑战模式** - 各种有趣的打字挑战

### 📈 学习统计
- **详细数据** - 练习时长、速度、准确率等完整统计
- **趋势分析** - 学习进度的时间趋势图表
- **对比分析** - 不同时期的学习数据对比
- **导出报告** - 支持导出学习报告

### 🔍 数据分析
- **深度洞察** - AI驱动的学习行为分析
- **个性化建议** - 基于数据的学习优化建议
- **预测模型** - 学习进度和目标达成预测
- **热力图分析** - 可视化展示键位熟练度

### 🏆 成就系统
- **丰富成就** - 多维度的成就体系
- **进度追踪** - 实时显示成就解锁进度
- **激励机制** - 通过成就激励持续学习
- **分享功能** - 可分享学习成就到社交平台

### ⚙️ 设置中心
- **主题配置** - 自由切换界面主题
- **练习设置** - 个性化练习参数调整
- **数据管理** - 学习数据的备份和恢复
- **隐私设置** - 灵活的隐私保护选项

## 🛠️ 技术架构

### 前端技术栈
- **[Vue 3](https://vuejs.org/)** - 渐进式JavaScript框架
- **[Vite](https://vitejs.dev/)** - 现代化构建工具
- **[Pinia](https://pinia.vuejs.org/)** - Vue状态管理库
- **[Vue Router](https://router.vuejs.org/)** - Vue路由管理
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化CSS框架

### 桌面应用
- **[Tauri](https://tauri.app/)** - 安全、快速的桌面应用框架
- **[Rust](https://www.rust-lang.org/)** - 系统级编程语言

### 数据存储
- **LocalStorage** - 本地数据存储
- **JSON** - 配置文件格式

## 📁 项目结构

```
ulpb/
├── src/                    # 前端源码
│   ├── components/         # Vue组件
│   │   ├── base/          # 基础组件
│   │   ├── charts/        # 图表组件
│   │   ├── layout/        # 布局组件
│   │   ├── learning/      # 学习相关组件
│   │   ├── practice/      # 练习相关组件
│   │   ├── stats/         # 统计相关组件
│   │   └── analytics/     # 分析相关组件
│   ├── views/             # 页面组件
│   ├── stores/            # Pinia状态管理
│   ├── router/            # 路由配置
│   ├── utils/             # 工具函数
│   ├── core/              # 核心功能
│   │   ├── typing-engine/ # 打字引擎
│   │   ├── learning-system/ # 学习系统
│   │   ├── analytics/     # 分析引擎
│   │   └── achievements/  # 成就系统
│   ├── data/              # 静态数据
│   └── styles/            # 样式文件
├── src-tauri/             # Tauri后端
│   ├── src/               # Rust源码
│   ├── icons/             # 应用图标
│   └── capabilities/      # 权限配置
├── dist/                  # 构建输出
└── public/                # 静态资源
```

## 🎯 支持的双拼方案

### 内置方案
- **小鹤双拼** - 最受欢迎的双拼方案
- **微软双拼** - Windows系统内置方案
- **搜狗双拼** - 搜狗输入法方案
- **紫光双拼** - 紫光拼音方案
- **智能ABC** - 经典双拼方案

### 自定义方案
- 支持创建完全自定义的双拼方案
- 可导入和分享自定义方案
- 支持方案的备份和恢复

## 🌈 主题系统

### 内置主题
- **默认主题** - 清新的蓝色调
- **暗黑主题** - 护眼的深色模式
- **明亮主题** - 活力的浅色调
- **暖色主题** - 温馨的暖色调
- **冷色主题** - 清爽的冷色调

### 主题特性
- 系统级主题检测
- 自动切换主题
- 自定义主题色彩
- 主题预览功能

## 📊 学习数据

### 统计指标
- **速度指标**: 字符/分钟、词汇/分钟
- **准确率**: 输入准确率、首次正确率
- **时间统计**: 练习时长、专注时间
- **进度指标**: 课程完成度、技能熟练度

### 分析维度
- **时间维度**: 日、周、月、年度统计
- **内容维度**: 字符、词汇、文章分类统计
- **技能维度**: 声母、韵母、特殊键位分析
- **错误维度**: 错误类型、频率、改进趋势

## 🚧 开发指南

### 环境准备
```bash
# 安装Node.js (推荐18+版本)
# 安装Rust (用于Tauri)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 克隆项目
git clone https://github.com/axdlee/ulpb.git
cd ulpb

# 安装依赖
npm install
```

### 开发命令
```bash
# 启动开发服务器
npm run dev

# 构建Web版本
npm run build

# 启动Tauri开发模式
npm run tauri:dev

# 构建桌面应用
npm run tauri:build

# 代码格式化
npm run format

# 代码检查
npm run lint
```

### IDE推荐设置
- **[VS Code](https://code.visualstudio.com/)** + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- **[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)** - Rust语言支持
- **[Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)** 或 **[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** - Vue支持

### 贡献指南
1. Fork 这个项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📝 更新日志

### v2.0.0 (最新版本)
- 🎉 全新的Vue 3 + Tauri架构
- ✨ 重新设计的用户界面
- 🚀 显著提升的性能表现
- 📊 增强的数据分析功能
- 🎮 新增趣味游戏模式
- 🏆 完善的成就系统
- 🌈 多主题支持
- 📱 完全响应式设计

### v1.x.x
- 基础双拼练习功能
- 简单的统计功能
- 基础的学习模式

## 🤝 支持与反馈

### 获取帮助
- 📚 查看[使用文档](docs/user-guide.md)
- 🐛 报告[问题和建议](https://github.com/axdlee/ulpb/issues)
- 💬 加入[讨论社区](https://github.com/axdlee/ulpb/discussions)

### 常见问题
**Q: 如何切换双拼方案？**
A: 在设置页面或头部导航中可以选择不同的双拼方案。

**Q: 学习数据会丢失吗？**
A: 所有数据都保存在本地，支持导出备份，不会丢失。

**Q: 支持哪些操作系统？**
A: 支持Windows、macOS和Linux系统。

**Q: 如何自定义练习内容？**
A: 在练习页面可以导入自定义文本文件进行练习。

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源许可证。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

特别感谢：
- [Vue.js](https://vuejs.org/) 团队提供的优秀框架
- [Tauri](https://tauri.app/) 团队提供的跨平台解决方案
- [Tailwind CSS](https://tailwindcss.com/) 团队提供的CSS框架
- 所有测试用户提供的宝贵反馈

## 🌟 Star历史

[![Star History Chart](https://api.star-history.com/svg?repos=axdlee/ulpb&type=Date)](https://star-history.com/#axdlee/ulpb&Date)

---

<div align="center">

**双拼练习大师** - 让学习双拼变得简单有趣！

Made with ❤️ by the ULPB Team

[下载](https://github.com/axdlee/ulpb/releases) • [文档](docs/) • [讨论](https://github.com/axdlee/ulpb/discussions)

</div>