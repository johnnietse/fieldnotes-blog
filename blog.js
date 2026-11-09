(function () {
  const activity = window.OPEN_SOURCE_ACTIVITY || [];
  const covers = window.BLOG_COVERS || {};
  const orgNames = {
    "johnnietse": "Johnnie Tse · project repositories",
    "kubernetes-sigs": "Kubernetes SIGs",
    "llm-d": "llm-d",
    "solana-foundation": "Solana Foundation",
    "MLH-Fellowship": "MLH Fellowship",
    "docker": "Docker Desktop",
    "Queen-s-High-Performance-Computing": "Queen's HPC",
    "Mantevo": "Mantevo"
  };
  const posts = [...window.BLOG_POSTS].sort((a, b) =>
    String(b.updated || b.date).localeCompare(String(a.updated || a.date)) ||
    String(b.date).localeCompare(String(a.date)) ||
    a.title.localeCompare(b.title)
  );

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, character =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]
    );
  }
  function prettyDate(value, options) {
    return new Date(value + "T12:00:00").toLocaleDateString("en-US",
      options || { year: "numeric", month: "short", day: "numeric" });
  }
  function organizationName(owner) { return orgNames[owner] || owner || "Project"; }
  function repoName(path) { return String(path || "").split("/").slice(1).join("/") || "Project note"; }
  function articleSlug(post) { return String(post.title || post.id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function safeURL(value) {
    return /^https?:\/\//i.test(String(value || "")) ? String(value) : "#";
  }

  const postList = document.getElementById("post-list");
  const filters = document.getElementById("filters");
  const collectionTabs = document.getElementById("collection-tabs");
  const search = document.getElementById("post-search");
  const organizationFilter = document.getElementById("organization-filter");
  const projectGroupFilter = document.getElementById("project-group-filter");
  const repoFilter = document.getElementById("repo-filter");
  let activeTag = "All";
  let activeCollection = "All";
  let topicsExpanded = false;

  function fillSelect(select, firstLabel, values, labelFor) {
    const prior = select.value || "All";
    select.innerHTML = '<option value="All">' + escapeHTML(firstLabel) + '</option>' +
      values.map(value => '<option value="' + escapeHTML(value) + '">' +
        escapeHTML(labelFor(value)) + '</option>').join("");
    if (values.includes(prior)) select.value = prior;
  }
  function renderFacets() {
    const owners = [...new Set(posts.map(post => post.organization).filter(Boolean))]
      .sort((a, b) => organizationName(a).localeCompare(organizationName(b)));
    fillSelect(organizationFilter, "All organizations", owners, organizationName);
    const groups = [...new Set(posts.filter(post => post.entryType === "Project")
      .map(post => post.projectGroup).filter(Boolean))].sort();
    fillSelect(projectGroupFilter, "All project groups", groups, value => value);
    const owner = organizationFilter.value;
    const paths = [...new Set(posts.filter(post => !owner || owner === "All" || post.organization === owner)
      .map(post => post.repo).filter(Boolean))].sort((a, b) => repoName(a).localeCompare(repoName(b)));
    fillSelect(repoFilter, "All repositories and projects", paths, path =>
      organizationName(path.split("/")[0]) + " / " + repoName(path));
  }
  function renderCollectionTabs() {
    const options = [
      ["All", "All stories"],
      ["Project", "Projects & research"],
      ["Open source", "Open source"],
      ["Writing", "Writing"]
    ];
    collectionTabs.innerHTML = options.map(([value, label]) => {
      const count = value === "All" ? posts.length : posts.filter(post => post.entryType === value).length;
      return '<button class="collection-tab ' + (activeCollection === value ? "active" : "") +
        '" type="button" data-collection="' + escapeHTML(value) + '" aria-pressed="' +
        (activeCollection === value) + '">' + escapeHTML(label) + '<span>' + count + '</span></button>';
    }).join("");
    collectionTabs.querySelectorAll("[data-collection]").forEach(button =>
      button.addEventListener("click", () => {
        activeCollection = button.dataset.collection;
        renderCollectionTabs();
        renderPosts();
      }));
  }
  function renderFilters() {
    const counts = new Map();
    const statusTags = new Set(posts.filter(post => post.entryType === "Open source")
      .flatMap(post => [post.activityStatus, "Open-source pull request", "Public-fork pull request",
        "Personal or practice PR", "Authored open-source issue", "Open-source issue discussion", "Open source"])
      .filter(Boolean));
    posts.flatMap(post => post.tags || []).filter(tag => !statusTags.has(tag))
      .forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1));
    const sortedTags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b));
    const shownSet = new Set(topicsExpanded ? sortedTags : sortedTags.slice(0, 8));
    if (activeTag !== "All") shownSet.add(activeTag);
    const shownTags = sortedTags.filter(tag => shownSet.has(tag));
    filters.innerHTML = '<span class="topic-label">TOPICS</span>' + ["All", ...shownTags].map(tag =>
      '<button class="filter-chip ' + (tag === activeTag ? "selected" : "") +
      '" type="button" data-filter="' + escapeHTML(tag) + '" aria-pressed="' +
      (tag === activeTag) + '">' + escapeHTML(tag === "All" ? "All topics" : tag) + '</button>').join("") +
      (sortedTags.length > 8 ? '<button class="topic-more" type="button" data-expand-topics="true">' +
        (topicsExpanded ? "Fewer topics" : "More topics · " + (sortedTags.length - 8)) + '</button>' : "");
    filters.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
      if (button.hasAttribute("data-expand-topics")) {
        topicsExpanded = !topicsExpanded;
        renderFilters();
        return;
      }
      activeTag = button.dataset.filter;
      renderFilters();
      renderPosts();
    }));
  }
  function renderPosts() {
    const term = search.value.trim().toLowerCase();
    const selectedOwner = organizationFilter.value;
    const selectedGroup = projectGroupFilter.value;
    const selectedRepo = repoFilter.value;
    const matching = posts.filter(post => {
      const searchable = [
        post.title, post.summary, post.category, post.origin, post.spark, post.reflection,
        post.repo, post.organization, post.projectGroup, post.sourceBody, ...(post.tags || [])
      ].join(" ").toLowerCase();
      return (!term || searchable.includes(term)) &&
        (activeTag === "All" || (post.tags || []).includes(activeTag)) &&
        (activeCollection === "All" || post.entryType === activeCollection) &&
        (selectedOwner === "All" || post.organization === selectedOwner) &&
        (selectedGroup === "All" || post.entryType !== "Project" || post.projectGroup === selectedGroup) &&
        (selectedRepo === "All" || post.repo === selectedRepo);
    });
    postList.innerHTML = matching.map(post => {
      const repoLabel = post.entryType === "Open source"
        ? organizationName(post.organization) + " / " + repoName(post.repo)
        : (post.projectGroup ? post.projectGroup + " · " : "") + repoName(post.repo);
      const repo = post.repo
        ? '<div class="post-source"><a href="https://github.com/' + escapeHTML(post.repo) +
          '" target="_blank" rel="noopener noreferrer">' + escapeHTML(repoLabel) + '</a></div>'
        : "";
      const cover = covers[post.id] || { src: "", alt: post.title, logo: "" };
      const visual = '<a class="post-visual" href="./articles/' + escapeHTML(articleSlug(post)) +
        '.html" aria-label="Read ' + escapeHTML(post.title) + '"><img src="' +
        escapeHTML(cover.src) + '" alt="' + escapeHTML(cover.alt || post.title) +
        '" loading="lazy" decoding="async">' + (cover.logo ? '<img class="org-logo" src="' +
        escapeHTML(cover.logo) + '" alt="" aria-hidden="true" loading="lazy" referrerpolicy="no-referrer">' : '') +
        '<span class="visual-kind">' + escapeHTML(cover.kind === "repository image" ? "PROJECT IMAGE" :
        post.entryType === "Open source" ? "OPEN SOURCE" : "PROJECT DIAGRAM") + '</span></a>';
      const statusTags = new Set([post.activityStatus, "Open-source pull request", "Public-fork pull request",
        "Personal or practice PR", "Authored open-source issue", "Open-source issue discussion", "Open source"].filter(Boolean));
      const tags = (post.tags || []).filter(tag => !statusTags.has(tag)).slice(0, 3).map(tag =>
        '<span class="post-tag">' + escapeHTML(tag) + '</span>').join("");
      const updated = post.updated && post.updated !== post.date
        ? '<span>Updated ' + prettyDate(post.updated) + '</span>' : "";
      const typeLabel = post.entryType === "Open source" ? "Open source" :
        post.entryType === "Writing" ? "Writing" : post.category;
      return '<article class="post-card"><time class="post-date"><span class="post-date-value">' +
        prettyDate(post.updated || post.date) + '</span><span class="post-category-label">' +
        escapeHTML(typeLabel) + '</span>' + updated +
        '</time>' + visual + '<div class="post-content"><h3><button type="button" data-open-post="' +
        escapeHTML(post.id) + '">' + escapeHTML(post.title) + '</button></h3><p>' +
        escapeHTML(post.summary) + '</p><div class="post-tags">' + tags +
        '</div>' + repo + '<a class="full-article-link" href="./articles/' +
        escapeHTML(articleSlug(post)) + '.html">Read the full story →</a></div></article>';
    }).join("");
    document.getElementById("post-count").textContent =
      matching.length + (matching.length === 1 ? " story · newest first" : " stories · newest first");
    document.getElementById("empty-state").classList.toggle("visible", matching.length === 0);
    postList.querySelectorAll("[data-open-post]").forEach(button =>
      button.addEventListener("click", () => openPost(button.dataset.openPost)));
  }
  function nonTopicLabels() {
    return new Set(posts.filter(post => post.entryType === "Open source")
      .flatMap(post => [post.activityStatus, "Open-source pull request", "Public-fork pull request",
        "Personal or practice PR", "Authored open-source issue", "Open-source issue discussion", "Open source"])
      .filter(Boolean));
  }
  function renderSidebars() {
    const recent = [...posts].sort((a, b) =>
      String(b.updated || b.date).localeCompare(String(a.updated || a.date))).slice(0, 5);
    document.getElementById("recent-list").innerHTML = recent.map((post, index) => {
      const cover = covers[post.id] || { src: "", alt: post.title };
      return '<div class="recent-item"><span class="recent-number">0' + (index + 1) +
      '</span><a class="recent-thumb" href="./articles/' + escapeHTML(articleSlug(post)) +
      '.html" aria-label="Read ' + escapeHTML(post.title) + '"><img src="' + escapeHTML(cover.src) +
      '" alt="" loading="lazy" decoding="async"></a><div><a href="./articles/' + escapeHTML(articleSlug(post)) + '.html">' +
      escapeHTML(post.title) + '</a><time>Updated ' +
      prettyDate(post.updated || post.date) + '</time></div></div>';
    }).join("");
    const tagCounts = new Map();
    posts.flatMap(post => post.tags || []).filter(tag => !nonTopicLabels().has(tag))
      .forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
    const cloud = [...tagCounts.keys()].sort((a, b) =>
      tagCounts.get(b) - tagCounts.get(a) || a.localeCompare(b)).slice(0, 12);
    document.getElementById("tag-cloud").innerHTML = cloud.map(tag =>
      '<button type="button" data-cloud-tag="' + escapeHTML(tag) + '">' +
      escapeHTML(tag) + '</button>').join("");
    document.querySelectorAll("#tag-cloud [data-cloud-tag]").forEach(button =>
      button.addEventListener("click", () => {
        activeTag = button.dataset.cloudTag;
        renderFilters();
        renderPosts();
        document.getElementById("writing").scrollIntoView({ behavior: "smooth" });
      }));
  }

  const dialog = document.getElementById("post-dialog");
  const detailData = window.BLOG_DETAILS || {};
  function makeSection(parent, heading, paragraphs, className) {
    const section = document.createElement("section");
    section.className = "dialog-section" + (className ? " " + className : "");
    const title = document.createElement("h3");
    title.textContent = heading;
    section.append(title);
    (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).filter(Boolean).forEach(copy => {
      const paragraph = document.createElement("p");
      paragraph.textContent = copy;
      section.append(paragraph);
    });
    parent.append(section);
    return section;
  }
  function addBeforeAfter(parent, details, post, record) {
    let comparison = details.beforeAfter;
    if (!comparison && record) {
      const isPR = ["Pull request", "Fork PR", "Repository PR"].includes(record.kind);
      const before = post.origin + " " + post.spark;
      let after;
      if (isPR && record.status === "Merged") after = "Merged. " + post.summary;
      else if (isPR && record.status && record.status.toLowerCase().includes("not merged"))
        after = "Closed without a recorded merge. This PR's proposed change was not applied upstream by this submission. " + post.summary;
      else if (isPR) after = "Open at the scan date. This is a proposed change, not a recorded merge. " + post.summary;
      else after = "Issue status at the scan date: " + (record.status || "not recorded") +
        ". This post describes participation in the discussion and does not claim an authored fix.";
      comparison = { before: before, after: after };
    }
    if (!comparison) return;
    const section = document.createElement("section");
    section.className = "dialog-section";
    const title = document.createElement("h3");
    title.textContent = "Before and after";
    const grid = document.createElement("div");
    grid.className = "before-after";
    [["Before", comparison.before], ["After", comparison.after]].forEach(item => {
      const card = document.createElement("div");
      const heading = document.createElement("h4");
      heading.textContent = item[0];
      const paragraph = document.createElement("p");
      paragraph.textContent = item[1];
      card.append(heading, paragraph);
      grid.append(card);
    });
    section.append(title, grid);
    parent.append(section);
  }
  function addDiagram(parent, diagram) {
    if (!diagram || !diagram.nodes || !diagram.nodes.length) return;
    const section = document.createElement("section");
    section.className = "dialog-section";
    const title = document.createElement("h3");
    title.textContent = "Architecture and data flow";
    const figure = document.createElement("figure");
    figure.className = "story-figure";
    const flow = document.createElement("div");
    flow.className = "flow-diagram";
    flow.setAttribute("role", "img");
    flow.setAttribute("aria-label", diagram.caption || "System flow");
    diagram.nodes.forEach((node, index) => {
      const step = document.createElement("div");
      step.className = "flow-step";
      step.textContent = node;
      flow.append(step);
      if (index < diagram.nodes.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "flow-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        flow.append(arrow);
      }
    });
    const caption = document.createElement("figcaption");
    caption.textContent = diagram.caption || "";
    figure.append(flow, caption);
    section.append(title, figure);
    parent.append(section);
  }
  function addImage(parent, image) {
    if (!image || !image.src) return;
    const figure = document.createElement("figure");
    figure.className = "story-figure";
    const img = document.createElement("img");
    img.src = safeURL(image.src);
    img.alt = image.alt || "";
    img.loading = "lazy";
    const caption = document.createElement("figcaption");
    caption.textContent = image.caption || "";
    figure.append(img, caption);
    parent.append(figure);
  }
  function addCode(parent, code) {
    if (!code || !code.lines) return;
    const section = document.createElement("section");
    section.className = "dialog-section";
    const title = document.createElement("h3");
    title.textContent = "Code or configuration";
    const pre = document.createElement("pre");
    pre.className = "story-code";
    const element = document.createElement("code");
    element.textContent = code.lines.join("\n");
    pre.append(element);
    section.append(title, pre);
    if (code.caption) {
      const caption = document.createElement("p");
      caption.className = "story-code-caption";
      caption.textContent = code.caption;
      section.append(caption);
    }
    parent.append(section);
  }
  function addRepositoryTimeline(parent, post) {
    if (!post.repo || post.entryType !== "Project") return;
    const history = (window.REPO_HISTORY || {})[post.repo];
    if (!history) return;
    const section = document.createElement("section");
    section.className = "dialog-section repository-timeline";
    const title = document.createElement("h3");
    title.textContent = "Repository timeline and branch heads";
    const meta = document.createElement("p");
    const hasCommitCount = history.defaultCommitCount != null &&
      Number.isFinite(Number(history.defaultCommitCount));
    meta.textContent = "Default branch: " + (history.defaultBranch || "not recorded") +
      (hasCommitCount
        ? " · " + history.defaultCommitCount + " commits in the scanned history"
        : "");
    section.append(title, meta);

    function addCommit(label, value) {
      if (!value) return;
      const match = String(value).match(/^(?:(\d{4}-\d{2}-\d{2})\s+)?([0-9a-f]{7,40})\s+(.+)$/i);
      const row = document.createElement("p");
      const prefix = document.createElement("strong");
      prefix.textContent = label + ": ";
      row.append(prefix);
      if (match) {
        if (match[1]) row.append(document.createTextNode(match[1] + " · "));
        const link = document.createElement("a");
        link.href = "https://github.com/" + post.repo + "/commit/" + match[2];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = match[2];
        row.append(link, document.createTextNode(" " + match[3]));
      } else row.append(document.createTextNode(String(value)));
      section.append(row);
    }
    addCommit("Earliest scanned commit", history.firstCommit);
    addCommit("Latest default-branch commit", history.latestCommit);

    const branches = Array.isArray(history.branches) ? [...history.branches] : [];
    if (branches.length) {
      const disclosure = document.createElement("details");
      disclosure.className = "story-details";
      const summary = document.createElement("summary");
      summary.textContent = "Open " + branches.length + " scanned branch " +
        (branches.length === 1 ? "head" : "heads");
      const list = document.createElement("ul");
      list.className = "branch-head-list";
      branches.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) ||
        String(a.name || "").localeCompare(String(b.name || ""))).forEach(branch => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = "https://github.com/" + post.repo + "/commit/" + encodeURIComponent(branch.tip || "");
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = (branch.name || "unnamed branch") + " · " + (branch.tip || "tip unavailable");
        item.append(link);
        if (branch.date) item.append(document.createTextNode(" · " + branch.date));
        if (branch.subject) item.append(document.createTextNode(" · " + branch.subject));
        list.append(item);
      });
      disclosure.append(summary, list);
      section.append(disclosure);
    }
    const caveat = document.createElement("p");
    caveat.className = "story-code-caption";
    caveat.textContent = "Snapshot note: this archive records the earliest and latest default-branch commits available in the scan and each reachable branch head. Open a commit or the repository link above to inspect the complete commit-by-commit history.";
    section.append(caveat);
    parent.append(section);
  }
  function matchingRecord(post) {
    if (!post.activityKind || !post.repo || !post.issueNumber) return null;
    return activity.find(row => row.kind === post.activityKind && row.repo === post.repo &&
      Number(row.number) === Number(post.issueNumber)) || null;
  }
  function addActivityEvidence(parent, post, record) {
    if (!record) return;
    if (post.sourceBody && String(post.sourceBody).trim()) {
      const section = document.createElement("section");
      section.className = "dialog-section";
      const title = document.createElement("h3");
      title.textContent = "Original public PR or issue description";
      const details = document.createElement("details");
      details.className = "story-details";
      const summary = document.createElement("summary");
      summary.textContent = "Open the submitted description and verification record";
      const body = document.createElement("div");
      body.className = "source-body";
      body.textContent = post.sourceBody;
      details.append(summary, body);
      section.append(title, details);
      parent.append(section);
    }
    const notes = activity.filter(row => row.repo === post.repo &&
      Number(row.number) === Number(post.issueNumber) &&
      ["Comment", "Inline review comment", "Review submission"].includes(row.kind));
    if (!notes.length) return;
    const section = document.createElement("section");
    section.className = "dialog-section";
    const title = document.createElement("h3");
    title.textContent = "My comments and review trail · " + notes.length + " records";
    const details = document.createElement("details");
    details.className = "story-details";
    const summary = document.createElement("summary");
    summary.textContent = "Open exact public comment text and permalinks";
    const list = document.createElement("div");
    list.className = "story-comments";
    notes.sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach(note => {
      const card = document.createElement("article");
      card.className = "story-comment";
      const time = document.createElement("time");
      time.textContent = prettyDate(String(note.date).slice(0, 10)) + " · " + note.kind;
      const body = document.createElement("p");
      body.textContent = note.body && note.body.trim()
        ? note.body
        : "Review submitted without a public text body.";
      const link = document.createElement("a");
      link.href = safeURL(note.url);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open exact GitHub permalink ↗";
      card.append(time, body, link);
      list.append(card);
    });
    details.append(summary, list);
    section.append(title, details);
    parent.append(section);
  }
  function renderSources(post) {
    const sources = document.getElementById("dialog-sources");
    sources.replaceChildren();
    if (!post.links || !post.links.length) return;
    const title = document.createElement("h3");
    title.textContent = "Source trail";
    const list = document.createElement("ul");
    post.links.forEach(source => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = safeURL(source.url);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.label;
      item.append(link);
      list.append(item);
    });
    sources.append(title, list);
  }
  function openPost(id) {
    const post = posts.find(item => item.id === id);
    if (!post) return;
    const record = matchingRecord(post);
    const details = detailData[post.id] || {};
    const dateText = prettyDate(post.updated || post.date) +
      (post.updated && post.updated !== post.date ? " · STARTED " + prettyDate(post.date) : "") +
      " · " + post.category.toUpperCase();
    document.getElementById("dialog-date").textContent = dateText;
    document.getElementById("dialog-title").textContent = post.title;
    document.getElementById("dialog-description").textContent = post.summary;
    document.getElementById("dialog-tags").innerHTML = (post.tags || [])
      .map(tag => '<span class="post-tag">' + escapeHTML(tag) + '</span>').join("");
    const repository = document.getElementById("dialog-repository");
    if (post.repo) {
      const repoURL = "https://github.com/" + post.repo;
      repository.innerHTML = escapeHTML(organizationName(post.organization)) + " / " +
        escapeHTML(repoName(post.repo)) + (post.projectGroup ? " · " + escapeHTML(post.projectGroup) : "") +
        ' · <a href="' + escapeHTML(repoURL) + '" target="_blank" rel="noopener noreferrer">open repository ↗</a>';
    } else repository.textContent = details.projectLabel || "";

    const content = document.getElementById("dialog-content");
    content.replaceChildren();
    const fullStory = document.createElement("p");
    fullStory.className = "full-article-cta";
    fullStory.innerHTML = '<a href="./articles/' + escapeHTML(articleSlug(post)) + '.html">Open the full article →</a>';
    content.append(fullStory);
    if (details.beforeAfter) addBeforeAfter(content, details, post, record);
    makeSection(content, "Why this project or contribution started", post.origin);
    makeSection(content, "The spark", post.spark);
    makeSection(content, "What changed and what I learned", post.reflection);
    (details.sections || []).forEach(section =>
      makeSection(content, section.heading, section.paragraphs));
    addRepositoryTimeline(content, post);
    addDiagram(content, details.diagram);
    if (details.image) addImage(content, details.image);
    (details.images || []).forEach(image => addImage(content, image));
    addCode(content, details.code);
    if (record && !details.beforeAfter) addBeforeAfter(content, details, post, record);
    if (record) addActivityEvidence(content, post, record);
    else if (post.repo && !details.sections) {
      makeSection(content, "Evidence boundary", "This project note is based on the public README, commit history, and branch links. Where those records do not name a test environment, decision, or outcome, the post leaves that detail open instead of filling it in.");
    }
    renderSources(post);
    dialog.classList.add("open");
    document.getElementById("dialog-close").focus();
    document.body.style.overflow = "hidden";
  }
  function closePost() { dialog.classList.remove("open"); document.body.style.overflow = ""; }

  organizationFilter.addEventListener("change", () => { renderFacets(); renderPosts(); });
  projectGroupFilter.addEventListener("change", renderPosts);
  repoFilter.addEventListener("change", renderPosts);
  document.getElementById("dialog-close").addEventListener("click", closePost);
  dialog.addEventListener("click", event => { if (event.target === dialog) closePost(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && dialog.classList.contains("open")) closePost();
  });
  document.querySelectorAll("[data-open-post]").forEach(button =>
    button.addEventListener("click", () => openPost(button.dataset.openPost)));
  search.addEventListener("input", () => {
    renderPosts();
    document.getElementById("clear-search").classList.toggle("visible", search.value.length > 0);
  });
  document.getElementById("clear-search").addEventListener("click", () => {
    search.value = "";
    search.dispatchEvent(new Event("input"));
    search.focus();
  });

  const themeToggle = document.getElementById("theme-toggle");
  let savedTheme = "";
  try { savedTheme = localStorage.getItem("fieldnotes-theme") || ""; } catch (error) {}
  if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";
  function updateThemeButton() {
    themeToggle.setAttribute("aria-label",
      document.documentElement.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  updateThemeButton();
  themeToggle.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    if (dark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("fieldnotes-theme", dark ? "dark" : "light"); } catch (error) {}
    updateThemeButton();
  });
  const menuToggle = document.getElementById("menu-toggle");
  menuToggle.addEventListener("click", () => {
    const opened = document.getElementById("site-nav").classList.toggle("mobile-open");
    menuToggle.setAttribute("aria-expanded", String(opened));
    menuToggle.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
  });
  document.querySelectorAll("#site-nav a").forEach(link => link.addEventListener("click", () => {
    document.getElementById("site-nav").classList.remove("mobile-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
  renderFacets();
  renderCollectionTabs();
  renderFilters();
  renderPosts();
  renderSidebars();
})();
