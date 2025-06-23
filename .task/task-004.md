# Task 004: Salesforce認証システムの実装（SAML SP-initiated）

## 実施内容

### 1. 依存関係のインストール
```bash
npm install next-auth jsonwebtoken jose @types/jsonwebtoken
```

### 2. Salesforce認証ライブラリの実装

#### SalesforceAuth クラス (src/lib/auth/salesforce.ts)
- **SP-initiated 認証フロー**の実装
- **OAuth 2.0 Authorization Code Flow**
- **主要メソッド**:
  - `generateAuthUrl()`: 認証URL生成
  - `exchangeCodeForToken()`: 認証コード→アクセストークン交換
  - `refreshToken()`: リフレッシュトークンによる更新
  - `getUserInfo()`: ユーザー情報取得
  - `validateToken()`: トークン有効性検証
  - `revokeToken()`: トークン無効化

#### NextAuth.js設定 (src/lib/auth/config.ts)
- **Salesforce Provider**の実装
- **JWT Strategy**による認証
- **セッション管理**
- **カスタムコールバック**でSalesforce固有情報の処理
- **TypeScript型拡張**（Session, JWT）

### 3. API Routes実装
- **`/api/auth/[...nextauth]`**: NextAuth.jsエンドポイント
- GET/POST対応
- 動的ルーティング

### 4. 認証コンポーネントの実装

#### AuthProvider (src/components/auth/AuthProvider.tsx)
- **SessionProvider**のラッパー
- アプリケーション全体の認証状態管理

#### SignInButton (src/components/auth/SignInButton.tsx)
- **動的表示**：ログイン状態に応じた表示切り替え
- **ローディング状態**対応
- **Salesforce認証**の開始

#### ProtectedRoute (src/components/auth/ProtectedRoute.tsx)
- **認証必須ページ**の保護
- **自動リダイレクト**機能
- **ローディング表示**

### 5. 認証ページの実装

#### サインインページ (src/app/auth/signin/page.tsx)
- **専用ログインページ**
- **既存セッション**の自動検出
- **ローディング状態**管理
- **コールバックURL**設定

#### エラーページ (src/app/auth/error/page.tsx)
- **エラー種別別**メッセージ表示
- **再試行**機能
- **技術的詳細**の表示オプション

### 6. UIコンポーネントの改善

#### Button コンポーネント拡張
- **asChild prop**の実装（Link要素との組み合わせ）
- **TypeScript型**の改善
- **ReactNode**型の明示的定義

### 7. レイアウト統合
- **AuthProvider**をRootLayoutに統合
- **全ページ**での認証状態の利用可能化
- **SignInButton**をホームページに追加

## 技術的詳細

### 認証フロー設計
1. **SP-initiated SAML**: ユーザーがWebアプリから認証開始
2. **OAuth 2.0 Authorization Code Flow**: セキュアな認証方式
3. **JWT Strategy**: ステートレスなセッション管理
4. **リフレッシュトークン**: 長期間のアクセス維持

### セキュリティ考慮事項
- **HTTPS必須**: 本番環境での暗号化通信
- **CSRF保護**: NextAuth.jsによる内蔵保護
- **トークン検証**: アクセストークンの有効性チェック
- **セッション管理**: 適切なタイムアウト設定

### 環境変数設定
```env
SALESFORCE_INSTANCE_URL=https://your-domain.my.salesforce.com
SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_client_secret
SALESFORCE_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Salesforce接続アプリ設定要件
1. **OAuth設定**:
   - 有効化: ✓
   - スコープ: `api`, `refresh_token`, `offline_access`
   - コールバックURL: `{APP_URL}/api/auth/callback/salesforce`

2. **SAML設定** (将来拡張用):
   - Entity ID: アプリドメイン
   - ACS URL: 認証コールバックエンドポイント

## エラーハンドリング

### 認証エラー種別
- **Configuration**: 設定エラー
- **AccessDenied**: アクセス拒否
- **Verification**: 認証検証失敗
- **Default**: その他のエラー

### ユーザーエクスペリエンス
- **日本語エラーメッセージ**
- **再試行オプション**
- **ホームページへの復帰**
- **技術詳細の表示**（開発者向け）

## 完了条件
- [x] NextAuth.js依存関係のインストール
- [x] SalesforceAuth クラスの実装
- [x] NextAuth.js設定の完了
- [x] API Routesの作成
- [x] 認証コンポーネントの実装
- [x] 認証ページの作成
- [x] レイアウト統合
- [x] TypeScript型チェック通過
- [x] エラーハンドリングの実装

## 次のステップ
- Task 005: Salesforce REST API クライアントの実装
- Salesforce接続アプリの実際の設定
- 環境変数の設定

## 完了日時
2025-06-23