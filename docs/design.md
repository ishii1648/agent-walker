# Agent Walker 設計

## プロダクトの形

Agent Walker は、個人用の research inbox です。SNS フィードではなく、作業用の情報端末として設計します。

目指す体験は、静かで、情報密度があり、流し読みしやすく、仕分けが速いことです。

基本方針:

> 広めに収集し、安く絞り込み、狭く表示する。

このプロダクトは「もう一つのタイムライン」を作るのではなく、「読む価値が高い小さなキュー」を作ります。

## 全体アーキテクチャ

```text
X List
  ↓ ユーザー操作で収集開始
X API fetcher
  ↓ 最大 200 件の最近の投稿
Raw post store
  ↓ post id で重複排除
New candidates
  ↓ Agent evaluation
Evaluations
  ↓ 上位候補を選抜
Inbox, 最大 50 件
  ↓ user action
Read Later / Valuable / Skipped
```

## 採用スタック

本実装は Deno + Fresh を採用します。

- ランタイム: Deno
- UI フレームワーク: Fresh（Preact + Islands Architecture）
- 言語: TypeScript（Deno 標準で組み込み）
- 永続化: SQLite（`jsr:@db/sqlite`）
- ORM: Drizzle（Deno 対応）
- Agent scoring: OpenAI API
- 投稿取得: X API v2
- 整形/静的検査/テスト: `deno fmt` / `deno lint` / `deno test`

現在の実装は静的 HTML/CSS/JS のプロトタイプです。最終的な app architecture ではなく、UI と interaction の参照実装として扱います。

### Deno + Fresh を選んだ理由

個人用ツールとしての主要なリスクは、ローカル端末上での API key 漏洩や SQLite データ流出です。npm の supply chain 攻撃に対する直接的な防御として、Deno の permission model（`--allow-net=api.x.com,api.openai.com` のように許可範囲を限定する）が有効に働きます。

また Fresh の Islands Architecture は、3 ペインで構成され大半が読み取り中心となる本プロダクトの UI と相性が良く、配信する JS を最小限に抑えられます。Preact は React と書き味がほぼ同じで、必要になれば React/Vite 構成へ移行する余地もあります。

`deno fmt` / `deno lint` / `deno test` / `deno task` が標準で揃うため、formatter・lint・タスクランナーの選定や設定が不要になります。

### permission scope の方針

`deno task start` で渡す permission flag は次の最小集合を初期値とします。

- `--allow-net=api.x.com,api.openai.com,localhost`: X API、OpenAI API、開発サーバ。
- `--allow-read=.`: プロジェクト配下の静的ファイルと SQLite ファイル。
- `--allow-write=./data`: SQLite ファイル更新先のみ。
- `--allow-env=X_BEARER_TOKEN,OPENAI_API_KEY,DATABASE_URL`: 必要な環境変数のみ。

`--allow-all` は使用しません。

## データモデル

### settings

個人設定を保存します。

```ts
type Settings = {
  id: string;
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### tracked_lists

収集対象の X List を保存します。

```ts
type TrackedList = {
  id: string;
  platform: "x";
  xListId: string;
  name: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### posts

X から取得した raw post を保存します。

```ts
type Post = {
  id: string;
  xPostId: string;
  xListId: string;
  authorName: string;
  authorHandle: string;
  text: string;
  url: string;
  postedAt: Date;
  fetchedAt: Date;
};
```

### evaluations

Agent の評価結果を保存します。

```ts
type Evaluation = {
  id: string;
  postId: string;
  score: number;
  summary: string;
  reason: string;
  tags: string[];
  shouldShow: boolean;
  evaluatedAt: Date;
};
```

### user_actions

ユーザーの分類と preference signal を保存します。

```ts
type UserAction = {
  id: string;
  postId: string;
  action: "read_later" | "valuable" | "skipped";
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

## X API 収集設計

X API の List posts endpoint を使います。

```text
GET /2/lists/:id/tweets
```

初期ポリシー:

- `max_results=100`
- 1 回の収集で最大 2 ページまで取得。
- ページが残っていても 200 件で止める。
- 過去 24 時間の投稿だけを対象にする。
- 保存済み `xPostId` はスキップする。

重要な点:

- API 取得上限と UI 表示上限を分ける。
- fetcher は最大 200 件収集する。
- Agent は最大 50 件だけ Inbox 表示候補として選ぶ。

## Agent 設計

Agent には compact な context packet を渡します。

- ユーザー system prompt。
- 最近の `Valuable` 投稿サンプル。
- 最近の `Read Later` 投稿サンプル。
- 最近の `Skipped` 投稿サンプル。
- 候補投稿の本文とメタデータ。

MVP では複雑な multi-agent orchestration ではなく、シンプルな scoring pass を優先します。

評価軸:

- system prompt への関連度。
- 実務・学習への有用性。
- 既存保存アイテムと比べた新規性。
- 一般的な感想や薄いニュース紹介ではないか。
- 過去のユーザー操作との相性。

Agent の出力は UI に直接渡せる structured JSON にします。

## UI 設計

### Sidebar

Sidebar には以下を置きます。

- Product identity。
- Flow views:
  - Inbox
  - Read Later
  - Valuable
  - Skipped
- Topic views:
  - Agents
  - LLM Apps
  - AI UI
- Source status。
- Settings entry。

### Header

Header には以下を置きます。

- 現在の view title。
- Collection status。
- `Collect last 24h` button。

Status examples:

- `Idle / 200 collected / 50 shown`
- `X API / Collecting up to 200`
- `Filtered / 38 of 50 shown`

### Feed

Feed は text-first で scan しやすい形にします。

投稿アクションは hover 時に表示します。

- `Read Later`
- `Valuable`
- `Skip`

### Detail Pane

Detail pane は desktop では常時表示します。

ここでは richer explanation surface を提供します。

- Agent summary。
- Why it matters。
- Tags。
- Notes。
- Original source link。

## コスト制御

複数レイヤーでコストを抑えます。

- 常時巡回ではなく、手動収集。
- 1 回の取得は最大 200 件。
- 評価前に重複排除。
- 新規候補だけ Agent 評価。
- UI 表示は最大 50 件。
- prompt に含める preference examples は compact にする。

## 将来拡張

次フェーズ候補:

- リンク展開と記事本文抽出。
- 保存済み `Valuable` 投稿の自然言語検索。
- RSS、GitHub、arXiv、Hacker News、YouTube などの追加ソース。
- 手動保存用ブラウザ拡張。
- 週次サマリー生成。
- より高度な preference learning。
