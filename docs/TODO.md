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
- [ ] Fresh プロジェクトを scaffold する（`deno.json`、`fresh.config.ts`、`routes/`、`islands/`、`static/`）。
- [ ] 静的プロトタイプを `prototype/` に退避し、Fresh route 配下に移植する。
- [ ] README にプロダクト概要とローカル起動手順（Deno のインストール含む）を書く。
- [ ] `deno fmt` / `deno lint` の実行を確認する（追加設定不要だが、`deno.json` で範囲を明示する）。
- [ ] permission scope（`--allow-net`、`--allow-read`、`--allow-write`、`--allow-env`）を `deno task` に固定する。
- [ ] 初期 CI（`deno fmt --check` / `deno lint` / `deno test`）を追加する。

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
