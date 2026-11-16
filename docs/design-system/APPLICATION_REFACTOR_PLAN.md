# OpenAI Platform Design System — Kế Hoạch & Kết Quả Áp Dụng Toàn Diện 151 Components

Tài liệu quy chuẩn và bảng tổng kết tiến trình tái cấu trúc toàn diện 151 component trong mục `Application` (`vanilla/stories/default/`) theo tiêu chuẩn Design System OpenAI Platform (`https://platform.openai.com` và `scratch/assistant-ui/`).

---

## 🎯 4 Quy Tắc Cốt Lõi (Đã Triển Khai & Kiểm Tra Toàn Diện)

1. **Hợp nhất State thành 1 Story tương tác tự nhiên (Rule 1)**:
   - Toàn bộ 151 component đã được tinh gọn từ nhiều export tĩnh rải rác (Empty, Populated, Long, Streaming, ErrorState,...) thành **đúng 1 story tương tác duy nhất mang tên `Default`** cho mỗi component.
   - Không có thanh công cụ/toolbar giả tạo hay cồng kềnh: Mọi tương tác diễn ra tự nhiên ngay trên component (bấm nút hành động, click xóa item, cycle state khi tương tác, preview inline).
2. **Kế thừa & Ghép nối Component cơ sở từ Shared (Rule 2)**:
   - Các nút bấm, icon button, input, badge, tag, dropdown, modal đều kế thừa trực tiếp các class chuẩn từ `Shared`:
     - Nút icon tròn nhỏ ghost: `.ds-button.ds-button--ghost.ds-button--sm.ds-button--pill.ds-button--icon` (size 24px, bo tròn full radius, icon 14px/12px) áp dụng đồng bộ cho cả nút `x` (cancel) và nút `arrow`.
     - Thêm biến thể chuẩn **"Small Pill"** vào catalog Storybook của Button (`Shared / Button / Small Pill`).
     - Status beacon: `.ds-beacon.ds-beacon--accent`.
     - Reset button: `.ds-button.ds-button--ghost.ds-button--sm`.
3. **Ánh xạ Token & Spacing Bám Sát Bản Gốc, Căn Sát Lề Chuẩn ("Sát Lề Bên Này" - Rule 3)**:
   - **Bỏ quy tắc strict 400 typography áp đặt**: Typography sử dụng trọng số tự nhiên theo đúng ground truth từ platform (500 cho title/action labels, 400 cho secondary text, mono cho token/metrics/code).
   - **Khung & Chiều Rộng Căn Sát Lề**: Giữ nguyên độ rộng `max-width: 384px` của component gốc, căn sát lề trái stage. Cả 2 thẻ queue item bên dưới mở rộng 100% bằng đúng chiều rộng của card phía trên, mép trái và mép phải căn thẳng hàng tuyệt đối ("sát lề bên này").
   - **Nới Spacing hợp lý**:
     - Padding item: `10px 10px 10px 14px`, bo góc `var(--radius-2xl)` (16px).
     - Padding card: `var(--space-3)` (12px), bo góc `var(--radius-2xl)` (16px).
     - Khoảng cách giữa các item trong queue: `var(--space-2)` (8px).
     - Metadata Header căn lề sát mép `padding: 0 var(--space-1)` (4px), font mono 11px.
4. **Liên kết phản ứng hai chiều (Rule 4 - Reactive Linkage)**:
   - Do 100% component Application sử dụng các class atom từ Shared, mọi hiệu chỉnh token hoặc CSS tại `vanilla/base.css` (màu sắc, radius, padding, hover effect) đều lập tức phản ánh đồng bộ trên toàn bộ 151 component Application.

---

## 🗂️ Cấu Trúc Sắp Xếp Storybook (Đã Hoàn Thành)

- **Mục "Shared" đặt lên trên mục "Application"**: Cấu hình `options.storySort` trong `.storybook/preview.js` ưu tiên `Shared` xuất hiện ở vị trí đầu tiên (index 0).
- **Thứ tự tăng dần nghiêm ngặt (Ascending Numerical Order)**: 151 component Application được trích xuất số thứ tự bằng regex và sắp xếp chính xác từ `#001` đến `#151` (`01 Loading State` đến `151 Support tickets AUI`), loại bỏ hoàn toàn lỗi sắp xếp thứ tự từ điển (`108` trước `11`).

---

## ⚡ Kết Quả Kiểm Thử & Xác Minh (Foreground 100%)

- **Storybook Component Count**: 151/151 components trong Application đều có duy nhất 1 export `Default`.
- **Storybook Ordering**:
  - `Shared` xuất hiện trước `Application` (Shared = index 0, Application = index 34).
  - Thứ tự từ `#001` đến `#151` tăng dần chuẩn 100%.
- **Token & Design System Audit**:
  - `npm run tokens:build` -> Passed (`{"tokens":128,"light":128,"dark":66}`)
  - `npm run tokens:check` -> Passed (`tokens:ok`)
  - `npm run ds:check` -> Passed (`ds:check ok` - 0 literal colors, 0 inline styles)
  - `npm run build:vanilla` -> Passed (`vanilla:css ok`)
  - `node scripts/verify_all_application_components.mjs` -> Passed 100% không có lỗi.

---

## 📋 Danh Sách 151 Components Đã Hoàn Thành

| STT | Tên Component | File Storybook | Component Shared tích hợp | Trạng thái Refactor |
| :---: | :--- | :--- | :--- | :---: |
| `001` | 01 Loading State | `loading-state.stories.js` | Button, Skeleton | 🟢 COMPLETED |
| `002` | 02 Thinking indicator | `thinking-indicator.stories.js` | Button, Icon Button | 🟢 COMPLETED |
| `003` | 03 Streaming text | `streaming-text.stories.js` | Button, Badge | 🟢 COMPLETED |
| `004` | 04 Typing Indicator | `typing-indicator.stories.js` | Avatar | 🟢 COMPLETED |
| `005` | 05 Reasoning Effort | `reasoning-effort.stories.js` | Segmented Button, Progress | 🟢 COMPLETED |
| `006` | 06 Guardrail Notice | `guardrail-notice.stories.js` | Button, Icon Button | 🟢 COMPLETED |
| `007` | 07 Message Pair | `message-pair.stories.js` | Avatar, Icon Button | 🟢 COMPLETED |
| `008` | 08 Message Branches | `message-branches.stories.js` | Icon Button | 🟢 COMPLETED |
| `009` | 09 Message Actions | `message-actions.stories.js` | Icon Button | 🟢 COMPLETED |
| `010` | 10 Error State | `error-state.stories.js` | Button (danger-soft), Icon | 🟢 COMPLETED |
| `011` | 11 Message Queue | `message-queue.stories.js` | Icon Button, Button | 🟢 COMPLETED |
| `012` | 12 Edit Message | `edit-message.stories.js` | Button, Textarea | 🟢 COMPLETED |
| `013` | 13 Feedback Dialog | `feedback-dialog.stories.js` | Button, Icon Button | 🟢 COMPLETED |
| `014` | 14 Stopped Run | `stopped-run.stories.js` | Button, Badge | 🟢 COMPLETED |
| `015` | 15 Day Separator | `day-separator.stories.js` | Divider, Tag | 🟢 COMPLETED |
| `016` | 16 Speaker Identity | `speaker-identity.stories.js` | Avatar, Badge | 🟢 COMPLETED |
| `017` | 17 Regenerate Menu | `regenerate-menu.stories.js` | Button, Dropdown Menu | 🟢 COMPLETED |
| `018` | 18 Confidence Marker | `confidence-marker.stories.js` | Tooltip, Badge | 🟢 COMPLETED |
| `019` | 19 Tool Call | `tool-call.stories.js` | Button, CodeBlock | 🟢 COMPLETED |
| `020` | 20 Run Activity | `run-activity.stories.js` | Icon Button, Badge | 🟢 COMPLETED |
| `021` | 21 Artifact Card | `artifact-card.stories.js` | Button, Icon Button | 🟢 COMPLETED |
| `022` | 22 Citation Card | `citation-card.stories.js` | Button, Badge | 🟢 COMPLETED |
| `023` | 23 Code Diff | `code-diff.stories.js` | Button, Icon Button | 🟢 COMPLETED |
| `024` | 24 Shell Terminal | `shell-terminal.stories.js` | Button, Icon Button | 🟢 COMPLETED |
| `025` | 25 File Tree | `file-tree.stories.js` | Icon Button, Tree Item | 🟢 COMPLETED |
| `026` - `050` | 26 Elicitation Form ... 50 Activity Graph | Files #026 - #050 | Button, Input, Select, Badge | 🟢 COMPLETED |
| `051` - `075` | 51 Math Block ... 75 Composer | Files #051 - #075 | Button, Icon Button, Input, Tag | 🟢 COMPLETED |
| `076` - `100` | 76 Slash commands ... 100 Thread AUI | Files #076 - #100 | Button, Dropdown, Menu, Badge | 🟢 COMPLETED |
| `101` - `125` | 101 Assistant modal AUI ... 125 Mermaid diagram AUI | Files #101 - #125 | Button, Modal, Tooltip, Icon Button | 🟢 COMPLETED |
| `126` - `151` | 126 Generative UI AUI ... 151 Support tickets AUI | Files #126 - #151 | Button, Chart, Card, Icon Button | 🟢 COMPLETED |
