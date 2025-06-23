# Salesforce Web App 全面再設計計画

## 現在の問題分析

### 1. Salesforce APIクライアント問題
- **URL構築エラー**: `accessToken` が `instanceUrl` として使用されている
- **無効なURL**: `00DIT000003oSTa!ARQAQDbGjUE...` がURLのbaseとして使用されている
- **CORS問題**: クライアントサイドからの直接API呼び出し

### 2. UI/UX問題
- **大きな画像**: プロフィール画像の表示サイズが不適切
- **レスポンシブデザイン**: モバイル対応が不十分
- **ナビゲーション**: サイドバーとメインコンテンツの分離が不明確
- **リストビュー**: 一覧表示のデザインが未完成

### 3. アーキテクチャ問題
- **セッション管理**: NextAuth.jsの不適切な使用
- **データフェッチング**: サーバーサイドとクライアントサイドの混在
- **権限管理**: 複雑で不安定な実装

## 再設計方針

### 1. アーキテクチャの再構築
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes     │    │   Salesforce    │
│   (Next.js)     │◄──►│   (Server-side)  │◄──►│   REST API      │
│                 │    │                  │    │                 │
│ - React UI      │    │ - Session mgmt   │    │ - Authentication │
│ - State mgmt    │    │ - Data fetching  │    │ - Data storage   │
│ - Routing       │    │ - Error handling │    │ - Permissions    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 2. UI/UXデザイン原則
- **Salesforce Lightning Design System (SLDS)** に準拠
- **レスポンシブファースト** のアプローチ
- **アクセシビリティ** の確保
- **パフォーマンス** の最適化

### 3. コンポーネント設計
```
App Layout
├── Header (ユーザー情報、ログアウト)
├── Sidebar (ナビゲーション)
└── Main Content
    ├── List View (データ一覧)
    │   ├── Search/Filter
    │   ├── Data Table
    │   └── Pagination
    └── Detail View (詳細表示)
        ├── Summary Card
        ├── Related Lists
        └── Activity Timeline
```

## 実装計画

### Phase 1: コア修正 (高優先度)
1. **Salesforce APIクライアント修正**
   - URL構築ロジックの修正
   - エラーハンドリングの改善
   - 適切なセッション管理

2. **基本レイアウト構築**
   - ヘッダーコンポーネント
   - サイドバーナビゲーション
   - メインコンテンツエリア

3. **データフェッチング統一**
   - すべてのSalesforce API呼び出しをサーバーサイドに移行
   - 統一されたエラーハンドリング
   - キャッシング戦略

### Phase 2: UI/UX改善 (中優先度)
1. **モダンUIコンポーネント**
   - Button, Card, Table, Form等の基本コンポーネント
   - Salesforce Lightning Design System準拠
   - ダークモード対応

2. **リストビュー実装**
   - 検索・フィルタリング機能
   - ソート機能
   - ページネーション

3. **詳細画面改善**
   - 適切な画像サイズ
   - 関連データの表示
   - 編集フォーム

### Phase 3: 高度な機能 (低優先度)
1. **パフォーマンス最適化**
   - 仮想スクロール
   - 遅延読み込み
   - キャッシング

2. **アクセシビリティ**
   - キーボードナビゲーション
   - スクリーンリーダー対応
   - WCAG 2.1準拠

## 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 18** (Hooks, Suspense)
- **TypeScript** (厳密な型定義)
- **TailwindCSS** (ユーティリティファースト)
- **Headless UI** (アクセシブルコンポーネント)

### バックエンド
- **Next.js API Routes** (サーバーサイド処理)
- **NextAuth.js** (認証管理)
- **Salesforce REST API** (データソース)

### 開発ツール
- **ESLint** (コード品質)
- **Prettier** (コードフォーマット)
- **TypeScript** (型チェック)

## ファイル構成

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── salesforce/    # Salesforce関連API
│   ├── dashboard/         # ダッシュボード画面
│   │   ├── accounts/      # 取引先画面
│   │   ├── contacts/      # 取引先責任者画面
│   │   └── opportunities/ # 商談画面
│   └── layout.tsx         # ルートレイアウト
├── components/            # UIコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   ├── data/             # データ表示コンポーネント
│   └── forms/            # フォームコンポーネント
├── lib/                  # ユーティリティ
│   ├── salesforce/       # Salesforce統合
│   ├── auth/             # 認証設定
│   └── utils/            # 共通ユーティリティ
└── types/                # TypeScript型定義
```

## 成功指標

### 技術指標
- [ ] ビルドエラー: 0件
- [ ] TypeScriptエラー: 0件
- [ ] API呼び出し成功率: 99%以上
- [ ] ページ読み込み時間: 2秒以下

### UX指標
- [ ] レスポンシブデザイン: 全デバイス対応
- [ ] アクセシビリティ: WCAG 2.1 AA準拠
- [ ] ユーザビリティ: 直感的なナビゲーション

### 機能指標
- [ ] 取引先一覧表示: 正常動作
- [ ] 取引先責任者一覧表示: 正常動作  
- [ ] 商談一覧表示: 正常動作
- [ ] 詳細画面表示: 正常動作
- [ ] 権限制御: 適切に動作

## 実装スケジュール

### Week 1: Core Infrastructure
- Day 1-2: Salesforce APIクライアント修正
- Day 3-4: 基本レイアウト構築
- Day 5-7: データフェッチング統一

### Week 2: UI/UX Implementation
- Day 1-3: UIコンポーネント実装
- Day 4-5: リストビュー実装
- Day 6-7: 詳細画面改善

### Week 3: Polish & Testing
- Day 1-3: パフォーマンス最適化
- Day 4-5: アクセシビリティ改善
- Day 6-7: 総合テスト

## リスク管理

### 高リスク
- **Salesforce API制限**: レート制限の対策が必要
- **認証期限切れ**: トークンリフレッシュの実装必須

### 中リスク
- **大量データ**: ページネーション必須
- **ネットワーク遅延**: ローディング状態の適切な表示

### 低リスク
- **ブラウザ互換性**: モダンブラウザ対象で問題なし
- **デザイン一貫性**: デザインシステム使用で解決