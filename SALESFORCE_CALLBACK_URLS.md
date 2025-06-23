# Salesforce Connected App Callback URLs 設定ガイド

## 問題：redirect_uri_mismatch エラー

### エラー内容
```
error=redirect_uri_mismatch&error_description=redirect_uri must match configuration
```

このエラーは、NextAuthが送信するredirect_uriがSalesforceのConnected Appに登録されていない場合に発生します。

## 解決方法

### 1. Salesforce Connected Appの設定を更新

#### 設定手順：
1. **Salesforce Setup** にログイン
2. **App Manager** → 該当のConnected Appを見つける
3. **Manage** → **Edit Policies** をクリック
4. **OAuth Policies** セクションで **Edit** をクリック
5. **Callback URL** フィールドに以下のURLをすべて追加：

```
http://localhost:3000/api/auth/callback/salesforce
https://salesforce-web-app-teal.vercel.app/api/auth/callback/salesforce
https://salesforce-web-app.vercel.app/api/auth/callback/salesforce
https://[your-project-name].vercel.app/api/auth/callback/salesforce
https://[your-custom-domain].com/api/auth/callback/salesforce
```

### 2. Vercelの自動生成URLについて

Vercelは以下のパターンでURLを生成します：
- **本番環境**: `https://[project-name].vercel.app`
- **プレビュー**: `https://[project-name]-[random-string].vercel.app`
- **ブランチ**: `https://[project-name]-[branch-name].vercel.app`

すべての環境で動作させるため、想定されるURLパターンをすべて登録してください。

### 3. 注意事項

- URLは**完全一致**である必要があります（大文字小文字も区別されます）
- 末尾のスラッシュの有無も重要です（通常は含めません）
- プロトコル（http/https）も正確に一致させる必要があります
- 保存後、変更が反映されるまで数分かかる場合があります

### 4. デバッグ方法

エラーが続く場合は、ブラウザの開発者ツールでネットワークタブを確認し、実際のredirect_uriパラメータを確認してください：

```
https://[salesforce-domain]/services/oauth2/authorize?
  client_id=...&
  redirect_uri=https://salesforce-web-app-teal.vercel.app/api/auth/callback/salesforce&
  ...
```

この`redirect_uri`の値が、Connected Appに登録されているものと完全に一致していることを確認してください。

## トラブルシューティング

### よくある問題：

1. **URLのタイポ**: コピー＆ペースト時のミスに注意
2. **HTTPSとHTTPの混在**: 本番環境は必ずHTTPS
3. **ポート番号**: localhost:3000など、ポート番号も含める
4. **パスの相違**: `/api/auth/callback/salesforce`のパスが正確か確認

### 確認コマンド：

Connected Appの現在の設定を確認するには、Salesforce CLIを使用：

```bash
sfdx force:org:open -p /lightning/setup/ConnectedApplication/home
```