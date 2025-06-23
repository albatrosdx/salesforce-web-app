# Vercel デプロイメント設定ガイド

## 必要な環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

### 1. Salesforce設定
```
SALESFORCE_INSTANCE_URL=https://your-salesforce-domain.my.salesforce.com
SALESFORCE_CLIENT_ID=your_salesforce_client_id_here
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret_here
```

### 2. NextAuth設定
```
NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
NEXTAUTH_SECRET=your_secure_64_character_random_string_here
NEXTAUTH_DEBUG=true
```

**注意**: VercelではNEXTAUTH_URLを設定する際、末尾のスラッシュを含めないでください。
例: `https://your-app.vercel.app` ✅ 
例: `https://your-app.vercel.app/` ❌

### 3. アプリケーション設定
```
NODE_ENV=production
```

## Salesforce Connected App設定

### 重要：Callback URLの設定

SalesforceのConnected Appで以下の**すべて**のCallback URLを許可してください：

```
http://localhost:3000/api/auth/callback/salesforce
https://salesforce-web-app-teal.vercel.app/api/auth/callback/salesforce
https://salesforce-web-app.vercel.app/api/auth/callback/salesforce
https://[your-project-name].vercel.app/api/auth/callback/salesforce
```

**注意事項**：
- Vercelの自動生成URLも含めて登録が必要です
- プレビューデプロイメント用のURLも追加することを推奨
- カスタムドメインを使用する場合はそのURLも追加

### 設定手順：
1. Salesforce設定 → アプリケーション → アプリケーションマネージャー
2. 該当のConnected Appを編集
3. 「Webアプリケーションの設定」セクション
4. 「コールバックURL」に上記URLをすべて追加
5. 保存

## 重要な注意事項

1. **NEXTAUTH_URL**: Vercelの実際のURLと完全に一致させる
2. **環境変数の空白**: 先頭・末尾の空白を削除する
3. **NEXTAUTH_SECRET**: 本番環境では安全な64文字以上の文字列を使用
4. **デバッグ**: 問題発生時は`NEXTAUTH_DEBUG=true`を設定

## トラブルシューティング

### 1. `CLIENT_FETCH_ERROR`
- NEXTAUTH_URLが正しく設定されているか確認
- Salesforce Callback URLにVercelドメインが含まれているか確認

### 2. `Invalid URL`エラー
- 環境変数に空白が含まれていないか確認
- URLの形式が正しいか確認

### 3. 500エラー
- すべての必要な環境変数が設定されているか確認
- Vercelのログで詳細なエラーメッセージを確認