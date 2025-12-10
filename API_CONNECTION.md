# フロントエンド・バックエンド接続ガイド

このドキュメントでは、フロントエンドとバックエンドの接続方法について説明します。

## 環境変数の設定

フロントエンドのルートディレクトリに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**注意**: バックエンドはデフォルトでポート `8080` で起動します。ポートが異なる場合は、環境変数を適切に設定してください。

## APIクライアントライブラリ

`app/lib/api.ts` に axios を使用した API クライアントライブラリを実装しています。

### 主な機能

- **認証関連**
  - `initiateSignup()`: サインアップ開始（メール認証コード送信）
  - `verifySignupCode()`: サインアップ完了（コード検証）
  - `setPassword()`: パスワード設定
  - `login()`: ログイン
  - `getCurrentUser()`: 現在のユーザー情報取得
  - `logout()`: ログアウト
  - `getOAuthUrl()`: OAuth認証URL取得

- **プロジェクト関連**
  - `getProjects()`: プロジェクト一覧取得
  - `getProjectById()`: プロジェクト詳細取得
  - `searchProjects()`: プロジェクト検索
  - `toggleFavorite()`: お気に入り追加/削除
  - `getFavorites()`: お気に入り一覧取得
  - `getViewHistory()`: 閲覧履歴取得
  - `getRecommendedProjects()`: レコメンドプロジェクト取得
  - `getProjectReturns()`: プロジェクトのリターン一覧取得

- **決済関連**
  - `createPayment()`: 決済インテント作成
  - `confirmPayment()`: 決済確認

- **動画関連**
  - `getVideosByOwner()`: 動画一覧取得（出品者用）
  - `getVideoById()`: 動画詳細取得
  - `createVideo()`: 動画作成
  - `updateVideo()`: 動画更新
  - `deleteVideo()`: 動画削除
  - `addVideoComment()`: コメント追加
  - `getVideoStats()`: 動画統計情報取得
  - `getDashboardStats()`: ダッシュボード統計情報取得

## 認証フック

`app/hooks/useAuth.ts` に認証状態管理フックを実装しています。

### 使用方法

```typescript
import { useAuth } from '@/app/hooks/useAuth';

const MyComponent = () => {
  const { user, loading, isAuthenticated, login, logout } = useAuth();

  // ...
};
```

## 接続済みページ

以下のページがバックエンドAPIに接続されています：

1. **認証ページ**
   - `/login`: ログインページ
   - `/signup`: サインアップページ
   - `/verify-email`: メール認証ページ
   - `/set-password`: パスワード設定ページ

2. **プロジェクトページ**
   - `/crowdfunding`: プロジェクト一覧ページ
   - `/crowdfunding/[projectId]`: プロジェクト詳細ページ
   - `/crowdfunding/[projectId]/support`: リターン選択ページ
   - `/crowdfunding/checkout`: チェックアウトページ

3. **OAuth認証**
   - Google、Apple、Facebook の OAuth 認証ボタンが実装されています

## 注意事項

1. **CORS設定**: バックエンドの `main.ts` で CORS が有効になっていることを確認してください。

2. **認証トークン**: ログイン後、トークンは `localStorage` に保存され、APIリクエスト時に自動的にヘッダーに追加されます。

3. **エラーハンドリング**: API エラーは `apiClient` のインターセプターで処理され、401エラーの場合は自動的にログインページへリダイレクトされます。

4. **OAuth認証**: OAuth認証はサーバーサイドでリダイレクトベースで実装されているため、ボタンをクリックするとバックエンドのOAuthエンドポイントへリダイレクトされます。

## 開発時の確認事項

1. バックエンドサーバーが `http://localhost:8080` で起動していることを確認（デフォルトポート）
2. フロントエンドサーバーが `http://localhost:3000` で起動していることを確認（Next.jsのデフォルト）
3. `.env.local` ファイルが正しく設定されていることを確認（`NEXT_PUBLIC_API_URL=http://localhost:8080/api`）
4. ブラウザのコンソールでエラーがないことを確認

