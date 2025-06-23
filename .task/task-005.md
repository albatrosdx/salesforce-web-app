# Task 005: Salesforce REST API クライアントの実装

## 実施内容

### 1. ブランチ管理ルールの実施
- **プリワークチェックリスト実行**:
  - `git fetch --prune origin`
  - `git branch -vv | grep 'gone]'`
  - `git branch -a`
- **新規ブランチ作成**: `feature/salesforce-api-client`

### 2. SalesforceClient クラスの実装 (src/lib/salesforce/client.ts)

#### 基本機能
- **認証情報管理**: instanceUrl、accessToken
- **統一APIインターフェース**: makeRequest()メソッド
- **エラーハンドリング**: SalesforceApiError統合

#### SOQLクエリ機能
- **query()**: SOQLクエリ実行
- **queryMore()**: ページネーション対応
- **検索機能**: 文字列検索

#### CRUD操作
- **getRecord()**: 単一レコード取得
- **createRecord()**: レコード作成
- **updateRecord()**: レコード更新
- **deleteRecord()**: レコード削除

#### エンティティ別メソッド

##### Account（取引先）
- `getAccounts()`: 一覧取得（ページネーション対応）
- `getAccount()`: 詳細取得
- `searchAccounts()`: 名前による検索

##### Contact（取引先責任者）
- `getContacts()`: 一覧取得
- `getContact()`: 詳細取得
- `getContactsByAccount()`: 取引先別コンタクト取得

##### Opportunity（商談）
- `getOpportunities()`: 一覧取得
- `getOpportunity()`: 詳細取得
- `getOpportunitiesByAccount()`: 取引先別商談取得

##### Activity（活動：Task & Event）
- `getActivitiesByWhat()`: 関連オブジェクト（Account, Opportunity）別活動取得
- `getActivitiesByWho()`: 関連人物（Contact）別活動取得

#### 権限管理
- `getUserPermissions()`: オブジェクト別CRUD権限取得
- **ObjectPermissions**を使用した動的権限チェック
- **デフォルト権限**（読み取りのみ）のフォールバック

#### Picklist機能
- `getPicklistValues()`: 選択リスト値の取得

### 3. React Hooks実装 (src/lib/salesforce/hooks.ts)

#### 基本フック
- `useSalesforceClient()`: 認証済みクライアントの取得
- `useAsyncData()`: 非同期データ取得の汎用フック

#### エンティティ別フック
- **Account**: `useAccounts`, `useAccount`, `useAccountSearch`
- **Contact**: `useContacts`, `useContact`, `useContactsByAccount`
- **Opportunity**: `useOpportunities`, `useOpportunity`, `useOpportunitiesByAccount`
- **Activity**: `useActivitiesByWhat`, `useActivitiesByWho`

#### 管理系フック
- `useUserPermissions()`: ユーザー権限の取得
- `useSalesforceActions()`: CRUD操作用フック
- `usePicklistValues()`: Picklist値取得

#### 状態管理
- **ローディング状態**: isLoading
- **エラーハンドリング**: error
- **データキャッシュ**: React標準の依存関係配列

### 4. エラーハンドリング (src/lib/salesforce/errors.ts)

#### SalesforceApiError クラス
- **カスタムエラークラス**: Error継承
- **詳細エラー情報**: statusCode, salesforceErrors
- **レスポンス解析**: fromResponse()静的メソッド

#### エラー判定ユーティリティ
- `handleSalesforceError()`: エラーメッセージ抽出
- `isRetryableError()`: 再試行可能エラー判定
- `isAuthenticationError()`: 認証エラー判定
- `isPermissionError()`: 権限エラー判定

### 5. ディレクトリ構成

```
src/lib/salesforce/
├── client.ts      # メインAPIクライアント
├── hooks.ts       # Reactフック
├── errors.ts      # エラーハンドリング
└── index.ts       # 統合エクスポート
```

## 技術的詳細

### APIクライアント設計
- **シングルトンパターン**: セッション毎に一つのクライアント
- **認証トークン管理**: NextAuth.jsセッションとの統合
- **リクエスト統一**: 共通ヘッダー、エラーハンドリング

### SOQLクエリ最適化
- **必要フィールドのみ**選択
- **JOIN使用**: 関連オブジェクト情報の一括取得
- **ORDER BY**: 適切なソート順序
- **LIMIT/OFFSET**: ページネーション対応

### パフォーマンス考慮
- **Promise.all**: 並列API呼び出し（Task & Event同時取得）
- **条件分岐**: 不要なAPI呼び出しの回避
- **キャッシュ**: React Hook依存関係による自動キャッシュ

### セキュリティ
- **SOQLインジェクション対策**: パラメータ化クエリ
- **権限チェック**: ObjectPermissions活用
- **エラー情報制限**: 詳細エラーの適切な隠蔽

### TypeScript活用
- **厳密な型付け**: 全API応答の型定義
- **ジェネリクス**: 再利用可能なメソッド設計
- **Union型**: エラーハンドリングの型安全性

## APIエンドポイント

### 使用エンドポイント
- `/services/data/v58.0/query/`: SOQLクエリ実行
- `/services/data/v58.0/sobjects/{SObject}/`: オブジェクト操作
- `/services/data/v58.0/sobjects/{SObject}/describe`: オブジェクト情報取得

### SOQLクエリ例
```sql
-- Account取得
SELECT Id, Name, Type, Industry, Phone, Website, 
       BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
       Description, NumberOfEmployees, AnnualRevenue,
       CreatedDate, LastModifiedDate
FROM Account 
ORDER BY Name ASC 
LIMIT 50 OFFSET 0

-- Contact取得（Account関連情報含む）
SELECT Id, FirstName, LastName, Name, AccountId, Account.Name, 
       Email, Phone, Title, Department, MobilePhone,
       MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,
       CreatedDate, LastModifiedDate
FROM Contact 
ORDER BY LastName ASC, FirstName ASC

-- Activity取得（関連オブジェクト情報含む）
SELECT Id, Subject, Status, Priority, ActivityDate, WhatId, WhoId, 
       What.Name, What.Type, Who.Name, Who.Type, Description, OwnerId, Owner.Name,
       CreatedDate, LastModifiedDate
FROM Task 
WHERE WhatId = '{accountId}' 
ORDER BY CreatedDate DESC
```

## 完了条件
- [x] ブランチ管理ルールに従った開発
- [x] SalesforceClient クラスの完全実装
- [x] React Hooks実装
- [x] エラーハンドリングシステム構築
- [x] TypeScript型チェック通過
- [x] 全CRUD操作の実装
- [x] 権限管理システム統合
- [x] ページネーション対応
- [x] 検索機能実装

## 次のステップ
- Task 006: 基本レイアウトとタブナビゲーションの実装
- 実際のSalesforce環境での動作テスト
- APIレスポンスキャッシュの最適化

## 完了日時
2025-06-23