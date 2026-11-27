# AI CORE｜保險業務的 LINE AI 助理 Landing Page

給**個人保險業務**：客戶交代的事，轉傳給助理就好。

> 資料夾名稱沿用 `V1`，是為了保留已連結的 Git；內容已換成最新版本，舊版保留在 Git 歷史紀錄裡。
> 測試網址：https://zramj.github.io/ai-core-insurance-landing/

## 預覽

直接用瀏覽器打開 `index.html`；或在這個資料夾執行 `python3 -m http.server 8765`，打開 http://localhost:8765/

## 頁面結構

| 區塊 | id | 內容 |
|---|---|---|
| 01 首屏 | `#top` | LINE 聊天示範：轉傳客戶訊息 → 助理整理 → 確認建立；三個情境（訊息、語音、見客戶前問助理）輪流 |
| 02 助理能做的事 | `#jobs` | 訊息變提醒、語音變紀錄、早上的今日清單、見客戶前的摘要 |
| 03 安心說明 | `#trust` | 不讀取你的 LINE、你確認才建立、先確認公司規定、只做紀錄和提醒 |
| 04 檢測 | `#quiz` | 6 題 → 四種類型＋一年花多少小時＋建議＋安心說明 → 用 LINE 領取完整建議 |
| 05 早鳥名單 | `#contact` | 早鳥共創方案、早鳥會得到的 3 件事、用 LINE 加入早鳥名單（加好友） |

## 檢測與 LINE

- 類型依第 1 題決定：LINE 考古型／便條紙滿天飛型／下班還在整理型／記憶力硬撐型。
- 一年花多少小時＝第 3 題的時間（0.5／2／4／6 小時）× 50 週。
- 結果頁的 LINE 按鈕：手機會打開聊天室並預填類型名稱；電腦會開加好友頁，類型建議改用旁邊的 QR Code 掃描領取。
- 頁尾「用 LINE 加入早鳥名單」連到加好友連結 https://lin.ee/yZvK4nw （電腦版旁邊有加好友 QR Code）。
- LINE 後台設定、回覆文字、圖卡：`line/LINE_SETUP.md`、`line/line-card-*.png`。

## 匿名記錄（已接上）

檢測做完、顯示結果時，6 題答案、類型和頁面版本（`insurance-v3`）會匿名送到 Google 表單「Landing Page 檢測紀錄（自動）」，再自動進到它的回覆試算表。不含任何姓名、聯絡方式或保戶資料。設定在 `app.js` 最上方的 `FORM`。

- 這是常見做法，但 Google 沒有正式支援從其他網頁送資料到表單；若日後失效，頁面功能不受影響，只是不會記錄。
- 完整問卷（給認識的業務）：https://forms.gle/EMw2ckiNgyBkiePL8

## SEO（測試階段）

- `noindex, nofollow`：測試版不被收錄。**正式上線時刪除。**
- og:url、og:image 使用測試網址的完整網址；JSON-LD：Organization、Service（對象：保險業務員）、WebPage。
- 官網連結附 UTM（`utm_campaign=insurance-v3`）。
- 正式上線時：刪 noindex、補 canonical、更新 og 網址、放進 sitemap、提交 Search Console、從官網連到這頁。

## 推上 GitHub

GitHub Desktop：Summary 寫一句說明 → **Commit to main** → **Push origin**。約 1–2 分鐘後測試網址更新。
