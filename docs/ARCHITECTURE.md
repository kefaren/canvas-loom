# Architecture

Native `.canvas` remains the document. Obsidian owns the canvas, cards, edge rendering, camera, selection, and normal editing. Loom adds an editor extension, a native-model adapter, and an optional local generation client.

| Module | Responsibility |
| --- | --- |
| `src/graph.ts` | Parse stable Markdown node references; plan mention-owned edges; traverse directed context; detect cycles; compile requests; resolve Markdown subpaths. Pure and testable independently of Obsidian. |
| `src/native.ts` | Isolate internal Canvas APIs, identify cards across editor iframes, read snapshots, add/remove native edges, append response cards, and save through Obsidian. |
| `src/editor.ts` | CodeMirror 6 picker, keyboard interaction, inline chips, and iframe-aware overlay placement. |
| `src/codex.ts` | Detect an executable, launch an app-server subprocess, initialize JSONL RPC, check ChatGPT authentication, request a read-only session, handle streaming/cancellation/timeouts, close the subprocess. |
| `src/runtime.ts` | Pinned official package selection, streaming download, SHA-256 verification, bounded archive extraction, executable verification, atomic activation, and local managed state. |
| `src/setup.ts` | Setup state machine, shared-login reuse, managed-profile fallback, browser authentication, readiness checks, cancellation, retry, and progress subscriptions. |
| `src/main.ts` | Plugin lifecycle, commands, card controls, settings, context preview, file-content cache, and generation orchestration. |

## Why native Canvas

A new extension would require taking responsibility for opening, rendering, and editing a second document type. Enhancing native Canvas preserves the existing board and makes the functional connection format interoperable. Custom reference semantics are represented as plain Markdown, while the visual relation is a normal JSON Canvas edge.

## Reference representation

`[Human label](canvas-node:stable-id)` is the persisted mention. The current source title is shown in the picker/live chip; the saved label is a fallback. Code-fenced and inline-code examples do not declare references. Mention edge identity is deterministic: `loom-ref:source-id:destination-id`.

The mention declares the dependency. Reconciliation creates missing reference edges and removes only obsolete edges owned by Loom. It reuses an existing hand-drawn directed connection instead of adding a duplicate. It never removes a manually drawn edge in response to a text change. This intentionally does not implement destructive two-way synchronization where removing a line deletes words from a note.

## Functional context

For a selected prompt, dependencies are the union of its explicit mentions and its incoming directed edges. Traversal recursively visits ancestors, checks cycles using the active stack, and deduplicates shared sources with a visited set. File-node mentions participate after the file content is read. A compiled request contains source objects and a root prompt object with their input IDs. Inline references resolve to current source names and stable IDs; each source's text is supplied once as a context object.

Only reachable sources are included in the request. Unsupported media, broken references, cycles, excessive graph size, and excessive request length fail before generation. A URL does not imply that the page has been fetched.

## Native mutation

The adapter uses `canvas.importData({nodes, edges}, false)` to append nodes or edges without reimporting the entire canvas. It calls native removal only for `loom-ref:` edges, records native history, and asks native Canvas to save. During streaming it updates only the output card; deleting or editing that card cancels generation rather than recreating or overwriting it.

The editor integration resolves iframe-owned CodeMirror DOM back to the owning card. Picker placement translates iframe-local cursor coordinates into the outer document, accounting for Canvas zoom. This keeps the menu outside a card's clipping bounds. Obsidian relays plugin styles to its controlled Markdown iframes.

## Codex transport

Each generation has its own `codex app-server` process, temporary working directory, and ephemeral thread. It uses newline-delimited JSON RPC on stdio with no network listener or shell interpolation. Account authentication is read through `account/read`; the plugin never reads auth files. The client requires account type `chatgpt`, creates a read-only/no-approval thread, verifies the returned policy, then sends one text turn. Configured MCP servers are disabled in the per-thread overrides. Shell/unified execution, apps, and web search are disabled; unsupported interactive server requests are rejected.

The client combines streamed `item/agentMessage/delta` events by item ID and replaces each item with its final `item/completed` text, avoiding duplicated completions. `turn/completed` finalizes the request. Cancel, timeout, disconnect, plugin unload, and process failure release pending promises and close the subprocess. Partial responses survive in the Canvas.

The local process implementation is deliberately independent of Copilot and its managed `codex-acp` adapter. Future versions could add an ACP transport behind the same request compiler without changing the reference format.

## Intentional limits

No graph auto-execution, dependency scheduling, image/video interpretation, per-node model configuration, automatic node-ID remapping on native copy/paste, or persistent Codex thread history. Canvas itself carries the visible conversation and content history. These can be added independently without inventing a new file format.


## Managed runtime and sign-in in 0.2.0

`runtime-release.json` pins the six platform/architecture packages and their official GitHub SHA-256 digests. Installer activation occurs only after the complete package has been downloaded, verified, extracted, and its `codex --version` result checked. Temporary installation folders are distinct from the selected runtime. A failed update leaves the previous runtime selected. Installation locks prevent simultaneous writes and recover automatically when their owning process has exited. A previous release can remain on disk while an already-running process finishes using it.

Runtime files, profile selection, and the SQLite state directory are local to the user's application-data folder, outside the vault and its plugin settings. `CODEX_SQLITE_HOME` is set only in the child environment to prevent sharing state-database migrations with another Codex installation. Existing ChatGPT authentication can be reused through Codex's account API. If a shared profile fails or does not contain a ChatGPT login, setup selects an independent managed profile for subsequent connections. Credentials are never copied between profiles. New login uses `account/login/start` and `account/login/completed`; Codex handles its own localhost browser callback and credential persistence.

The settings panel subscribes to explicit phases rather than inferring readiness from a path or saved toggle. `checkReady` refreshes the account, verifies that `model/list` returns available models, then creates and validates an ephemeral read-only session. No inference turn is sent during setup. The panel remains in the sign-in state until the OAuth completion notification is received and the checks pass. Cancellation and plugin unload close the relevant subprocess. Browser URLs remain in memory while signing in. Startup diagnostics are bounded and redacted before display.
