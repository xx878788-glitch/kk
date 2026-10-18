# Hanna 圓潤介面設計依據

參考頁：https://www.apple.com/tw/store
擷取與目視檢查：2026-10-18。Firecrawl branding、頁面截圖及 Chrome 實際 computed styles。

## 直接觀察
- Apple Store 台灣版背景：rgb(245,245,247)，即 #f5f5f7。
- 實際 body font stack：SF Pro TC、SF Pro Text、SF Pro Icons、PingFang TC、Helvetica Neue、Helvetica、Arial、sans-serif。
- .rf-ccard-content 卡片圓角：18px。
- 卡片陰影：rgba(0,0,0,.08) 2px 4px 12px 0px。
- 卡片 transition：0.3s cubic-bezier(0,0,.5,1)。
- 畫面採淺灰背景、白卡片、深色無襯線標題與明顯留白。

## 本站採用的實作選擇
- 使用裝置系統字體：Apple 裝置優先使用系統字體與 PingFang TC；其他系統使用自身無襯線 fallback。未下載或重發 Apple 字體檔案。
- 全站換成無襯線，原襯線標題與數字同步調整。
- 背景 #f5f5f7、白色卡片與較淡陰影。卡片改 24px、主要段落 36px、手機 24–28px，為 Hanna 頁面的內容密度所作調整，並非 Apple CSS 的精確複製。
- 延續 Hanna 的深綠色主按鈕與學院區塊；用同系綠色處理重點色。
- 按鈕採膠囊形，導航半透明與背景模糊，照片改柔和圓角。
- 手機首段小照片置頂，固定右側「如何開始」，保留現有流程和所有目的連結。
- 原生捲動與錨點 smooth scroll，無 scroll hijacking。一次性淡入、短距離位移、滑鼠懸停細微上浮；課程/FAQ 內容展開淡入。
- prefers-reduced-motion 關閉非必要動畫與 smooth scroll。

## 文字修改
僅將「2021 年 4 月，MACS 帶我加入當時的 ACDC 學院，我開始接觸加密貨幣。」改成「2021 年 4 月，我加入當時的 ACDC 學院，開始接觸加密貨幣。」其餘故事事實、課程資格與外部連結沿用既有內容。

## 圖片
沿用 assets 內 Hanna 肖像、教學、路人教學、課程與學員回饋。Apple 圖片與商標只作參考，不用於 Hanna 網站。

## 近似與限制
Apple 官網網站字體包含自有字體；本網站使用裝置系統字體，跨系統外觀存在差異。圓角與間距為本頁重新配置，非逐像素重建 Apple 網站。
