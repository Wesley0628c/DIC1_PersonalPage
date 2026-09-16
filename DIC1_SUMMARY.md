# 課堂作業報告：DIC 1 (Do In Class 1)

## 📌 專案名稱 (Project Title)
**個人化即時資訊儀表板與動態時鐘系統 (Personal Space & Live Clock Dashboard)**

---

## 📋 基本資訊 (Project Metadata)
- **課程單元**：Do In Class 1 (DIC 1)
- **作者 / 學生**：卓威宏
- **日期**：2026 年 09 月 16 日
- **GitHub 專案倉庫**：https://github.com/Wesley0628c/DIC1_PersonalPage
- **Live Website**：https://wesley0628c.github.io/DIC1_PersonalPage/
- **核心技術**：HTML5 / Vanilla CSS (Glassmorphism) / JavaScript (ES6+) / Web Audio API / Git

---

## 🎯 一、專案簡介 (Project Overview)
本專案為一個具備現代視覺美學的**個人化即時資訊儀表板（Personal Dashboard）**。透過原生 Web 技術（無龐大框架負擔），打造出結合**動態高精度時間顯示、時間進度追蹤、跨國時區同步、動態主題切換與環境專注音效**的多功能桌面首頁，兼顧實用性與沉浸式視覺體驗。

---

## ✨ 二、核心功能特點 (Key Features)

1. **高精度動態時鐘（Precision Live Clock）**
   - 毫秒級平滑更新的數位時鐘，清晰展示時、分、秒。
   - 支援 **12 小時制 (AM/PM) / 24 小時制** 一鍵切換。
   - 即時計算並可視化展示「**今日時間進度百分比（Today's Progress）**」。

2. **多國世界時區同步（World Clocks Integration）**
   - 整合全球四大主要城市時區：倫敦（London）、紐約（New York）、東京（Tokyo）、雪梨（Sydney）。
   - 自動動態同步時間與上下午狀態。

3. **時間與日曆指標（Calendar & Temporal Metrics）**
   - 本地完整年月日與星期展示。
   - 年度累計天數（Day of Year, #259）與週數（Week #38）即時計算。

4. **沉浸式現代視覺與主題引擎（Modern Glassmorphism & Themes）**
   - **毛玻璃效果（Glassmorphism）**：利用 CSS `backdrop-filter: blur()` 與柔和邊框，呈現極具層次感的卡片設計。
   - **四色動態調色盤**：支援 Violet（紫）、Cyan（青）、Emerald（翡翠綠）、Amber（琥珀橘）即時切換。
   - **環境光暈特效（Ambient Glow）**：動態漸變光球營造未來感氛圍。

5. **個人化與互動專注模組（Personalization & Focus Widgets）**
   - 可自訂個人頭像與點擊編輯稱號。
   - **環境專注音效**：使用 Web Audio API 即時生成白噪音/專注音訊，點擊即可切換開關。
   - **每日靈感名言（Daily Inspiration）**：內建名言庫，支援點擊即時刷新激勵語錄。
   - **今日核心目標（Today's Main Focus）**：可輸入與記錄當前最重要事項。

---

## 🛠️ 三、技術亮點與實作細節 (Technical Architecture)

| 模組 | 技術實現細節 |
| :--- | :--- |
| **頁面架構** | 採用標準 HTML5 語義化標籤（`header`, `main`, `section`, `nav`），確保 SEO 與無障礙瀏覽友善度。 |
| **樣式設計** | 100% 原生 Vanilla CSS，利用 CSS Custom Properties 建立一致的 Design Tokens，並整合 Google Fonts（Outfit 與 JetBrains Mono 代碼字型）。 |
| **動態邏輯** | 原生 JavaScript (ES6+)，使用 `setInterval` 與 `Date` 物件精確處理跨時區運算、進度百分比計算及 DOM 輕量化更新。 |
| **音訊合成** | 透過原生瀏覽器 **Web Audio API** 即時振盪生成環境音，無需外部音檔依賴，極速載入。 |
| **版本控制** | 規範化 Git 流程，完成分支管理、.gitignore 設置、清晰的 Commit 訊息結構，並發布至 GitHub Remote。 |

---

## 📸 四、成果展示 (Demo & Snapshot)
- 專案首頁預覽截圖：
<p align="center">
  <img src="./demo.png" alt="Demo Snapshot" width="700" />
</p>

---

## 💡 五、學習心得與收穫 (Reflection & Takeaways)
1. **現代 CSS 視覺能力的掌握**：深刻理解了 Glassmorphism（毛玻璃）、CSS 漸變、動態主題變數（CSS Variables）如何大幅提升前端界面的質感。
2. **時間演算法與跨時區計算**：掌握了利用 JavaScript 處理時間進度條、UTC 時差換算與毫秒級狀態同步的技巧。
3. **版本控制與部署流程**：熟練操作 Git 初始化、Commit 紀錄規範、Git Credential Manager 權限驗證，並順利將專案代碼推播至 GitHub 遠端倉庫。
