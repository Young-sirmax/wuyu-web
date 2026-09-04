# 胡说 · 高校国际口语语伴与组局平台（Web 版）

> 由微信小程序「胡说」完整迁移的响应式网页应用。保留原版全部功能与业务逻辑，
> 适配桌面端与移动端浏览器；数据持久化使用 PostgreSQL（部署时经 `DATABASE_URL`
> 指向托管数据库），后端 API 全面接管原微信云函数能力。

## 🚀 线上访问地址

部署完成后，把线上 URL 填写到此处：

**Web 版地址：https://wuyu-web.vercel.app**

> 下方章节附部署方法；也可将本目录推送到任意支持 Node 的平台（Vercel / Netlify /
> Railway / 自有服务器）运行。

---

## 1. 一键部署（Vercel 推荐）

### 方式 A：Vercel 网页控制台

1. 将本仓库推送到 GitHub（或 GitLab）。
2. 打开 https://vercel.com/new ，导入该仓库（Framework Preset 选 **Next.js**，
   构建命令 `npm run build`，输出目录 `.next` 可自动识别）。
3. 在环境变量中添加：

   | 变量 | 说明 |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL 连接串（含库名），例如 `postgresql://user:pass@host:5432/wuyu` |

4. 点击 **Deploy**。首次访问任意页面时，应用会自动创建全部表结构（幂等，重复
   部署安全）；应用不含任何种子 / 演示数据，空库页面显示真实空态。

### 方式 B：命令行（Vercel CLI / Node ≥ 20）

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL production
vercel --prod
```

### 方式 C：Docker / 自有服务器

```bash
docker build -t hushuo-web .
docker run -p 3000:3000 -e DATABASE_URL=postgresql://... hushuo-web
```

或直接：

```bash
npm ci && npm run build && npm start
```

> 首次请求会自动建表（幂等）；应用不含种子 / 演示数据，业务数据全部来自真实操作。

---

## 2. 本地开发

```bash
npm ci
cp .env.example .env.local   # 填入 DATABASE_URL
npm run dev                  # http://localhost:3000
npm run build && npm start   # 生产模式验证
```

---

## 3. 架构与数据模型

| 原小程序（微信云开发） | Web 版（Next.js + PostgreSQL） | 说明 |
| --- | --- | --- |
| `src/services/cloud.ts` 调用云函数 | `src/app/api/*/route.ts`（12 个接口） | 等价 API |
| 云数据库集合 `users` | 表 `users` | 用户，`openid`=浏览器会话 sid |
| 集合 `parties` | 表 `parties` | 组局（host/members 存 jsonb） |
| 集合 `messages` | 表 `messages` | 按用户归属的消息流 |
| 集合 `evaluations` | 表 `evaluations` | 互评（含评价者/被评者） |
| 集合 `toastmasters_clubs` | 表 `toastmasters_clubs` | 头马俱乐部 |
| 集合 `vlogs` | 表 `vlogs` | 练习 Vlog |
| （练习次数统计） | 表 `appointments` | 预约/练习记录 |

**身份与会话**：微信登录（openid）→ 浏览器 `sid` Cookie（`src/middleware.ts`
自动签发）。首次访问即为“游客”，注册后个人数据与消息/互评/组局归属该 sid，
跨设备/浏览器不可互认（与小程序基于微信号的账号体系对等的 Web 形态）。

---

## 4. 与原 App 功能对应关系

| 原 App 页面 | Web 版页面 | 功能说明 |
| --- | --- | --- |
| 发现（首页） | `/home` | 推荐语伴、热门组局、头马俱乐部、口语 Vlog 聚合 |
| 组局 | `/party` | 全部组局 / 我参与的、语言筛选、加入 |
| 组局详情 | `/party-detail` | 组局信息、成员列表、加入/已满状态 |
| 发起组局 | `/create-party` | 标题/话题/语言/学校/时间/地点/人数 |
| 消息 | `/message` | 预约/组局/互评/系统四类消息，未读过滤，点按跳转 |
| 我的 | `/mine` | 资料卡、信用分、评分概览、练习次数、收到的互评、我的组局 |
| 注册 / 完善资料 | `/register` | 昵称/手机号/学号/身份/母语/目标语言/学校/简介 |
| 口语互评 | `/evaluation` | 四维度星级打分 + 文字评价，联动信用分 |
| 用户主页 | `/user-profile` | 语伴公开资料卡、分维度评分、互评入口 |
| 预约详情 | `/appointment-detail` | 接受/婉拒预约，完成后跳互评 |
| 头马演讲俱乐部 | `/toastmasters` | 俱乐部介绍与例会信息 |
| 口语 Vlog | `/vlog` | Vlog 详情与相关推荐 |
| 云函数 login/register | `/api/login` `/api/register` | 会话识别、注册（含 +5 信用分奖励） |
| 云函数 getDiscoverData | `/api/discover` | 首页聚合 |
| 云函数 getParties/createParty/joinParty | `/api/parties*` | 组局列表/创建/加入（满员自动转 full） |
| 云函数 getMyProfile | `/api/profile` | 我的聚合统计（实时计算） |
| 云函数 getMessages | `/api/messages` | 消息列表 + 已读标记 |
| 云函数 submitEvaluation | `/api/evaluate` | 互评写入、重算目标评分、信用分 +1、练习次数 +1 |
| 云函数 getToastmastersClubs/getVlogs | `/api/toastmasters` `/api/vlogs` | 俱乐部与 Vlog |
| 信用分/互评联动 | `src/lib/server.ts` | 沿用原版公式（+1、上限 100） |

---

## 5. 目录速览

```
├─ src/
│  ├─ middleware.ts          # sid 会话签发
│  ├─ lib/
│  │  ├─ db.ts               # PostgreSQL 连接 + 自动建表（幂等，无种子数据）
│  │  ├─ server.ts           # 服务端辅助（会话/统一响应/信用分）
│  │  ├─ client.ts           # 前端数据层（类型化 API / Toast / hooks）
│  │  ├─ types.ts            # 领域类型（与原版 1:1）
│  │  └─ constants.ts        # 语言/学校/互评维度等
│  ├─ components/ui.tsx      # 公共 UI（Avatar/Stars/TabBar/NavBar…）
│  └─ app/
│     ├─ api/…               # 全部接口（对应原云函数）
│     ├─ home|party|mine|message|…/  # 页面
│     └─ globals.css         # 移动优先 + 桌面自适应样式
├─ mini-program/             # ★ 原微信小程序完整源码（归档，保留可运行）
│  ├─ src/                   # Taro + React + TSX（原 app/pages/services…）
│  └─ cloudfunctions/        # 原 9 个云函数
├─ vercel.json / next.config.ts / package.json
└─ README.md
```

## 6. 说明

- 原 `mini-program/` 目录是迁移前的完整小程序工程（含微信云函数），根目录为新的
  Web 工程，两者互不干扰。
- 页面文案、校验规则、信用分公式、组局状态流转均与原版一致；「发现-我的」等
  占位页在 Web 版补齐为完整页面。
- 业务数据实时读写数据库；应用不含任何种子 / 演示数据，空库时页面显示真实空态。
