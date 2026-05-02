# Agent Walker 仕様

## 概要

Agent Walker は、X の curated List から AI 関連の高シグナルな投稿を収集し、AI Agent が選別して表示する個人用リサーチ Inbox です。

現在の「X List をスクロールしながら気になる投稿を探す」体験を、明示的な収集、AI によるフィルタリング、軽量な 3 ペイン UI に置き換えることを目的とします。

## 解決したい課題

現在の X List 運用には、主に以下の課題があります。

- インフルエンサーの投稿すべてが高品質・高関連度ではなく、 raw timeline を読むと注意が浪費される。
- 良い投稿を後から探したいときに、検索履歴、いいね、ブックマーク、タイムラインに埋もれやすい。
- 欲しいのは無限フィードではなく、学習・調査に使える個人用の情報整理体験である。

## MVP の目的

MVP では、以下を実現します。

- ユーザーが明示的に操作したタイミングで、X List から最近の投稿を収集する。
- 収集量と表示量に上限を設け、コストと認知負荷を抑える。
- AI Agent が投稿を評価し、本当に読む価値がありそうな投稿だけを選別する。
- ユーザーが投稿を `Read Later`、`Valuable`、`Skipped` に分類できる。
- ユーザーの分類結果を、次回以降の Agent 判断に使える preference signal として蓄積する。

## 基本ユーザーフロー

1. ユーザーが Agent Walker を開く。
2. `Collect last 24h` を押す。
3. システムが設定済み X List から最大 200 件の投稿を取得する。
4. 投稿 ID で重複排除する。
5. Agent が新規候補投稿を評価する。
6. 上位最大 50 件を `Inbox` に表示する。
7. ユーザーは Slack 風の flow UI で投稿を流し読みする。
8. ユーザーは投稿を以下に分類する。
   - `Read Later`: 気になるが、まだ価値は未確定。
   - `Valuable`: 読んだ結果、今後も参照したい強い正例。
   - `Skipped`: 不要。今後似た投稿の優先度を下げたい負例。

## MVP スコープ

### 対象

- 個人用ツール。
- 情報ソースは X のみ。
- 1 つ以上の X List を設定可能。
- `Collect last 24h` による手動収集。
- 1 回の収集で最大 200 件取得。
- Agent フィルタ後、UI には最大 50 件表示。
- 3 ペイン UI。
  - 左: ナビゲーション。
  - 中央: 投稿フロー。
  - 右: 詳細ペイン。
- 以下のビュー。
  - Inbox
  - Read Later
  - Valuable
  - Skipped
  - Topic filters
- relevance 判断用の system prompt。
- 投稿、評価、設定、ユーザー操作の永続化。

### MVP では扱わないこと

- 常時バックグラウンド巡回。
- マルチユーザー / チーム利用。
- RSS、GitHub、arXiv、Hacker News、YouTube、ブログなど X 以外の情報源。
- ナレッジベースの自然言語検索。
- 週次レポート。
- ブラウザ拡張。
- モバイルファースト UI。
- X への投稿、返信、いいねなどの write action。

## 収集ルール

収集は自動ではなく、ユーザーの明示操作で開始します。

初期ポリシー:

- Trigger: ユーザーが `Collect last 24h` を押す。
- Time window: 過去 24 時間。
- Fetch limit: 最大 200 投稿。
- X API strategy: List posts endpoint を `max_results=100` で呼び、最大 2 ページまで取得。
- Deduplication: 保存済み post id はスキップ。
- Agent evaluation: 新規投稿だけ評価。
- UI output: 最大 50 件だけ表示。

この設計により、API 利用量、モデル費用、人間の読む負荷をすべて上限管理します。

## Agent 評価の入力

Agent は以下を使って投稿を評価します。

- ユーザーの system prompt。
- 過去に `Valuable` とされた投稿。強い正例。
- 過去に `Read Later` とされた投稿。弱い正例。
- 過去に `Skipped` とされた投稿。負例。
- 現在評価対象の投稿本文。
- 投稿者メタデータ。
- 将来的にはリンク先本文や記事要約。

## Agent 評価の出力

各候補投稿に対して、Agent は以下を返します。

- `score`: relevance score。
- `summary`: 短い要約。
- `reason`: なぜこの投稿が重要か。
- `tags`: topic labels。
- `shouldShow`: Inbox 表示候補にするかどうか。

## UI 要件

### レイアウト

固定 3 ペイン構成にします。

- 左: ナビゲーションとソース状態。
- 中央: 投稿フロー。
- 右: 選択中投稿の詳細。

### 中央フィード

中央フィードは本文中心で軽く流し読みできることを優先します。

各投稿行に表示する情報:

- 投稿者名。
- handle。
- 時刻。
- 投稿本文。
- Agent の判定理由。
- タグ。
- score の小さな表示。

投稿アクションは hover 時だけ表示します。

- `Read Later`
- `Valuable`
- `Skip`

### 詳細ペイン

右ペインは desktop では常時表示します。

表示する情報:

- 投稿者。
- 元 X 投稿へのリンク。
- 投稿全文。
- Agent summary。
- Agent reason。
- Tags。
- Save note。
- Primary actions。

## 成功条件

MVP が成功している状態:

- ユーザーが AI 情報収集のために raw X timeline を読む時間を減らせる。
- 収集操作が明示的で、コストや範囲が分かりやすい。
- Inbox が一度に読み切れる件数に収まっている。
- `Valuable` な投稿を後から見つけやすい。
- ユーザー操作が Agent の preference data として蓄積される。
