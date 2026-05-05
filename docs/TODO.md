# Agent Walker TODO

## プロトタイプ

- [x] 静的な 3 ペイン UI プロトタイプを作成する。
- [x] Inbox、Read Later、Valuable、Skipped、Topics の sidebar view を追加する。
- [x] 投稿選択と右 detail pane を実装する。
- [x] 投稿行の hover action を追加する。
- [x] `Collect last 24h` ボタンを追加する。
- [x] 収集ステータスと Inbox 追加を mock する。
- [x] MVP 仕様と設計を docs にまとめる。

## リポジトリ整備

- [x] 最終的な app stack を決める（Deno + Fresh）。
- [x] ローカルに Deno をインストールする（`brew install deno`、現在 2.7.14）。
- [ ] scaffold 先のディレクトリ構成を決める（A: リポジトリ直下に Fresh / B: `app/` サブディレクトリ）。デフォルトは A。
- [ ] Fresh プロジェクトを scaffold する（`deno run -A -r jsr:@fresh/init` で `deno.json`、`fresh.config.ts`、`main.ts`、`dev.ts`、`routes/`、`islands/`、`components/`、`static/` を生成）。
- [ ] 既存の静的プロトタイプ（`index.html` / `app.js` / `styles.css` / `assets/`）を `prototype/` に退避し、参照実装として残す。
- [ ] `deno.json` の `tasks` を整理する（`start` / `dev` / `build` / `fmt` / `lint` / `check` / `test`）。
- [ ] permission scope を `deno task` 側に固定する（`--allow-net=api.x.com,api.openai.com,localhost` / `--allow-read=.` / `--allow-write=./data` / `--allow-env=X_BEARER_TOKEN,OPENAI_API_KEY,DATABASE_URL`、`--allow-all` は使わない）。
- [ ] `data/` ディレクトリを作成し、SQLite ファイル（例: `data/agent-walker.db`）と `.env` を `.gitignore` に追加する。
- [ ] Drizzle と `jsr:@db/sqlite` の最小セットアップを行う（`drizzle.config.ts`、初期 schema、`drizzle-kit` 相当のマイグレーション運用方針）。
- [ ] README にプロダクト概要とローカル起動手順（Deno のインストール、`deno task dev`、必要な環境変数）を書く。
- [ ] `deno fmt` / `deno lint` をリポジトリ全体で 1 回流して整形・指摘ゼロ状態をベースラインにする。
- [ ] 初期 CI（GitHub Actions）を追加する：`deno fmt --check` / `deno lint` / `deno check` / `deno test`。

## フロントエンド

- [ ] プロトタイプを Preact component（Fresh）に移植する。
- [ ] sidebar、feed、detail pane の layout component を作る（必要箇所のみ Island 化）。
- [ ] Inbox、Read Later、Valuable、Skipped、Topics の view state を実装する。
- [ ] 投稿 action の状態遷移を実装する。
- [ ] system prompt と X List id の settings UI を作る。
- [ ] collection progress state を実装する。
- [ ] 各 view の empty state を整える。

## バックエンド

- [ ] 永続化レイヤーを追加する。
- [ ] settings、tracked lists、posts、evaluations、user actions の schema を作る。
- [ ] X post id による重複排除を実装する。
- [ ] collection run の記録を実装する。
- [ ] `Collect last 24h` 用 API route を作る。
- [ ] user action 用 API route を作る。

## X API

- [ ] X API credentials を設定する。
- [ ] List posts fetcher を実装する。
- [ ] `max_results=100` で最大 2 ページ取得する。
- [ ] 過去 24 時間の投稿だけに絞る。
- [ ] 新規投稿だけ保存する。
- [ ] rate limit と API error を扱う。

## Agent Evaluation

- [ ] structured evaluation JSON schema を定義する。
- [ ] relevance scoring prompt を実装する。
- [ ] evaluation context に system prompt を含める。
- [ ] 最近の `Valuable`、`Read Later`、`Skipped` examples を含める。
- [ ] 新規投稿だけ評価する。
- [ ] Inbox 表示候補を最大 50 件に絞る。
- [ ] score、summary、reason、tags、display eligibility を保存する。

## プロダクト判断

- [ ] `Read Later` にした投稿を Inbox に残すか、すぐ移動するか決める。
- [ ] `Valuable` に note を必須にするか決める。
- [ ] `Skipped` 投稿を永久に隠すか、復元可能にするか決める。
- [ ] Agent prompt に含める historical preference examples の件数を決める。
- [ ] MVP で複数 X List を扱うか決める。

## 後でやる

- [ ] リンク展開と記事本文抽出。
- [ ] 保存済み投稿の自然言語検索。
- [ ] 手動 capture 用ブラウザ拡張。
- [ ] X 以外の情報ソース追加。
- [ ] 週次 digest。
