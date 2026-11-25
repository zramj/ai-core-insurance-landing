# AI CORE｜Insurance Landing Page V1

FROM CHAOS TO CLARITY.：給保險業務員的「既有保戶服務整理」產業型 Landing Page，第一版可操作原型。

> 概念原型：工作台為模擬展示，所有示範資料皆為虛構。沒有串接 AI API、不讀取任何訊息、不儲存任何資料。

## 如何預覽

最簡單：直接用瀏覽器打開 `index.html`（雙擊即可）。

若要用本機伺服器（較接近正式環境）：

```bash
cd 03_Insurance/prototypes/V1
python3 -m http.server 8765
# 打開 http://localhost:8765/
```

## 頁面結構（四區）

| 區域 | id | 內容 |
|---|---|---|
| 01 HERO | `#top` | 「重要的客戶，不該只靠記憶。」＋ 分散的工作資訊拼貼（訊息、筆記、行事曆、便條） |
| 02 TRANSFORMATION | `#clarity` | 同一批資訊依序變化：匯入 → AI 協助整理 → 客戶分類 → 服務待辦 |
| 03 INTERACTIVE PRODUCT EXPERIENCE | `#workbench` | 保戶工作台概念展示，可實際操作 |
| 04 CONTACT | `#contact` | 「把時間留給客戶，而不是整理客戶。」＋ 前往官方聯絡表單 |

依需求已取消獨立 FAQ；工具、客製、資料與費用的說明，以三行短句放在最後的洽詢區。

## 主要互動

**整理過程（#clarity）**
- 捲到這一區時自動播放一次（約 8 秒），不鎖定捲動。
- 可直接點選 01–04 任一步驟查看；「重新播放整理過程」可重看。
- 減少動態模式：直接顯示整理完成的狀態，步驟仍可點選。

**保戶工作台（#workbench）**
1. 看到三則未整理的資訊（王先生的訊息、陳小姐的工作筆記、林先生的行事曆）。
2. 按「開始 AI 整理」：標出關鍵字、勾選三個整理步驟，資訊卡飛進左側保戶清單。
3. 每位保戶顯示服務時間軸與「建議下一步」；按「確認並建立待辦」。
4. 待辦可以打勾完成，時間軸會即時新增紀錄；可切換保戶、或按「下一位」。
5. 三位都完成後出現完成狀態：「討論我的工作流程」或「重新體驗」。右上角「重新體驗」隨時可重來。

全部可用鍵盤操作（Tab / Enter / Space），狀態變化會透過 `aria-live` 告知螢幕閱讀器。

## 檔案

```
V1/
├─ index.html          頁面（語意化 HTML、SEO / 分享 metadata）
├─ styles.css          樣式（響應式、減少動態）
├─ app.js              互動（無框架、無外部套件）
├─ share.jpg           分享預覽圖（1200×630，取自首屏）
├─ assets/
│  ├─ ai-core-logo-horizontal.svg   官方橫式 Logo（從 00_Brand/logos 複製，未修改）
│  ├─ ai-core-symbol.svg            官方符號（favicon 與工作台標記，未修改）
│  └─ fonts/                        Instrument Serif、IBM Plex Mono（OFL 授權，自帶檔案）
├─ screenshots/        驗收截圖
├─ README.md
└─ DESIGN_NOTES.md     設計策略、Taste Skill 使用與驗收紀錄
```

中文字使用系統字體（Mac 為蘋方，與官網一致），不需下載中文字型。

## SEO（測試階段）

已完成（2026-11-25）：
- `noindex, nofollow`：測試版不會被搜尋引擎收錄，避免日後和正式版搶排名。**正式上線時要刪除這一行。**
- h1 納入關鍵字：「給保險業務員的保戶服務整理」成為 h1 的第一行（外觀不變，仍是標題上方的小字）。
- JSON-LD 結構化資料：Organization（AI CORE）、Service（服務對象：保險業務員）、WebPage。
- 分享圖補上尺寸與替代文字（og:image:width / height / alt）。
- 官網連結加上 UTM（`utm_source=landing-page`、`utm_campaign=insurance-v1`），可分辨詢問是否來自這頁。
- 關閉 JavaScript 時，工作台位置顯示說明與聯絡連結。

正式上線時再做：
1. 刪除 `noindex`。
2. 補 `<link rel="canonical">`、`og:url`，並把 `og:image` 改成完整網址。
3. 確認網址路徑（例如 `ai-core.si/insurance`），放進 sitemap，提交 Google Search Console。
4. 從官網服務區或頁尾連到這一頁。
5. 用 Keyword Planner 或 Search Console 驗證關鍵字（保險業務員 客戶管理、保戶管理、保戶服務等），目前尚未查證搜尋量。

## 上線前仍需處理

- 「討論我的工作流程」目前連到官網聯絡表單 `https://www.ai-core.si/#contact`（2026-11-24 由官網導覽確認，已加 UTM）。正式版是否改用專屬表單與通知流程，需另行確認。
- 正式網址確定後，補上 `<link rel="canonical">` 與 `og:image` 的絕對網址。
- 本原型未修改官網、未操作 GitLab，也未執行 commit、push 或部署。
