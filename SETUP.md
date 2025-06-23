# Salesforce Web App Setup Guide

## 環境変数設定

アプリケーションを実行する前に、以下の環境変数を設定する必要があります。

### 1. 環境ファイルの作成

`.env.local` ファイルが作成されています。以下の値を実際のSalesforce組織の情報に置き換えてください：

```bash
# Salesforce Configuration
SALESFORCE_INSTANCE_URL=https://your-domain.my.salesforce.com
SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_client_secret
SALESFORCE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_replace_with_random_string

# Application Configuration
NODE_ENV=development
```

### 2. Salesforce設定

#### Connected Appの作成

1. Salesforce Setup → App Manager → New Connected App
2. 以下の設定を行います：
   - **Connected App Name**: Salesforce Web App
   - **API Name**: Salesforce_Web_App
   - **Contact Email**: あなたのメールアドレス
   - **Enable OAuth Settings**: チェック
   - **Callback URL**: `http://localhost:3000/api/auth/callback`
   - **Selected OAuth Scopes**:
     - Access your basic information (id, profile, email, address, phone)
     - Manage user data via APIs (api)
     - Provide access to your data via the Web (web)
     - Perform requests on your behalf at any time (refresh_token, offline_access)

3. 保存後、Consumer Key（Client ID）とConsumer Secret（Client Secret）を取得

#### 環境変数の更新

`.env.local`ファイルの値を以下のように更新：

```bash
# あなたのSalesforce組織のドメインに置き換え
SALESFORCE_INSTANCE_URL=https://your-company.my.salesforce.com

# Connected AppのConsumer Keyに置き換え
SALESFORCE_CLIENT_ID=3MVG9A2kN3Bn17h...

# Connected AppのConsumer Secretに置き換え
SALESFORCE_CLIENT_SECRET=1234567890123456789

# ランダムな文字列を生成して置き換え（32文字以上推奨）
NEXTAUTH_SECRET=your-super-secret-random-string-here
```

### 3. アプリケーションの起動

```bash
npm run dev
```

### 4. トラブルシューティング

#### 認証エラーが発生する場合

1. **環境変数の確認**: `.env.local`ファイルの値が正しく設定されているか確認
2. **Connected App設定**: Salesforce側のConnected App設定が正しいか確認
3. **ドメインURL**: `SALESFORCE_INSTANCE_URL`がhttpsで始まり、末尾にスラッシュがないことを確認
4. **コールバックURL**: Connected AppのCallback URLが`http://localhost:3000/api/auth/callback`に設定されているか確認

#### よくあるエラー

- `undefined/services/oauth2/token`: 環境変数が設定されていない
- `invalid_client_id`: Client IDが間違っている
- `redirect_uri_mismatch`: Callback URLの設定が間違っている

### 5. セキュリティ注意事項

- `.env.local`ファイルは絶対にgitにコミットしない
- 本番環境では適切な環境変数管理システムを使用する
- NEXTAUTH_SECRETは十分に長いランダムな文字列を使用する

### 6. 次のステップ

環境設定が完了したら、以下の機能を利用できます：

- Salesforce認証によるログイン
- 取引先（Account）の閲覧・管理
- 取引先責任者（Contact）の閲覧・管理
- 商談（Opportunity）の閲覧・管理
- 活動（Task/Event）の作成・閲覧
- 権限ベースのアクセス制御