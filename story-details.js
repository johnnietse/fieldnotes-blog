window.BLOG_DETAILS = {
  "fyic-website-history": {
    projectLabel: "FYIC 2025 · webmaster",
    beforeAfter: { before: "A Create Next App / Creative Tim event template, with content and runtime still changing as the conference site took shape.", after: "A conference-facing site with responsive event information and a documented migration from next-on-pages to OpenNext and Wrangler. The repository says its source template assets have limited-use rights." },
    diagram: { caption: "Reader-facing path described in the README and deployment history.", nodes: ["Attendee questions", "Next.js event pages", "Responsive navigation and media", "Build and deployment configuration"] },
    sections: [
      { heading: "A project that began before its event", paragraphs: [
        "The history begins on October 10, 2023 with a Create Next App template. Event-site work resumes in May 2025 and continues through September. The dates tell a more useful story than pretending the site appeared fully formed: an early foundation sat in the repository, then an event deadline made its content and design concrete.",
        "The README names my role as Webmaster for FYIC 2025. The conference brought first-year engineering students from more than 15 Ontario universities together for networking, workshops, and career-development programming. That identifies who the site had to help and why its information architecture mattered."
      ]},
      { heading: "The difficult part was the path through the page", paragraphs: [
        "The hero component is the most frequently changed file in the commit history. June commits explicitly mention video loading, mobile autoplay, playback-loop transitions, play-button position, and a shooting-star animation. That is evidence of repeated browser-facing troubleshooting, though the short commit titles do not establish every root cause.",
        "The useful before-and-after is the sequence: a starter template became an event page with content, navigation, and media that had to behave across screen sizes. The public history shows repeated attention to the most visible interaction, not a final device-by-device test report."
      ]},
      { heading: "Deployment changed with the project", paragraphs: [
        "September 18, 2025 commits migrate from next-on-pages to OpenNext, remove the email API, and correct Wrangler configuration. The public README still links the Vercel demo, so I keep the configuration migration distinct from an assumption about the final live host.",
        "The repository does not provide a reproducible browser/device matrix or final accessibility report. A stronger post should add those measurements instead of inferring them from responsive CSS."
      ]}
    ]
  },
  "autodrive-workspace": {
    projectLabel: "AutoDrive II · repository map",
    beforeAfter: { before: "Subsystem repositories and pinned commits were spread across a large autonomous-driving workspace, making discovery and setup a coordination problem.", after: "A parent Git repository points to submodule revisions and adds setup scripts plus an architecture inventory. It is a workspace map; cloning it does not prove every package builds together." },
    diagram: { caption: "Simplified stages from the repository's architecture document; this is a map, not a fresh end-to-end validation.", nodes: ["Sensors", "Perception and fusion", "Localization and planning", "Control and CAN", "Vehicle or simulator"] },
    sections: [
      { heading: "Why make a parent repository?", paragraphs: [
        "The July 4 commit calls this a monolithic repository with 188 repositories as submodules. A July 16 follow-up adds a workspace scan and architecture documentation. This responds to a team problem: perception, planning, localization, vehicle interfaces, calibration, simulation, and deployment live in separate repositories, so even discovering which revisions belong together takes work.",
        "A submodule workspace can make exact child revisions traceable. It still needs reliable clone/update instructions and a clear definition of which children are required."
      ]},
      { heading: "A discrepancy worth keeping visible", paragraphs: [
        "The setup commit says 188 repositories; the architecture analysis labels its scope as 23 repositories. I have not reconciled those counts. They may describe different subsets, but the repository does not state that clearly enough to treat either as a complete inventory.",
        "This is architecture writing as engineering work. A diagram can be impressive and still mislead if the scope statement and repository index disagree. A generated inventory and explicit active-stack definition would be the next useful improvement."
      ]},
      { heading: "What the parent history proves", paragraphs: [
        "There are three top-level commits on main: workspace setup, architecture documentation, and formatting/submodule updates. Most implementation history remains in child repositories. This story explains the map and its limits rather than attributing child-repository code to the parent."
      ]}
    ]
  },
  "autonomous-mode-fsm": {
    projectLabel: "AutoDrive II · CAN and control integration",
    beforeAfter: { before: "The final source connects DBC parsing and a message manager to an autonomous-mode controller, but application-level startup booleans are interpreted inconsistently.", after: "The repository has a clearer C++20/CMake component structure, CI configuration, state-machine interfaces, and many integration fixes. The hardware startup path still needs targeted verification." },
    diagram: { caption: "Signal and control flow described by the CAN interface source and controller headers.", nodes: ["DBC files and XML schemas", "CAN message manager", "Autonomous-mode FSM and safety checks", "Cyclic CAN commands", "Vehicle interface and watchdog"] },
    sections: [
      { heading: "The system boundary", paragraphs: [
        "The top-level CMake project uses C++20 and separates the CAN messenger, FSM library, watchdog, high-level autonomous-mode controller, and ROS 2 CAN interface package. The interface loads DBC files for high-speed, chassis-expansion, low-speed, and scoring buses, then enters a 50 Hz control loop.",
        "The controller header makes the safety model legible: manual, transition-to-autonomous, autonomous, transition-to-manual, emergency-stop, and fault handling are separate paths. Timing thresholds, speed limits, callbacks, and fault codes are configurable."
      ]},
      { heading: "The commit trail is a debugging diary", paragraphs: [
        "Across 48 commits on main, the sequence moves from nested-repository repairs and dependency discovery into CAN identifiers, DBC paths, FSM wiring, tests, formatting, and cluster-readiness cleanup. Commit titles also record a source-restoration episode after a newline-corruption change.",
        "CI declares Ubuntu with GCC 14, CMake/Ninja, GoogleTest/Mock, cppcheck, and clang-format. Some static-analysis and formatting jobs are continue-on-error, so their presence is not proof that every check passed."
      ]},
      { heading: "An audit finding still needs an owner", paragraphs: [
        "The connectToIcsDevice implementation returns false when it finds no device or cannot open one, and true after a device opens. In main.cpp, true enters the branch that prints “Failed to connect.” The startup-state code also ORs parser and connection return values into a variable named startupFailureFlag.",
        "This looks like a success/failure inversion in the final source. It is a code-reading finding, not a reported issue or a fix in the repository history. Before any vehicle-facing run, the polarity needs review, tests for both outcomes, and a simulation or hardware check. I have not changed the source repository as part of this blog task."
      ]}
    ],
    code: { language: "cpp", caption: "The first block is from main.cpp; the second is a suggested correction if true means the device opened. The correction is uncommitted and unverified.", lines: [
      "// Current caller",
      "if (mm->connectToIcsDevice()) {",
      "    std::cerr << \"Failed to connect to ValueCAN device!\\n\";",
      "}",
      "",
      "// Proposed polarity",
      "if (!mm->connectToIcsDevice()) {",
      "    std::cerr << \"Failed to connect to ValueCAN device!\\n\";",
      "}"
    ]}
  },
  "debian-gsoc-clones": {
    projectLabel: "Debian · GSoC 2026 proposal prototype",
    beforeAfter: { before: "A security patch identifies vulnerable lines in one package, while copied versions may remain in other package sources.", after: "A prototype turns a patch into candidate code-clone search results and a report. Its committed sample uses a mock CVE and mock results; it is not a finding about a real Debian package." },
    diagram: { caption: "Prototype pipeline described in out_report.md.", nodes: ["Patch removed lines", "Whitespace-tolerant regex", "Debian Code Search API", "Noise filter and package grouping", "Candidate report for human review"] },
    sections: [
      { heading: "The question behind the proposal", paragraphs: [
        "The idea was to turn a security fix into a search query. If a patch removes a dangerous pattern, a Debian-wide code search might reveal packages that copied it and have not received the fix. That could give maintainers leads beyond the package where the vulnerability was first reported.",
        "The repository has three commits. The initial commit contains the search and report scripts, patch, and mock output; two proposal-document formats are deleted in the April 1 commits. The surviving prototype is inspectable, but the public history does not establish a submitted or accepted GSoC project."
      ]},
      { heading: "A match is a lead, not a verdict", paragraphs: [
        "The search script handles multiple API response shapes, retries selected HTTP errors with backoff, filters likely noise such as tests and documentation, and groups hits by package. The report generator recommends human verification before a fix is ported.",
        "The example is labeled CVE-2023-MOCK and lists sample package names. That is a deliberate scope boundary: the output demonstrates a workflow, not a verified Debian vulnerability. A real evaluation would need precision/recall checks, package-version mapping, deduplication, and a false-positive process."
      ]},
      { heading: "What the prototype taught me", paragraphs: [
        "Robust transport and report generation do not make a text match semantically correct. A regex can locate similar code; a maintainer still has to decide whether it is copied, reachable, vulnerable, and fixed in the relevant version.",
        "The public repository does not record a live API run or proposal-review feedback. I leave those as evidence gaps instead of inventing them."
      ]}
    ],
    code: { language: "python", caption: "Response-shape handling from search_clones.py: JSON arrays, wrapped JSON objects, then newline-delimited JSON.", lines: [
      "try:",
      "    parsed = json.loads(body)",
      "    if isinstance(parsed, list):",
      "        return parsed",
      "    if isinstance(parsed, dict):",
      "        return parsed.get('results', [parsed])",
      "except json.JSONDecodeError:",
      "    pass",
      "out = []",
      "for line in body.strip().split('\\n'):",
      "    try:",
      "        out.append(json.loads(line))",
      "    except:",
      "        pass",
      "return out"
    ]}
  },
  "minimd-frontenac-backup": {
    projectLabel: "CAC Frontenac · independent research backup",
    beforeAfter: { before: "The January–March study artifacts lived on a cluster account, while upstream .gitignore rules omitted some build outputs and run results needed to interpret the experiment.", after: "A November 5 snapshot records upstream commit IDs, patches, modified-file lists, results, and a checksum-verified copy. A second commit adds 31 ignored files. A dead node-local symlink and Windows filename conversion remain documented exceptions." },
    diagram: { caption: "Study evidence and preservation path from the backup README.", nodes: ["Frontenac Slurm job", "miniMD/miniFE and input", "Communication monitor", "CSV and JSON traces", "Archive with upstream patches"] },
    sections: [
      { heading: "Why make a separate archive?", paragraphs: [
        "The README calls this a backup of a study run on Queen's CAC Frontenac between January and March 2026. It was copied from the cluster home directory on November 5 and checksum-verified with zero differing files. The README explicitly separates it from the public llm-d energy-routing project.",
        "The archive keeps modified miniMD and miniFE sources, build outputs, run input, monitor traces, comparison JSON, upstream commit IDs, patches, and Git status files. A plot alone cannot explain which source, executable, input, and rank count produced a measurement."
      ]},
      { heading: "The ignored files were part of the evidence", paragraphs: [
        "The first backup commit copied the study. A follow-up force-added 31 files that upstream .gitignore rules would otherwise omit. Generated files are often noise, but here they can be necessary to interpret the measurement.",
        "The README identifies CAC Frontenac, a 32-rank miniMD run, executable miniMD_openmpi, input in.lj.miniMD, and January 21 result traces. It does not provide a complete compiler/module manifest for that run, so I do not invent one."
      ]},
      { heading: "A good archive documents its exceptions", paragraphs: [
        "One miniMD/ref/chk symlink pointed to node-local Slurm scratch that no longer existed. Result filenames with colons were copied through WSL using U+F03A because Windows cannot represent colons; the README explains how to restore the names. The content is described as unchanged, but the filenames need conversion.",
        "That turns a backup into a reconstruction recipe while leaving its limits visible: original artifacts remain on CAC, the old scratch target is gone, and filename restoration is a separate step."
      ]}
    ],
    code: { language: "text", caption: "Minimum run identity retained by the README.", lines: ["system = CAC Frontenac", "ranks = 32", "executable = ./miniMD_openmpi", "input = in.lj.miniMD", "study window = January–March 2026"]}
  },

  "epp-energy-routing": {
    projectLabel: "Independent systems research · llm-d EPP",
    milestoneCommits: ["59438ef", "fa36de0", "03b85f1", "c666507", "e9425af", "d133bfc", "8749b62", "1b8f996", "410462d"],
    codeExcerpt: { path: "router-plugin/pkg/energypolicy/policy.go", startLine: 81, lineCount: 27 },
    beforeAfter: { before: "The early design treated an online marginal-power model and weighted energy/latency signals as likely routing mechanisms. Some pilot comparisons used mismatched load constraints and were not confirmatory.", after: "Measurements rejected a universal positive marginal-power assumption. The October plan narrowed the question to energy-aware replica selection under a matched SLO and pre-registered trials. Stage 5 was still running on November 8." },
    diagram: { caption: "Current experiment: keep routing within the SLO, compare policies in the same trial, and record GPU energy.", nodes: ["Trace replay client", "Envoy", "llm-d endpoint picker", "vLLM replicas", "NVML samples and trial records"] },
    images: [
      { src: "https://raw.githubusercontent.com/johnnietse/llm-d-epp-Energy-Aware-Endpoint-Picker-Plugin-/docs/technical-plan-v2/docs/figures/measured/stage1_energy_per_token.png", alt: "Measured stage one energy per token from the EPP research branch", caption: "Measured stage-one energy-per-token figure from the technical-plan branch." },
      { src: "https://raw.githubusercontent.com/johnnietse/llm-d-epp-Energy-Aware-Endpoint-Picker-Plugin-/docs/technical-plan-v2/docs/figures/measured/stage2_energy_by_gpu_type.png", alt: "Measured stage two energy by GPU type from the EPP research branch", caption: "The measured curves differ by GPU type; this evidence narrowed the model." }
    ],
    sections: [
      { heading: "The research question changed when data disagreed", paragraphs: [
        "The September technical plan asked whether an endpoint scorer could estimate marginal GPU energy per request and choose the cheapest endpoint while meeting a latency target. It defined hypotheses, baselines, scope tiers, and a go/no-go gate, then proposed an out-of-tree Go module using llm-d's plugin API and Frontenac under Slurm.",
        "Measurement showed that a linear marginal-power assumption behaved differently across architectures. On the RTX 6000, active power was nearly flat and the fitted request slope was negative; on the A30, a simple request-count model fit better with a positive slope. A single positive marginal-energy term could not be assumed across GPUs."
      ]},
      { heading: "A pilot can be useful and still be the wrong comparison", paragraphs: [
        "The October checkpoint records why early numbers were kept as pilots. One routing policy ran inside the load generator rather than llm-d. A mixed-fleet comparison was capped by a curve edge rather than the declared SLO, and the single-type control aimed at the SLO with no headroom. The early 1.4% difference was a result in a flawed regime, not evidence that fleet composition decided the outcome.",
        "The correction preserved every dataset but labeled its defect, froze a revised protocol before new data, matched the fleet curves, added explicit latency headroom, and switched to an open-loop trace schedule. Keeping superseded data and its reason makes the changed interpretation auditable."
      ]},
      { heading: "The system and its measurement boundary", paragraphs: [
        "The research branch describes an out-of-tree Go endpoint picker connected to llm-d-router, Envoy, and vLLM replicas on Frontenac. The November manifest records llm-d-router v0.11.0, vLLM v0.30.0, Envoy, Qwen2.5 models, and NVML telemetry. Slurm and Apptainer provide the experiment environment. GPU energy is primary; NIC energy and cluster-wide carbon are out of scope.",
        "The revised question is narrower: can an unprivileged tenant select among replicas of the same model to reduce energy per SLO-satisfied request relative to SLO-aware packing? The finalized plan proposes an activation-aware selection rule. That direction is a research plan, not a merged llm-d feature."
      ]},
      { heading: "Reproducibility became part of the implementation", paragraphs: [
        "The branch keeps preregistration, software manifests, material hashes, raw samples, per-cell records, Slurm logs, and deviation notes beside the analysis. Every run has to identify its node type, software versions, workload, randomized policy order, and warm-up handling.",
        "A November troubleshooting trail reproduced a silent EPP exit as an ephemeral-port bind collision and changed the job script only after a dry run. Later one-type trials showed a first-level stall. A 10.6-second stall stopped trial 616 during pre-training, before a measured cell, and the seed was resubmitted. The draft fix was not adopted immediately: logs instead linked the stall to longer vLLM compilation against a shared GPFS cache, and the November 8 decision was to keep running under the registered rule while monitoring later jobs."
      ]},
      { heading: "What is still unknown", paragraphs: [
        "The main Stage 5 comparison was incomplete at the latest branch commit on November 8. Trials 617–620 passed their registered cells, while 616 failed before measurement and was resubmitted. The branch had not frozen final analysis or result figures, so this post reports research decisions and calibration evidence, not a final policy win.",
        "The result that matters next is the frozen matched-SLO comparison with confidence intervals and the predeclared sensitivity check for trials with elevated first-level stalls. Until then, the honest conclusion is that the research question and protocol improved—not that routing saved energy."
      ]}
    ],
    code: { language: "text", caption: "Pseudocode for the narrowed direction in FINAL-PLAN-2026-10.md, not a merged implementation.", lines: [
      "eligible = endpoints_that_pass_the_SLO_filter(request)",
      "cost(endpoint) = active_gpu_seconds + activation_penalty[gpu_type]",
      "chosen = eligible endpoint with lowest cost",
      "record(policy, latency, SLO outcome, NVML energy)"
    ]}
  },
  "elec498-capstone": {
    projectLabel: "ELEC 490/498 capstone · Group 30",
    diagram: { caption: "Measurement-to-control loop summarized from the capstone repository.", nodes: ["miniMD communication phase", "Instrumentation and monitor", "Shared-memory IPC", "DVFS controller", "Analysis and dashboard"] },
    sections: [
      { heading: "Where this project belongs", paragraphs: [
        "This is an ELEC 490/498 capstone with Group 30. My documented ownership is the communication-phase path: instrumentation, shared-memory IPC, controller code, analysis, and dashboard pieces. It is a team system; this post keeps the boundary between assigned components and teammate-owned work.",
        "The separate miniMD/miniFE archive is a Frontenac study backup. Its README says it is a separate project, so it is context rather than the capstone's source tree."
      ]},
      { heading: "The question that makes it interesting", paragraphs: [
        "A benchmark does not use the CPU uniformly. Communication, synchronization, and I/O can leave a processor waiting while a fixed frequency policy continues to spend power. The project asks whether a controller can identify those phases and adjust frequency without damaging the work that follows.",
        "That makes interfaces central: instrumentation describes a phase, IPC carries the signal, the controller makes a decision, and analysis checks the result. The public commit history records integration and reporting cleanup; it does not justify a final energy-saving claim by itself."
      ]},
      { heading: "Evidence needed for a stronger result", paragraphs: [
        "A useful before-and-after comparison should report energy, runtime, phase-detection delay, and the exact machine and workload. A mechanism can be interesting even when its measured benefit remains unproven."
      ]}
    ]
  },

  "activity-pull-request-kubernetes-sigs-lws-1233": {
    projectLabel: "Kubernetes SIGs · LeaderWorkerSet",
    beforeAfter: { before: "Available represented rollout completion. It could become False during rollout even while the set met its maxUnavailable allowance, leaving clients to reimplement availability rules.", after: "The merged change publishes per-role minimum and available replicas plus a MinimumReplicasAvailable condition, accounting for revisions, slices, sub-roles, unknown targets, and maxUnavailable." },
    diagram: { caption: "Status uses a desired floor and only replicas that can serve in a valid workload revision.", nodes: ["Desired count and maxUnavailable", "Per-role floor", "Ready groups and peer roles", "Minimum availability condition"] },
    sections: [
      { heading: "Start from the API question", paragraphs: [
        "Issue #1191 asked for an availability signal that health checks, alerts, and parent controllers could consume without copying LeaderWorkerSet's rollout rules. The decision was to preserve Available and Progressing as completion signals and add a separate serving-floor condition.",
        "A role's floor is its desired count less the resolved maxUnavailable budget, bounded at zero. Ready groups count only when the relevant revision has all of the roles it requires, so one healthy role cannot mask a missing peer."
      ]},
      { heading: "Review changed the edge cases", paragraphs: [
        "The inline review trail records substantive changes. False now takes priority over Unknown when a known role is below its floor. A current role with a positive target but no workload reports zero availability. Older workloads are interpreted from their recorded layout, including removed roles and older sub-role shapes.",
        "Review also exposed status-message size as an API concern. The implementation caps role names in condition messages at ten plus an “and N more” count, including the existing unresolved-scaler message. The PR reports full controller-package tests passing on Linux, but says the updated end-to-end sub-role assertion was not run locally."
      ]},
      { heading: "What changed", paragraphs: [
        "The PR adds minAvailableReplicas to parent and sub-role status, availableReplicas for serving groups, and a condition that compares actual availability with each floor. It does not redefine rollout planning or allow a healthy role to cover for an unavailable peer."
      ]}
    ],
    code: { language: "go", caption: "Documented rule in compact form; the PR resolves the budget per slice and totals the result.", lines: [
      "floor = max(0, desiredReplicas - maxUnavailable)",
      "False   when known availableReplicas < floor",
      "Unknown when a required target cannot be resolved",
      "True    otherwise"
    ]}
  },
  "activity-pull-request-kubernetes-sigs-lws-1242": {
    projectLabel: "Kubernetes SIGs · LeaderWorkerSet",
    beforeAfter: { before: "An External role's ignored spec.replicas could leave too little room for a generated group index. After a scaler grew past ten groups, a generated Pod label could exceed Kubernetes' 63-character limit.", after: "New External roles reserve eight digits by default. Existing External roles keep their accepted update budget and get a warning when their name cannot reach the new limit. The PR was merged." },
    diagram: { caption: "Admission reserves name space before an autoscaler creates an invalid generated label.", nodes: ["External role template", "Admission name budget", "Generated group index", "StatefulSet and Pod labels"] },
    sections: [
      { heading: "A small index exposed a boundary bug", paragraphs: [
        "The problem is a name budget, not that ten is a special number. The generated role/group name feeds a Pod label with a hard 63-character limit. An External role's spec.replicas is ignored by the scaler, so validation that reserves one digit can accept a name that later cannot be instantiated.",
        "The change reserves eight index digits for new External roles, including transitions into External mode and External sub-roles. Static and hash-identity roles retain their existing rules."
      ]},
      { heading: "Why review reduced the configuration surface", paragraphs: [
        "An early version added a manager setting for the reserved digit count. Review raised the cost of turning a one-off compatibility rule into a new configuration API. The final change removes that option and reuses the existing hash-prefix constant.",
        "Review also preserved updates for already accepted objects. Existing External names keep their old budget, with an admission warning describing how many groups they can support. This avoids making stored objects impossible to edit because a new default is stricter."
      ]},
      { heading: "Tradeoff and verification boundary", paragraphs: [
        "The PR states the cost: with the default group identity, the set name and new External role name can be at most 31 characters combined. There is no opt-out. The PR reports webhook unit and integration tests passing on Linux, but says the warning was tested directly through validation, not through a real API server."
      ]}
    ],
    code: { language: "go", caption: "Invariant simplified from the PR description, not a verbatim implementation excerpt.", lines: [
      "new External role: reserve 8 digits for generated group identity",
      "existing External role: keep accepted budget; warn if undersized",
      "reject a name that could create a label longer than 63 characters"
    ]}
  },
  "activity-pull-request-solana-foundation-solana-developer-platform-2670": {
    projectLabel: "Solana Foundation · Developer Platform",
    beforeAfter: { before: "With core.autocrlf=true, shell and Docker files gained CRLF. The entrypoint shebang then included a carriage return; Docker could not find /app/entrypoint.sh. Copied .env files also risked being tracked.", after: "The PR pins relevant shell, Dockerfile, and YAML files to LF and ignores copied .env variants while keeping .env.example. On a fresh checkout, entrypoint CR bytes went from 6 to 0 and Dockerfile CR bytes from 194 to 0." },
    sections: [
      { heading: "This started as a runtime failure", paragraphs: [
        "The PR body traces the issue to Windows line-ending conversion. During the fellowship, sdp-web and sdp-docs restart-looped with exit 255 because the container could not execute the shell entrypoint.",
        "The patch stays narrow: it pins only shell scripts, Dockerfiles, and YAML to LF, without a global text=auto rule. It ignores common file-manager copies of .env but leaves the example file tracked."
      ]},
      { heading: "The before-and-after was measurable", paragraphs: [
        "The author measured entrypoint.sh changing from six carriage-return bytes to zero, and the Dockerfile from 194 to zero; ten candidate names were checked with git check-ignore. The PR says an image rebuild was not run. That means file-format behavior was verified, but a rebuilt container was not.",
        "The lesson is to put a runtime file-format requirement in the repository rather than rely on each developer's Git settings."
      ]}
    ],
    code: { language: "gitattributes", caption: "Representative file-scoped rules described in the PR; exact committed patterns are linked in the diff.", lines: ["*.sh text eol=lf", "*.bash text eol=lf", "Dockerfile text eol=lf", "*.yml text eol=lf", "*.yaml text eol=lf"]}
  },
  "activity-pull-request-solana-foundation-solana-developer-platform-2669": {
    projectLabel: "MLH Fellowship · Solana Developer Platform",
    diagram: { caption: "Service path described in PR #2669: a cache-first metrics API with explicit RPC fallback.", nodes: ["Analytics request", "Python and Polars API", "Delta tables on S3", "Solana RPC fallback"] },
    sections: [
      { heading: "Build the service boundary first", paragraphs: [
        "The PR adds a standalone Python service for SPL mint activity, with count, time-series, insert, and health routes. Writes and overrides are gated; there is no default S3 bucket or hidden tie to a contributor's AWS account.",
        "The design makes cache state visible. A missing token or bucket makes insert return 503 rather than silently connecting to someone's cloud account. RPC override is off by default."
      ]},
      { heading: "What the tests establish", paragraphs: [
        "The PR records 75 pytest cases against local Delta tables and fake RPC, then a rebuilt image checked against devnet. Real S3 and the pnpm integration suite were not run. The repository's CI did not automatically run the new Python tests.",
        "The service was co-authored with Arianna, with Waddah guiding the data work. The upstream PR closed without a recorded merge, so the tests describe a proposal and local verification, not a shipped platform endpoint."
      ]}
    ]
  },
  "activity-pull-request-solana-foundation-solana-developer-platform-2671": {
    projectLabel: "MLH Fellowship · Solana Developer Platform",
    diagram: { caption: "Transfer history reads a coverage-aware cache, then enriches unresolved rows from RPC.", nodes: ["GET /rpc/transfers", "Coverage-aware Delta cache", "Bounded exact-decimal enrichment", "RPC fallback and response"] },
    sections: [
      { heading: "A transaction needs more than a signature", paragraphs: [
        "PR #2671 adds recent transfer history with resolved amounts, counterparties, and a kind: transfer, mint, burn, or no_movement. An unresolved amount is not the same as zero movement, so the API must preserve uncertainty instead of inventing a result.",
        "The cache returns a full page or a page whose coverage check reached the requested boundary or end of history. A bounded enrichment budget resolves open rows on later requests, and resolved records are appended rather than overwriting the unresolved history."
      ]},
      { heading: "Testing a progressively enriched cache", paragraphs: [
        "The author reports 121 pytest cases on local Delta tables with fake RPC, 24 deliberate breaks caught, and a rebuilt container returning real devnet transfers. Real S3 and pnpm test:integration were not run. An unauthenticated refresh parameter is called out for rate limiting before public exposure.",
        "The PR was stacked on #2669 and #2670 with an explicit review order. It closed without a recorded merge. The tests remain evidence about the proposal, not a shipped feature."
      ]}
    ],
    code: { language: "text", caption: "The API contract keeps unresolved amounts distinct from zero-valued transfers.", lines: ["kind ∈ {transfer, mint, burn, no_movement}", "amount = exact decimal string when resolved", "unresolved row → enrich later within ENRICH_BUDGET", "cache write failure → return data and log the cause"]}
  },

  "activity-pull-request-kubernetes-sigs-lws-763": {
    projectLabel: "Kubernetes SIGs · LeaderWorkerSet",
    beforeAfter: { before: "A pending-pod skip branch passed an odd number of key/value arguments to logr, causing a DPANIC.", after: "The merged fix formats the pod name into the message and keeps structured key/value arguments paired." },
    diagram: { caption: "The uncommon skip branch failed even though ordinary reconcile worked.", nodes: ["Pending pod", "Skip decision", "Structured log call", "Valid message and key/value pairs"] },
    sections: [{ heading: "Why the ordinary path hid the failure", paragraphs: [
      "Issue #762 described a panic when the controller skipped recreation because a pending pod already existed. The odd argument count was on that branch; the healthy normal path could hide it.",
      "The fix formats the pod name into the message and keeps the remaining key/value pairs valid. It is a focused debugging lesson: follow the arguments at the exact call site and check the logging API contract."
    ]}]
  },
  "activity-issue-docker-for-win-15064": {
    projectLabel: "Docker Desktop · issue investigation",
    beforeAfter: { before: "After an ungraceful shutdown, the Secrets Engine could fail because a stale AF_UNIX reparse point could not be accessed or renamed; Windows reported ERROR_CANT_ACCESS_FILE (1920).", after: "The open issue captured Windows 10 build 19045, Docker Desktop 4.88.1–4.90.0, WSL2, failed cleanup attempts, and a parent-directory rename workaround. The bindflt theory remains unproven." },
    sections: [
      { heading: "The clue came from a failed cleanup", paragraphs: [
        "Rebooting and checking disk space, permissions, and antivirus did not remove the failure. Deleting or renaming the socket failed with error 1920, but renaming its parent directory worked.",
        "That narrows the reproduction to an inaccessible reparse point without pretending the root cause is known."
      ]},
      { heading: "A hypothesis stays a hypothesis", paragraphs: [
        "The report mentions Windows bindflt as a possible connection, but does not prove it caused the stale point. The result is a better bug report and a workaround, not a product fix."
      ]}
    ]
  },

  "activity-issue-discussion-llm-d-llm-d-router-4045": {
    projectLabel: "llm-d · endpoint picker debugging",
    beforeAfter: { before: "File-discovery mode could exit with status 1 after a bind failure without logging the underlying error.", after: "Issue #4045 contains an ephemeral-port-collision reproduction and environment record. It closed November 6; the issue is not an authored fix." },
    sections: [{ heading: "Make a rare bind failure repeatable", paragraphs: [
      "The reproduction holds the configured local port with a client socket, then starts the router in file-discovery mode. It checks v0.11.0, v1.0.0, and main and records Linux x86_64, WSL2, and Slurm GPU nodes.",
      "The symptom was unhelpful: exit status 1 without the bind error. Recording versions and source path turns a silent exit into a bounded debugging task."
    ]}],
    code: { language: "text", caption: "Minimal reproduction shape recorded in the issue.", lines: ["1. Bind a client socket to the router's configured port.", "2. Start llm-d-router in file-discovery mode.", "3. Observe exit status 1 and check whether the bind error is logged."]}
  },

  "asl-detector": {
    image: { src: "https://github.com/user-attachments/assets/aa78d89c-5c55-4e98-b7e0-f5707fc9e7bf", alt: "Example ASL hand-sign image from the project README", caption: "An example in the README; the post describes the data and inference path, not a measured recognition accuracy." },
    diagram: { caption: "The app separates collection, training, and live webcam inference.", nodes: ["Hand images", "Landmarks and labels", "Keras/TensorFlow classifier", "Webcam prediction"] }
  },
  "travel-expense": {
    image: { src: "https://github.com/user-attachments/assets/dd403aed-4882-486d-8da2-f95cf32678c7", alt: "Travel expense tracker screen from the project README", caption: "A README screenshot; transactions still moved manually into Excel for formal statements." },
    diagram: { caption: "The team's lightweight recordkeeping workflow.", nodes: ["Team expense or income", "Android form", "SQLite store and charts", "Manual Excel statement"] }
  },
  "conference-database": {
    image: { src: "https://github.com/user-attachments/assets/cf1a1832-8c8d-4175-97d5-4990d06b2979", alt: "Conference database interface from the coursework README", caption: "A project image from the coursework repository." },
    diagram: { caption: "A course application ties a conference workflow to relational records.", nodes: ["Conference users", "PHP web interface", "MySQL records", "Schedule and registration workflow"] }
  },

  "bounding-box-visualizer": {
    image: { src: "https://github.com/user-attachments/assets/6198fabd-ccfc-418a-819d-38838c7edb94", alt: "Bounding-box visualizer screenshot from the README", caption: "One of the visualizer screenshots in the repository README." },
    diagram: { caption: "A visual inspection loop for dataset annotations.", nodes: ["Image and YOLO labels", "Coordinate parser", "Bounding-box overlay", "Human dataset check"] }
  },
  "rps-duel": {
    image: { src: "https://github.com/user-attachments/assets/58dbae4d-3c97-42ed-a1c8-7377f4d4a193", alt: "Arduino rock-paper-scissors screenshot from the README", caption: "A project image from the team-competition README." },
    diagram: { caption: "Two embedded players turn button presses into a visible result.", nodes: ["Player buttons", "Arduino game logic", "Outcome decision", "LED feedback"] }
  },
  "video-try-on": {
    image: { src: "https://github.com/user-attachments/assets/63af3ca5-816d-4e2f-b086-915155f5db1f", alt: "Virtual try-on prototype screenshot from the README", caption: "A screenshot from the prototype documentation; it does not claim validated fit accuracy." },
    diagram: { caption: "Documented prototype inputs and output.", nodes: ["Person video", "Clothing image", "Image-processing pipeline", "Try-on preview"] }
  },

  "fundamental-cell": { diagram: { caption: "A spreadsheet is a dependency graph with a user-facing grid.", nodes: ["Cell input or formula", "Dependency graph", "Recalculated values", "Terminal spreadsheet view"] } },
  "strawberry-farm": { diagram: { caption: "The greenhouse prototype links sensing and LED control to phenotyping.", nodes: ["Greenhouse environment", "Sensor and PCB layer", "Controller and LEDs", "Phenotyping record"] } },
  "local-pdf-chatbot": { diagram: { caption: "The repository separates the browser, document worker, and local model runtime.", nodes: ["PDF upload", "Document worker", "Local model", "Answer in browser"] } }
};

