# タスク一覧

## MVP (Minimum Viable Product)

### バックエンド (Supabase & GitHub Actions)

1.  **Supabaseプロジェクトセットアップ**
    *   [x] `users`, `feeds`, `tags`, `feed_tags` テーブルを作成する (スキーマは設計書参照)
    *   [x] RLS (Row Level Security) を初期設定する (一旦全許可、後で厳格化)
2.  **RSS投稿バッチ (Python)**
    *   [x] `scripts/post_to_discord.py` の雛形を作成する
    *   [x] Supabaseから有効なフィード一覧を取得する処理を実装する
    *   [x] `feedparser` を使ってRSSフィードを解析する処理を実装する
    *   [x] 新規投稿のみをフィルタリングするロジックを実装する (差分チェック)
    *   [x] Discord Webhookに通知を送信する処理を実装する
    *   [x] 処理済みの記事IDを `last_posted_guid` としてSupabaseに保存する処理を実装する
    *   [x] 簡単なエラーハンドリングを実装する (try-except)
3.  **GitHub Actionsワークフロー**
    *   [x] `.github/workflows/rss_poster.yml` を作成する
    *   [x] Pythonのセットアップと依存関係のインストールを行うステップを追加する
    *   [x] スクリプト実行ステップを追加し、Supabaseの接続情報をSecrets経由で渡す
    *   [x] 1時間ごとの定期実行 (`schedule`) と手動実行 (`workflow_dispatch`) を設定する

### フロントエンド (Nuxt.js)

1.  **Nuxtプロジェクト初期設定**
    *   [x] `@nuxtjs/supabase` モジュールを導入し、環境変数を設定する
    *   [x] `@nuxt/ui` を使った基本的なレイアウト (`layouts/default.vue`) を作成する
    *   [x] ヘッダーコンポーネント (`components/Layout/TheHeader.vue`) を作成する
2.  **認証機能**
    *   [x] Discordプロバイダを使ったログインページ (`/login`) を作成する
    *   [x] ログイン処理を実装し、Supabaseの `auth.users` と連携させる
    *   [x] 認証状態を管理するComposable (`useAuth`) を作成する
    *   [x] ログインユーザーの情報をヘッダーに表示する
    *   [x] ログアウト機能を実装する
    *   [x] 認証が必要なページを守るためのRoute Middlewareを実装する
3.  **フィード一覧表示 (一般ユーザー向け)**
    *   [x] `/feeds` ページを作成する
    *   [x] Supabaseからフィード一覧を取得するAPI (`/api/feeds`) を作成する
    *   [x] フィード一覧を表示するコンポーネント (`components/Feed/FeedList.vue`) を作成する
    *   [x] フィード項目コンポーネント (`components/Feed/FeedListItem.vue`) を作成する
4.  **管理機能プレースホルダー**
    *   [x] 管理者向けページのレイアウト (`layouts/admin.vue`) を作成する
    *   [x] `/admin/feeds`, `/admin/tags` のプレースホルダーページを作成する

## v1.0

### バックエンド

1.  **RLS (Row Level Security) の厳格化**
    *   [ ] `feeds`, `tags`, `feed_tags` テーブルに対するRLSポリシーを設計・実装する
        *   `users` は `id` が自分のものであれば読み書き可能
        *   `feeds`, `tags` は `admin` ロールのみが書き込み可能、全ユーザーが読み取り可能
2.  **APIの権限設定**
    *   [x] 各APIエンドポイントにロールベースのアクセス制御を実装する (管理者のみが書き込み可能)

### フロントエンド

1.  **フィード管理機能 (管理者向け)**
    *   [ ] `/admin/feeds` ページにフィード一覧をテーブル表示する (`components/Admin/FeedDataTable.vue`)
    *   [ ] フィードの新規登録フォーム (`components/Admin/FeedEditor.vue`) をモーダルで実装する
    *   [ ] フィードの編集機能を実装する
    *   [ ] フィードの削除機能を実装する (確認ダイアログ付き)
2.  **タグ管理機能 (管理者向け)**
    *   [ ] `/admin/tags` ページにタグ一覧をテーブル表示する (`components/Admin/TagDataTable.vue`)
    *   [ ] タグの新規登録フォーム (`components/Admin/TagEditor.vue`) をモーダルで実装する
    *   [ ] タグの編集機能を実装する
    *   [ ] タグの削除機能を実装する
3.  **UI/UX改善**
    *   [ ] 各操作に対するトースト通知 (`useToast`) を実装する
    *   [ ] フィード一覧のタグ検索機能を実装する
    *   [ ] フォームにバリデーションを追加する

## 将来の展望 (v1.1以降)

*   [ ] **通知先の拡張:** Slack, Microsoft Teamsへの通知機能
*   [ ] **高度なフィルタリング:** キーワードフィルタリング機能
*   [ ] **分析機能:** ダッシュボードの追加
*   [ ] **ユーザー管理機能:** 管理者によるロール変更機能
