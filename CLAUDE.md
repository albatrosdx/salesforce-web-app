# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

SalesforceのREST APIを使用してアカウント（取引先）、コンタクト（取引先責任者）、オポチュニティ（商談）、活動情報をモダンなUIで表示するWebアプリケーション。

## 技術スタック

### フロントエンド
- **React**: UIライブラリ
- **Next.js**: Reactフレームワーク（App Router使用）
- **TailwindCSS**: スタイリングフレームワーク

### バックエンド
- **Salesforce**: REST API経由でのデータソース

### 認証
- **IDP**: SalesforceをIdentity Providerとして使用
- **SP**: 本WebアプリをService Providerとして設定
- **認証フロー**: SP-initiated SAMLフロー

## アプリケーション設計

### 主要エンティティ
- **取引先（Account）**: 一覧表示、詳細ページ、タイムライン形式の活動表示
- **取引先責任者（Contact）**: 一覧表示、詳細ページ、タイムライン形式の活動表示
- **商談（Opportunity）**: 一覧表示、詳細ページ、タイムライン形式の活動表示
- **活動（Activity）**: タイムライン表示、新規作成機能

### UI構成
- 主要エンティティのタブベースナビゲーション
- 名前クリックで詳細ページに遷移する一覧表示
- Salesforce標準項目を表示する詳細ページ
- 関連活動のタイムラインコンポーネント
- 各詳細ページでの活動作成フォーム

### データフロー
- 全データはSalesforce REST API経由で取得
- Webアプリ側にはデータを保存しない
- REST API経由でのCRUD操作をサポート
- ユーザープロファイルと権限セットに基づくリアルタイム権限チェック

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番用ビルド
npm run build

# 本番サーバー起動
npm start

# リンティング
npm run lint

# 型チェック（TypeScript使用時）
npm run type-check
```

## Salesforce接続アプリケーション設定

### 必要な設定
1. **Salesforce設定での接続アプリケーション作成**
   - アプリケーションマネージャー → 新しい接続アプリケーション
   - SAMLを有効化
   - SP-initiatedフロー設定
   - 認証用コールバックURL設定

2. **API アクセス設定**
   - OAuth設定を有効化
   - スコープ設定: `api`, `refresh_token`, `offline_access`
   - 適切なリダイレクトURI設定

3. **SAML設定**
   - エンティティID: Webアプリのドメイン
   - ACS URL: 認証コールバックエンドポイント
   - 名前ID形式: EmailまたはUsername
   - 属性マッピング設定

### 必要な権限
- Account、Contact、Opportunity、Activity オブジェクトの権限
- ユーザープロファイルに基づく項目レベルセキュリティ
- API アクセス権限

## 認証フロー

### SP-Initiated SAMLフロー
1. ユーザーがWebアプリにアクセス
2. アプリがSalesforceに認証リダイレクト
3. ユーザーがSalesforceで認証
4. SalesforceがSAMLレスポンスを返却
5. アプリがレスポンスを検証してセッション確立
6. 以降のAPI呼び出しでセッショントークンを使用

## 権限管理

### 動的権限チェック
- ユーザープロファイルと権限セット情報の取得
- 各オブジェクトタイプのCRUD権限チェック
- ユーザー権限に基づくUI要素の表示制御
- API呼び出し時の権限検証

### 権限タイプ
- **作成**: 新規レコード作成権限
- **参照**: レコードと項目の閲覧権限
- **編集**: 既存レコードの変更権限
- **削除**: レコードの削除権限

## ブランチ管理ルール

### 作業開始前の必須チェック手順
作業開始前に以下のコマンドを実行してください：

```bash
# 1. リモート情報の更新
git fetch --prune origin

# 2. 削除されたリモートブランチの確認
git branch -vv | grep 'gone]'

# 3. 不要なローカルブランチの削除
git branch -d <branch-name>
# 強制削除が必要な場合
git branch -D <branch-name>

# 4. 現在のブランチ状況確認
git branch -a
```

### ブランチ管理の完全なワークフロー
**【絶対必須】** 作業開始前の必須チェック手順を実行した後、以下の順序で作業を進めてください：

1. **mainブランチからの新規ブランチ作成**
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

2. **作業実施とコミット**
```bash
# 作業を実施
git add -A
git commit -m "descriptive commit message"
```

3. **ビルドエラーチェック**
```bash
# 【重要】push前に必ずビルドを実行してエラーがないことを確認
npm run build

# ビルドエラーがある場合は修正してから次に進む
```

4. **プッシュとプルリクエスト作成**
```bash
git push -u origin feature/your-feature-name
gh pr create --title "PR Title" --body "PR Description"
```

5. **mainブランチに戻る**
```bash
git checkout main
```

### 重要事項
- **絶対にmainブランチに直接コミットしない**
- 作業開始前に必ずプリワークチェックリストを実行
- 削除されたリモートブランチに対応するローカルブランチは必ず削除
- 新規ブランチ作成前にブランチ存在確認
- ローカルとリモートのブランチ状況を同期
- **push前に必ずビルドを実行してエラーがないことを確認する**
- **全ての作業は必ずfeatureブランチで実施し、プルリクエストを作成する**
- **作業完了後は必ずmainブランチに戻る**

## API統合パターン

### REST API エンドポイント
- **取引先**: `/services/data/v58.0/sobjects/Account/`
- **取引先責任者**: `/services/data/v58.0/sobjects/Contact/`
- **商談**: `/services/data/v58.0/sobjects/Opportunity/`
- **活動**: `/services/data/v58.0/sobjects/Task/`, `/services/data/v58.0/sobjects/Event/`

### エラーハンドリング
- 適切なエラーバウンダリの実装
- 認証トークン有効期限切れの処理
- レート制限とAPIクォータの管理
- ユーザーフレンドリーなエラーメッセージの提供

## セキュリティ考慮事項

- 安全なトークン保存と管理
- 適切なCORS設定
- 入力値の検証とサニタイズ
- セッション管理とタイムアウト処理