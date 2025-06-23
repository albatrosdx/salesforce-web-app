# Task 001: プロジェクト初期設定（Next.js + TypeScript + TailwindCSS）

## 実施内容

### 1. NPMプロジェクトの初期化
- `npm init -y`でpackage.jsonを作成
- プロジェクト名: salesforce-web-app

### 2. 必要な依存関係のインストール
```bash
npm install next@latest react@latest react-dom@latest typescript@latest @types/react@latest @types/node@latest @types/react-dom@latest tailwindcss@latest postcss@latest autoprefixer@latest eslint@latest eslint-config-next@latest
```

### 3. 設定ファイルの作成

#### package.json scripts更新
- dev: Next.js開発サーバー起動
- build: 本番用ビルド  
- start: 本番サーバー起動
- lint: ESLintによるコードチェック
- type-check: TypeScript型チェック

#### TypeScript設定 (tsconfig.json)
- App Routerに対応した設定
- パスエイリアス `@/*` → `./src/*`
- 最新のTypeScript設定

#### Next.js設定 (next.config.js)
- App Router有効化
- Salesforce関連環境変数の設定

#### TailwindCSS設定 (tailwind.config.js)
- Next.js App Router対応のcontent設定
- Salesforceブランドカラーの追加
- カスタムカラーパレット定義

#### ESLint設定 (.eslintrc.json)
- Next.js推奨設定
- TypeScript対応
- 基本的なルール設定

### 4. 環境設定
- .env.example: 環境変数テンプレート
- .gitignore: Next.js標準設定
- PostCSS設定: TailwindCSS対応

## 技術的詳細

### 使用技術スタック
- **Next.js 15.3.4**: App Router使用
- **React 19.1.0**: 最新版
- **TypeScript 5.8.3**: 型安全性確保
- **TailwindCSS 4.1.10**: ユーティリティファーストCSS
- **ESLint**: コード品質管理

### ディレクトリ構成予定
```
src/
├── app/           # Next.js App Router
├── components/    # 再利用可能コンポーネント
├── lib/          # ユーティリティ関数
├── types/        # TypeScript型定義
└── utils/        # ヘルパー関数
```

## 完了条件
- [x] NPMプロジェクトの初期化
- [x] 必要な依存関係のインストール
- [x] TypeScript設定の完了
- [x] Next.js設定の完了
- [x] TailwindCSS設定の完了
- [x] ESLint設定の完了
- [x] 環境変数設定の準備
- [x] .gitignore設定

## 次のステップ
- Task 003: 基本的なプロジェクト構造とディレクトリ構成の作成

## 完了日時
2025-06-23