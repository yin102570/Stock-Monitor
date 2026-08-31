# 股票监控系统 (Stock Monitor)

> 基于React + TypeScript的专业股票投资组合管理与行情监控应用

## 📋 项目概述

本系统是一个功能完善的股票投资管理平台，提供实时行情监控、投资组合管理、AI投资顾问、价格预警等核心功能。采用现代化的React 18 + TypeScript + Material-UI技术栈，为投资者提供直观、高效的股票管理体验。

### 核心功能

- ✅ **仪表盘**：总资产概览、收益率统计、持仓分布可视化
- ✅ **实时行情**：每3秒自动刷新股票价格，实时监控市场动态
- ✅ **投资组合管理**：添加、编辑、删除股票持仓，记录成本价和持股数量
- ✅ **价格预警**：设置目标价格，自动触发涨跌提醒
- ✅ **AI投资顾问**：基于持仓数据提供智能投资建议
- ✅ **价格图表**：可视化股票价格走势，支持历史数据查看
- ✅ **响应式设计**：完美适配桌面端和移动端

---

## 🎯 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    前端展示层 (React 18)                      │
│  ├─ 仪表盘组件 (Dashboard)                                   │
│  ├─ 行情监控组件 (MarketWatch)                               │
│  ├─ 投资组合组件 (Portfolio)                                 │
│  ├─ 价格预警组件 (PriceAlert)                                │
│  ├─ AI顾问组件 (AIAdvisor)                                   │
│  └─ 价格图表组件 (PriceChart)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    状态管理层 (React Hooks)                  │
│  ├─ useState (组件状态)                                       │
│  ├─ useEffect (副作用处理)                                    │
│  └─ useRef (DOM引用)                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    数据层 (Mock Data + localStorage)          │
│  ├─ 模拟股票数据 (mockData.ts)                               │
│  ├─ 本地存储持久化                                            │
│  └─ 实时数据模拟 (定时刷新)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈

| 技术组件 | 版本 | 用途 |
|---------|------|------|
| React | 18.3.1 | 前端框架 |
| TypeScript | 5.x | 类型安全 |
| Material-UI | 7.3.7 | UI组件库 |
| Recharts | 3.7.0 | 数据可视化 |
| TailwindCSS | 3.4.17 | 样式框架 |
| Vite | 5.x | 构建工具 |
| React Icons | 5.5.0 | 图标库 |

---

## 🔬 核心功能实现

### 1. 仪表盘 (Dashboard)

**功能描述**：展示投资组合的整体概况

**实现逻辑**：
```typescript
// 计算总资产
const totalAssets = portfolio.reduce((sum, item) => 
  sum + (item.currentPrice * item.quantity), 0
);

// 计算总成本
const totalCost = portfolio.reduce((sum, item) => 
  sum + (item.avgCost * item.quantity), 0
);

// 计算总收益率
const totalReturn = ((totalAssets - totalCost) / totalCost) * 100;
```

**展示内容**：
- 总资产金额
- 总成本
- 总盈亏金额
- 总收益率（百分比）
- 持仓分布饼图
- 收益趋势图

### 2. 实时行情监控 (MarketWatch)

**功能描述**：实时显示股票价格，自动刷新

**实现逻辑**：
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // 模拟价格波动
    setStocks(prevStocks =>
      prevStocks.map(stock => ({
        ...stock,
        price: stock.price * (1 + (Math.random() - 0.5) * 0.02),
        change: (Math.random() - 0.5) * 10
      }))
    );
  }, 3000); // 每3秒刷新

  return () => clearInterval(interval);
}, []);
```

**特点**：
- 3秒自动刷新
- 价格涨跌颜色标识（红涨绿跌）
- 涨跌幅百分比显示
- 股票代码和名称展示

### 3. 投资组合管理 (Portfolio)

**功能描述**：管理用户的股票持仓

**数据结构**：
```typescript
interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  profit: number;
  profitPercent: number;
}
```

**核心操作**：
- **添加持仓**：输入股票代码、名称、数量、成本价
- **编辑持仓**：修改持仓数量或成本价
- **删除持仓**：从投资组合中移除股票
- **实时更新**：持仓市值随行情实时变化

**计算逻辑**：
```typescript
// 市值 = 当前价格 × 持股数量
marketValue = currentPrice * quantity;

// 盈亏 = 市值 - 成本
profit = marketValue - (avgCost * quantity);

// 盈亏比例 = 盈亏 / 成本 × 100%
profitPercent = (profit / (avgCost * quantity)) * 100;
```

### 4. 价格预警 (PriceAlert)

**功能描述**：设置价格阈值，自动触发提醒

**数据结构**：
```typescript
interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  type: 'above' | 'below'; // 高于或低于
  triggered: boolean;
}
```

**实现逻辑**：
```typescript
useEffect(() => {
  alerts.forEach(alert => {
    const stock = stocks.find(s => s.symbol === alert.symbol);
    if (!stock || alert.triggered) return;

    const shouldTrigger = alert.type === 'above' 
      ? stock.price >= alert.targetPrice
      : stock.price <= alert.targetPrice;

    if (shouldTrigger) {
      // 触发预警
      alertTriggered(alert);
    }
  });
}, [stocks, alerts]);
```

**特点**：
- 支持高于/低于两种预警类型
- 预警状态跟踪
- 已触发的预警标记
- 删除预警功能

### 5. AI投资顾问 (AIAdvisor)

**功能描述**：基于持仓数据提供智能投资建议

**实现逻辑**：
```typescript
const analyzePortfolio = (portfolio: Position[]) => {
  // 1. 计算整体收益率
  const totalReturn = calculateTotalReturn(portfolio);
  
  // 2. 分析持仓分布
  const distribution = analyzeDistribution(portfolio);
  
  // 3. 识别风险点
  const risks = identifyRisks(portfolio);
  
  // 4. 生成建议
  const suggestions = generateSuggestions(totalReturn, distribution, risks);
  
  return suggestions;
};
```

**建议类型**：
- **风险提示**：单一持仓占比过高
- **收益分析**：整体盈亏情况
- **调仓建议**：基于市场表现的建议
- **分散化建议**：投资组合优化

### 6. 价格图表 (PriceChart)

**功能描述**：可视化股票价格历史走势

**技术实现**：
- 使用Recharts库绘制折线图
- 支持多只股票对比
- 时间范围选择（1天、1周、1月）
- 交互式数据提示

**数据格式**：
```typescript
interface PriceData {
  time: string;
  price: number;
}
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器
- 现代浏览器（Chrome、Firefox、Edge、Safari）

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/yin102570/Stock-Monitor.git
cd Stock-Monitor
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **访问应用**
打开浏览器访问：http://localhost:5173

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建产物将输出到 `dist/` 目录。

---

## 📖 使用指南

### 基本操作流程

1. **查看仪表盘**
   - 启动应用后默认显示仪表盘
   - 查看总资产、收益率、持仓分布

2. **监控实时行情**
   - 切换到"行情监控"标签页
   - 查看股票实时价格（每3秒刷新）
   - 价格涨跌颜色区分（红涨绿跌）

3. **管理投资组合**
   - 切换到"投资组合"标签页
   - 点击"添加持仓"按钮
   - 输入股票代码、名称、数量、成本价
   - 点击"保存"完成添加
   - 可以编辑或删除已有持仓

4. **设置价格预警**
   - 切换到"价格预警"标签页
   - 点击"添加预警"按钮
   - 选择股票代码
   - 输入目标价格
   - 选择预警类型（高于/低于）
   - 点击"保存"完成设置

5. **获取AI建议**
   - 切换到"AI顾问"标签页
   - 查看基于持仓的智能建议
   - 建议包括风险提示、收益分析等

6. **查看价格图表**
   - 点击任意股票的"查看图表"按钮
   - 查看该股票的价格走势图
   - 支持不同时间范围切换

### 数据持久化

应用使用 `localStorage` 保存数据，包括：
- 投资组合持仓
- 价格预警设置
- 用户偏好设置

关闭浏览器后数据不会丢失。

---

## 📁 项目结构

```
stock-monitor/
├── src/
│   ├── components/           # 组件目录
│   │   ├── Dashboard.tsx     # 仪表盘组件
│   │   ├── MarketWatch.tsx   # 行情监控组件
│   │   ├── Portfolio.tsx     # 投资组合组件
│   │   ├── PriceAlert.tsx    # 价格预警组件
│   │   ├── AIAdvisor.tsx     # AI顾问组件
│   │   ├── PriceChart.tsx    # 价格图表组件
│   │   └── StatsCard.tsx     # 统计卡片组件
│   ├── data/
│   │   └── mockData.ts       # 模拟数据
│   ├── types/
│   │   └── index.ts          # TypeScript类型定义
│   ├── utils/
│   │   └── formatters.ts     # 格式化工具函数
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── public/                   # 静态资源
├── dist/                     # 构建产物
├── index.html                # HTML入口
├── package.json              # 项目配置
├── vite.config.ts            # Vite配置
├── tsconfig.json             # TypeScript配置
├── tailwind.config.js        # TailwindCSS配置
└── README.md                 # 项目文档
```

### 核心文件说明

| 文件路径 | 行数 | 作用 |
|---------|------|------|
| `src/App.tsx` | 343 | 主应用，管理所有状态和路由 |
| `src/components/Dashboard.tsx` | ~150 | 仪表盘，展示资产概览 |
| `src/components/MarketWatch.tsx` | ~120 | 行情监控，实时刷新 |
| `src/components/Portfolio.tsx` | ~200 | 投资组合管理 |
| `src/components/PriceAlert.tsx` | ~100 | 价格预警设置 |
| `src/components/AIAdvisor.tsx` | ~400 | AI投资顾问，生成建议 |
| `src/components/PriceChart.tsx` | ~80 | 价格图表可视化 |
| `src/data/mockData.ts` | ~150 | 模拟股票数据 |

---

## 🔧 技术实现细节

### 1. 状态管理

使用React Hooks进行状态管理：

```typescript
// 投资组合状态
const [portfolio, setPortfolio] = useState<Position[]>([]);

// 行情数据状态
const [stocks, setStocks] = useState<Stock[]>(mockStocks);

// 价格预警状态
const [alerts, setAlerts] = useState<Alert[]>([]);

// 加载状态
const [loading, setLoading] = useState(false);
```

### 2. 数据持久化

使用localStorage保存数据：

```typescript
// 保存到localStorage
useEffect(() => {
  localStorage.setItem('portfolio', JSON.stringify(portfolio));
}, [portfolio]);

// 从localStorage加载
useEffect(() => {
  const saved = localStorage.getItem('portfolio');
  if (saved) {
    setPortfolio(JSON.parse(saved));
  }
}, []);
```

### 3. 实时数据刷新

使用setInterval实现定时刷新：

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // 更新股票价格
    updateStockPrices();
  }, 3000); // 3秒刷新

  return () => clearInterval(interval);
}, []);
```

### 4. 性能优化

- **防抖处理**：搜索输入使用防抖
- **虚拟列表**：大量数据时使用虚拟滚动
- **React.memo**：组件 memo 优化渲染
- **useMemo**：缓存计算结果

```typescript
// 使用useMemo缓存计算结果
const totalAssets = useMemo(() => {
  return portfolio.reduce((sum, item) => 
    sum + item.currentPrice * item.quantity, 0
  );
}, [portfolio]);
```

### 5. 类型安全

完整的TypeScript类型定义：

```typescript
// 股票类型
interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// 持仓类型
interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  profit: number;
  profitPercent: number;
}

// 预警类型
interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  type: 'above' | 'below';
  triggered: boolean;
}
```

---

## 🎨 界面设计

### 颜色系统

| 用途 | 颜色 | 说明 |
|------|------|------|
| 主色调 | #1976d2 | Material-UI蓝色 |
| 涨幅 | #f44336 | 红色表示上涨 |
| 跌幅 | #4caf50 | 绿色表示下跌 |
| 背景 | #ffffff | 白色背景 |
| 文本 | #333333 | 深灰文本 |
| 边框 | #e0e0e0 | 浅灰边框 |

### 布局设计

- **顶部导航栏**：应用标题和标签页导航
- **主内容区**：根据标签页显示不同内容
- **响应式布局**：移动端自动调整布局

### 组件样式

- 使用Material-UI组件库
- TailwindCSS辅助样式
- 自定义CSS动画效果

---

## 📊 数据流程

```
用户操作 → 组件事件处理 → 状态更新
    ↓
计算衍生数据 → useMemo缓存 → UI渲染
    ↓
localStorage持久化 → 下次加载恢复
```

### 数据更新流程示例

1. **用户添加持仓**
   ```
   输入表单 → 验证数据 → 更新portfolio状态
   → 触发useEffect → 保存到localStorage
   ```

2. **行情刷新**
   ```
   setInterval触发 → 更新stocks状态
   → 重新计算持仓市值 → UI自动更新
   ```

3. **预警触发**
   ```
   stocks更新 → 检查预警条件
   → 触发预警 → 更新alert状态 → 显示通知
   ```

---

## 🔮 未来规划

### 短期计划
- [ ] 接入真实股票API
- [ ] 增加更多技术指标
- [ ] 支持多币种
- [ ] 添加更多图表类型

### 中期计划
- [ ] 用户认证系统
- [ ] 云端数据同步
- [ ] 社区分享功能
- [ ] 新闻资讯聚合

### 长期计划
- [ ] 移动端App
- [ ] AI深度学习模型
- [ ] 自动化交易策略
- [ ] 社交投资功能

---

## 🐛 已知问题

1. **模拟数据**：当前使用模拟数据，未接入真实API
2. **数据限制**：localStorage有存储大小限制（约5MB）
3. **刷新频率**：3秒刷新可能在高频交易场景下不够

---

## ⚠️ 免责声明

1. **非投资建议**：本应用仅供学习和演示，不构成投资建议
2. **数据模拟**：当前使用模拟数据，请勿用于真实交易
3. **风险自担**：投资有风险，入市需谨慎
4. **数据延迟**：模拟数据存在延迟，不保证实时性

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 贡献方式

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 代码规范

- 使用TypeScript编写代码
- 遵循ESLint规范
- 添加必要的注释
- 编写单元测试

---

## 📄 许可证

本项目采用 MIT 许可证

---

## 👨‍💻 作者

**尹家艺** (Jiayi Yin)
- Email: qzasdf123@outlook.com
- GitHub: [yin102570](https://github.com/yin102570)

---

## 🙏 致谢

感谢以下开源项目：
- [React](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Recharts](https://recharts.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 [GitHub Issue](https://github.com/yin102570/myopia-risk-app/issues)
- 发送邮件至：qzasdf123@outlook.com

---

**⭐ 如果这个项目对你有帮助，请给个Star支持一下！**
