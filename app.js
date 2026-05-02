const posts = [
  {
    id: "p1",
    status: "inbox",
    author: "Maya Chen",
    handle: "@maya_builds",
    initials: "MC",
    time: "09:12",
    fit: 92,
    text:
      "Agent UI の一番大きな罠は、モデルの賢さを見せようとして画面が説明過多になること。ユーザーが本当に欲しいのは、判断の根拠が必要な瞬間だけ開ける軽い surface だと思う。",
    reason: "AI UI の情報密度設計に関係。今回のプロダクト仮説とかなり近い。",
    summary:
      "Agent の出力を常時大きく見せるのではなく、ユーザーが判断したいタイミングで根拠を開ける UI を提案している。",
    tags: ["AI UI", "Agent UX", "Product"],
    url: "https://x.com/maya_builds/status/1",
  },
  {
    id: "p2",
    status: "read_later",
    author: "Kenji Sato",
    handle: "@ksato_ai",
    initials: "KS",
    time: "10:04",
    fit: 87,
    text:
      "LLM app の評価は accuracy だけでは足りない。ユーザーが二度目に戻ってきたとき、前回の判断・保存・破棄がどれだけ文脈として効いているかを見るべき。",
    reason: "保存済み記事を relevance 判断に使う設計と直接つながる。",
    summary:
      "LLM アプリの継続利用では、過去の操作ログが次の体験に反映されているかが重要だと指摘している。",
    tags: ["Evaluation", "Memory", "LLM Apps"],
    url: "https://x.com/ksato_ai/status/2",
  },
  {
    id: "p3",
    status: "valuable",
    author: "Nora Fields",
    handle: "@nora_research",
    initials: "NF",
    time: "11:26",
    fit: 81,
    text:
      "Research inboxes should not become another inbox. The trick is to make triage faster than reading, and make saving feel like teaching the system.",
    reason: "Read Later / Valuable / Skipped の仕分け体験にそのまま使える。",
    summary:
      "情報収集 UI は新しい未読箱を増やすのではなく、仕分けを読むより速くし、保存操作を学習データに変えるべきという主張。",
    tags: ["Research", "Triage", "Personalization"],
    url: "https://x.com/nora_research/status/3",
  },
  {
    id: "p4",
    status: "inbox",
    author: "Leo Park",
    handle: "@leo_agents",
    initials: "LP",
    time: "12:18",
    fit: 76,
    text:
      "最近の agent framework は orchestration の抽象化が増えているけど、実務で効くのは tracing と replay。失敗した chain を後から読めない agent はプロダクトに入れにくい。",
    reason: "Agent 開発者向けの実装知見。今後の拡張ソース候補にもなる。",
    summary:
      "Agent framework では orchestration よりも tracing / replay が実用上重要で、失敗分析できることが導入の鍵になるという話。",
    tags: ["Agents", "Tracing", "Devtools"],
    url: "https://x.com/leo_agents/status/4",
  },
  {
    id: "p5",
    status: "skipped",
    author: "Ari Tan",
    handle: "@ari_product",
    initials: "AT",
    time: "13:45",
    fit: 69,
    text:
      "AI news の feed は『早い』より『自分の次の意思決定に関係する』ほうが価値が高い。速報性で勝つより、判断材料として残る形に変換したい。",
    reason: "個人用リサーチツールの価値定義に近いが、具体実装は薄め。",
    summary:
      "AI 情報収集では速報性よりも、自分の意思決定に使える形で情報を残すことが重要だと述べている。",
    tags: ["Curation", "Decision", "Knowledge"],
    url: "https://x.com/ari_product/status/5",
  },
];

const collectedPosts = [
  {
    id: "p6",
    status: "inbox",
    author: "Sofia Grant",
    handle: "@sofia_models",
    initials: "SG",
    time: "14:08",
    fit: 89,
    text:
      "Personal agents need a cost boundary in the product surface. A user-triggered collection window is easier to trust than a background process that keeps spending silently.",
    reason: "収集開始ボタンと最大24時間取得という設計判断に直接関係する。",
    summary:
      "個人用 Agent では、バックグラウンドで常時コストが発生するより、ユーザーが明示的に開始する収集ウィンドウの方が信頼されやすいという指摘。",
    tags: ["Cost Control", "Agent UX", "Product"],
    url: "https://x.com/sofia_models/status/6",
  },
  {
    id: "p7",
    status: "inbox",
    author: "Daniel Wu",
    handle: "@daniel_retrieval",
    initials: "DW",
    time: "14:21",
    fit: 84,
    text:
      "For feeds, the expensive step is rarely fetching. It is scoring everything. Run retrieval sparsely, dedupe aggressively, and only send new candidates to the model.",
    reason: "X API 取得後の Agent 評価コストを抑える実装方針として重要。",
    summary:
      "フィード処理では取得よりもスコアリングが高コストになりがちなので、差分取得・重複排除・新規候補だけの評価が重要という話。",
    tags: ["Retrieval", "Evaluation", "Cost Control"],
    url: "https://x.com/daniel_retrieval/status/7",
  },
];

const postList = document.querySelector("#postList");
const navItems = document.querySelectorAll(".nav-item[data-view]");
const collectButton = document.querySelector("#collectButton");
const collectionStatus = document.querySelector("#collectionStatus");
const feedEyebrow = document.querySelector("#feedEyebrow");
const feedTitle = document.querySelector("#feedTitle");
const feedDivider = document.querySelector("#feedDivider");
const detailEmpty = document.querySelector("#detailEmpty");
const detailCard = document.querySelector("#detailCard");
const detailAuthor = document.querySelector("#detailAuthor");
const detailSource = document.querySelector("#detailSource");
const detailText = document.querySelector("#detailText");
const detailSummary = document.querySelector("#detailSummary");
const detailReason = document.querySelector("#detailReason");
const detailTags = document.querySelector("#detailTags");
let currentPosts = [];
let activeView = "inbox";

const views = {
  inbox: {
    eyebrow: "Inbox",
    title: "今日の候補",
    divider: "May 2, 2026",
    empty: "新しい候補投稿はありません。",
    filter: (post) => post.status === "inbox",
  },
  read_later: {
    eyebrow: "Read Later",
    title: "後で読む",
    divider: "Saved for later",
    empty: "後で読む投稿はまだありません。",
    filter: (post) => post.status === "read_later",
  },
  valuable: {
    eyebrow: "Valuable",
    title: "読んで良かった",
    divider: "Strong positive examples",
    empty: "良かった投稿はまだありません。",
    filter: (post) => post.status === "valuable",
  },
  skipped: {
    eyebrow: "Skipped",
    title: "スキップ済み",
    divider: "Negative examples",
    empty: "スキップ済み投稿はありません。",
    filter: (post) => post.status === "skipped",
  },
};

function tagMarkup(tags) {
  return tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function getView(viewId) {
  if (viewId.startsWith("topic:")) {
    const topic = viewId.replace("topic:", "");
    return {
      eyebrow: "Topic",
      title: topic,
      divider: `Tagged ${topic}`,
      empty: `${topic} の投稿はまだありません。`,
      filter: (post) => post.tags.includes(topic),
    };
  }

  return views[viewId] || views.inbox;
}

function renderPosts(viewId = "inbox") {
  activeView = viewId;
  const view = getView(viewId);
  currentPosts = posts.filter(view.filter);
  feedEyebrow.textContent = view.eyebrow;
  feedTitle.textContent = view.title;
  feedDivider.textContent = view.divider;

  if (currentPosts.length === 0) {
    postList.innerHTML = `<li class="empty-state">${view.empty}</li>`;
    clearDetail(view.empty);
    return;
  }

  postList.innerHTML = currentPosts
    .map(
      (post, index) => `
        <li class="post-item ${index === 0 ? "selected" : ""}" data-post-id="${post.id}">
          <div class="avatar" aria-hidden="true">${post.initials}</div>
          <div class="post-main">
            <div class="post-meta">
              <span class="post-author">${post.author}</span>
              <span class="post-handle">${post.handle}</span>
              <span class="post-time">${post.time}</span>
              <span class="fit-pill">${post.fit}</span>
            </div>
            <p class="post-text">${post.text}</p>
            <p class="post-reason">${post.reason}</p>
            <div class="tag-row">${tagMarkup(post.tags)}</div>
            <div class="post-actions" aria-label="Post actions">
              <button class="post-action later" type="button">Read Later</button>
              <button class="post-action valuable" type="button">Valuable</button>
              <button class="post-action skip" type="button">Skip</button>
            </div>
          </div>
        </li>
      `,
    )
    .join("");

  selectPost(currentPosts[0].id);
}

function selectPost(postId) {
  const post = currentPosts.find((item) => item.id === postId);
  if (!post) return;

  document.querySelectorAll(".post-item").forEach((item) => {
    item.classList.toggle("selected", item.dataset.postId === postId);
  });

  detailEmpty.hidden = true;
  detailCard.hidden = false;
  detailAuthor.textContent = `${post.author} ${post.handle}`;
  detailSource.href = post.url;
  detailText.textContent = post.text;
  detailSummary.textContent = post.summary;
  detailReason.textContent = post.reason;
  detailTags.innerHTML = tagMarkup(post.tags);
}

function clearDetail(message) {
  detailCard.hidden = true;
  detailEmpty.hidden = false;
  detailEmpty.querySelector("p").textContent = message;
}

function setActiveNav(viewId) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });
}

function updateCollectionStatus(label, value, collecting = false) {
  collectionStatus.classList.toggle("collecting", collecting);
  collectionStatus.querySelector("span").textContent = label;
  collectionStatus.querySelector("strong").textContent = value;
}

renderPosts("inbox");

postList.addEventListener("click", (event) => {
  const item = event.target.closest(".post-item");
  if (!item) return;

  if (event.target.closest(".post-action")) {
    event.stopPropagation();
    event.target.closest(".post-action").textContent = "Saved";
    return;
  }

  selectPost(item.dataset.postId);
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const viewId = item.dataset.view;
    setActiveNav(viewId);
    renderPosts(viewId);
  });
});

collectButton.addEventListener("click", () => {
  collectButton.disabled = true;
  collectButton.textContent = "Collecting...";
  updateCollectionStatus("X API", "Collecting up to 200", true);

  window.setTimeout(() => {
    const existingIds = new Set(posts.map((post) => post.id));
    const freshPosts = collectedPosts.filter((post) => !existingIds.has(post.id));
    posts.unshift(...freshPosts);

    collectButton.disabled = false;
    collectButton.textContent = "Collect last 24h";
    updateCollectionStatus("Filtered", `${freshPosts.length} of 50 shown`);

    setActiveNav("inbox");
    renderPosts("inbox");
  }, 900);
});
