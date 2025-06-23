# Task 003: 基本的なプロジェクト構造とディレクトリ構成の作成

## 実施内容

### 1. ディレクトリ構造の作成
```
src/
├── app/           # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/    # 再利用可能コンポーネント
│   ├── ui/        # 基本UIコンポーネント
│   └── index.ts
├── lib/          # ライブラリとサードパーティ統合
├── types/        # TypeScript型定義
│   ├── salesforce.ts
│   └── index.ts
└── utils/        # ユーティリティ関数
    ├── formatting.ts
    ├── validation.ts
    └── index.ts
```

### 2. App Routerレイアウトの実装
- **layout.tsx**: アプリケーション全体のレイアウト
  - 日本語対応（lang="ja"）
  - Inter フォントの適用
  - TailwindCSS グローバルスタイル読み込み
  - メタデータ設定

- **page.tsx**: ホームページコンポーネント
  - アプリケーション概要の表示
  - 機能一覧の表示
  - Salesforceブランドカラーの使用

### 3. グローバルスタイルの定義
- **globals.css**: TailwindCSS + カスタムコンポーネントクラス
  - btn-primary, btn-secondary: ボタンスタイル
  - card: カードコンポーネントスタイル
  - form-input: フォーム入力スタイル
  - tab-active, tab-inactive: タブナビゲーションスタイル

### 4. TypeScript型定義の実装

#### Salesforce型定義 (salesforce.ts)
- **SalesforceRecord**: 基底レコード型
- **Account**: 取引先型定義
- **Contact**: 取引先責任者型定義
- **Opportunity**: 商談型定義
- **Task**: タスク型定義
- **Event**: イベント型定義
- **API関連型**: QueryResponse, AuthResponse, UserInfo
- **権限管理型**: UserPermissions

#### 共通型定義 (index.ts)
- **UI関連型**: TabItem, ListViewColumn, FilterOption
- **検索パラメータ型**: SearchParams
- **エラー処理型**: ApiError, LoadingState

### 5. ユーティリティ関数の実装

#### formatting.ts
- **日付フォーマット**: formatDate, formatDateTime, formatRelativeTime
- **数値フォーマット**: formatCurrency, formatNumber, formatPercentage
- **住所フォーマット**: formatAddress
- **文字列処理**: truncateText

#### validation.ts
- **基本バリデーション**: validateEmail, validatePhone, validateUrl
- **フォームバリデーション**: validateRequired, validateMinLength, validateMaxLength
- **日付バリデーション**: validateDate, validateFutureDate
- **エンティティ別バリデーション**: validateAccountForm, validateContactForm, validateOpportunityForm

#### 共通ユーティリティ (index.ts)
- **CSS クラス結合**: classNames
- **パフォーマンス**: debounce, sleep
- **オブジェクト操作**: pick, omit, isEmptyObject
- **ID生成**: generateId

### 6. 基本UIコンポーネントの実装

#### Button.tsx
- バリアント: primary, secondary, outline, ghost
- サイズ: sm, md, lg
- ローディング状態対応
- アクセシビリティ対応

#### Input.tsx
- ラベル、エラーメッセージ、ヘルパーテキスト対応
- バリデーションエラー表示
- アクセシビリティ対応（aria-*属性）

#### Card.tsx
- カード基本コンポーネント
- CardHeader, CardContent サブコンポーネント
- パディングオプション

## 技術的詳細

### 設計原則
- **型安全性**: 全てのコンポーネントとユーティリティにTypeScript型定義
- **再利用性**: 汎用的なコンポーネントとユーティリティ関数
- **アクセシビリティ**: WAI-ARIA準拠
- **レスポンシブ**: TailwindCSS によるモバイルファースト設計

### コンポーネント設計パターン
- **Compound Component Pattern**: Card + CardHeader + CardContent
- **Forwarded Refs**: DOM要素への直接アクセス対応
- **Composition over Inheritance**: 柔軟な拡張性

### バリデーション戦略
- **クライアントサイド**: リアルタイムバリデーション
- **型安全**: TypeScriptによるコンパイル時チェック
- **多言語対応**: 日本語エラーメッセージ

## 完了条件
- [x] srcディレクトリ構造の作成
- [x] App Routerレイアウトの実装
- [x] グローバルスタイルの定義
- [x] Salesforce型定義の完全実装
- [x] 共通型定義の実装
- [x] フォーマット用ユーティリティ関数の実装
- [x] バリデーション用ユーティリティ関数の実装
- [x] 基本UIコンポーネントの実装
- [x] TypeScript型チェック通過確認

## 次のステップ
- Task 004: Salesforce認証システムの実装（SAML SP-initiated）

## 完了日時
2025-06-23