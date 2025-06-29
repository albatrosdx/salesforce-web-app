# Task 009: 商談（Opportunity）一覧・詳細画面の実装

## 実施内容

### 1. ブランチ管理ルールの実施
- **プリワークチェックリスト実行**:
  - `git fetch --prune origin`
  - `git branch -vv | grep 'gone]'`
  - `git branch -a`
- **削除されたリモートブランチの対応**: `feature/accounts-implementation`, `feature/contacts-implementation`ブランチの削除
- **新規ブランチ作成**: `feature/opportunities-implementation`

### 2. 商談コンポーネントの実装

#### OpportunityList コンポーネント (src/components/opportunities/OpportunityList.tsx)
- **一覧表示機能**: 商談レコードの表形式表示
- **選択機能**: 個別選択・全選択チェックボックス
- **ページネーション**: Load Moreボタンによる追加読み込み
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **状態管理**: ローディング・エラー・空状態の表示

##### 表示項目
- 商談名（詳細ページへのリンク）
- 取引先（取引先詳細へのリンク）
- ステージ、完了予定日
- 金額、確度
- 所有者
- 最終更新日

#### OpportunityDetail コンポーネント (src/components/opportunities/OpportunityDetail.tsx)
- **詳細情報表示**: 商談の全項目表示
- **タブナビゲーション**: 詳細・活動・その他
- **関連レコード**: 関連する活動・取引先責任者の表示
- **アクション**: 編集・削除ボタン

##### タブ構成
1. **詳細タブ**: 基本情報、売上予測、説明、システム情報
2. **活動タブ**: 活動タイムライン（今後実装予定）
3. **その他タブ**: その他の関連情報

#### OpportunitySearch コンポーネント (src/components/opportunities/OpportunitySearch.tsx)
- **リアルタイム検索**: 500msデバウンス処理
- **部分一致検索**: 商談名による柔軟な検索
- **検索結果表示**: OpportunityListコンポーネントを再利用
- **検索ヒント**: ユーザーガイダンス表示

### 3. ページ実装

#### 商談一覧ページ (src/app/dashboard/opportunities/page.tsx)
- **Salesforceデータ統合**: useOpportunitiesフックによるデータ取得
- **エラーハンドリング**: 接続エラー・認証エラーの適切な表示
- **リフレッシュ機能**: データ再読み込み機能
- **新規作成**: 新規商談作成ボタン（今後実装）

#### 商談パイプライン画面 (src/app/dashboard/opportunities/pipeline/page.tsx)
- **パイプライン表示**: ステージ別商談のカンバン表示
- **ドラッグ&ドロップ**: ステージ間の商談移動（今後実装）
- **フィルタリング**: 期間・所有者によるフィルタ

#### 商談詳細ページ (src/app/dashboard/opportunities/[id]/page.tsx)
- **動的ルーティング**: URLパラメータから商談ID取得
- **データ統合**: 商談・関連レコードの並列取得
- **パンくずナビ**: 詳細ページの位置表示
- **戻るボタン**: ブラウザ履歴に基づく戻り機能

### 4. Salesforce Hooks統合

#### 新規フック実装
- `useOpportunitySearch()`: 商談検索

#### データフロー
```
Page Component → Salesforce Hook → SalesforceClient → Salesforce API
     ↓                ↓                    ↓              ↓
   UI Update ← React State ← Response ← REST API Response
```

## 技術的詳細

### コンポーネント設計
- **再利用性**: OpportunityListは検索・一覧両方で使用
- **責任分離**: 表示ロジックとデータ取得の分離
- **プロップスドリリング回避**: 必要な状態のみ渡す設計

### 状態管理
- **ローカル状態**: useState（選択状態、検索語句）
- **サーバー状態**: SWRパターン（Salesforceフック）
- **URL状態**: Next.js App Router（ページパラメータ）

### エラーハンドリング
- **ネットワークエラー**: 再試行ボタン提供
- **認証エラー**: 適切なメッセージ表示
- **データなし**: 空状態の適切な表示

### パフォーマンス最適化
- **仮想化なし**: 現在は基本実装（今後Large Datasetで検討）
- **デバウンス**: 検索API呼び出し制限
- **並列データ取得**: Promise.allパターン

### アクセシビリティ
- **キーボードナビゲーション**: tabindex適切な設定
- **スクリーンリーダー**: aria-label, role属性
- **カラーコントラスト**: WCAG準拠
- **フォーカス管理**: 適切なフォーカス遷移

## UI/UXの特徴

### レスポンシブデザイン
- **グリッドレイアウト**: モバイル1列、タブレット2列、デスクトップ3列
- **フレックスボックス**: アイテム間の柔軟な配置
- **ブレークポイント**: Tailwind CSS標準

### インタラクション
- **ホバー効果**: カード・ボタンのホバー状態
- **ローディング状態**: スピナー・skeleton表示
- **フィードバック**: 操作結果の視覚的フィードバック

### ナビゲーション
- **パンくずナビ**: 現在位置の明確化
- **戻るボタン**: ユーザーの期待に沿った動作
- **タブナビ**: 関連情報への簡単アクセス

## データ表示

### フォーマット関数活用
- **日付**: `formatDate()` - 日本語ロケール
- **通貨**: `formatCurrency()` - 日本円表示
- **パーセンテージ**: `formatPercentage()` - 確度表示
- **文字切り詰め**: `truncateText()` - 長文の適切な切り詰め

### 情報階層
1. **主要情報**: 商談名、取引先、ステージ
2. **売上情報**: 金額、確度、完了予定日
3. **担当情報**: 所有者
4. **システム情報**: 作成日、更新日

## ルーティング構造

```
/dashboard/opportunities          # 商談一覧
├── /pipeline                    # パイプライン表示
└── /[id]                       # 商談詳細
    ├── ?tab=details            # 詳細タブ
    ├── ?tab=activities         # 活動タブ
    └── ?tab=other             # その他タブ
```

## 完了条件
- [ ] ブランチ管理ルールに従った開発
- [ ] OpportunityListコンポーネントの完全実装
- [ ] OpportunityDetailコンポーネントの完全実装
- [ ] OpportunitySearchコンポーネントの実装
- [ ] 商談一覧ページのSalesforceデータ統合
- [ ] 商談詳細ページの動的ルーティング実装
- [ ] 商談パイプラインページの実装
- [ ] エラーハンドリングの実装
- [ ] レスポンシブデザインの実装
- [ ] TypeScript型チェック通過

## 今後の拡張予定
- 商談作成・編集フォーム
- 一括操作機能（選択した商談の一括削除等）
- 高度な検索フィルター
- エクスポート機能
- パイプラインのドラッグ&ドロップ機能

## 次のステップ
- Task 010: 活動タイムライン機能の実装
- 商談作成・編集機能の実装
- パイプライン高度機能の実装

## 開始日時
2025-06-23