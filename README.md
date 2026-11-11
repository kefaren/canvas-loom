# Canvas Loom

A desktop Obsidian plugin that adds functional node references to **existing native `.canvas` files**, plus local Codex generation.

Type `@` in a Canvas text card or an editable Markdown file card, choose another card, and Canvas Loom inserts a clickable reference and creates a real source → destination arrow. A reference points to the node's ID. When you run the prompt, Loom reads that node's current content and includes its connected sources.

This is a working **0.2.0 beta**, with compiled installation files and editable TypeScript source. It is not listed in Obsidian's community plugin directory. Canvas internals are not a stable public API, so keep a backup while evaluating it.

## Inspiration and direction

Canvas Loom grew out of my appreciation for Magnific and its Spaces feature. Spaces inspired this plugin and continues to guide its development. My goal is to bring that experience into Obsidian as faithfully as I can, using native Canvas files as the foundation.

The current release is an early step toward that goal; it does not yet reproduce the full Spaces experience. Thank you to the Magnific team for the inspiration.

## Install on your Mac

1. Extract this archive. Copy the **`canvas-loom` folder** into your vault's `.obsidian/plugins/` folder. The files `main.js`, `manifest.json`, and `styles.css` must be directly inside `.obsidian/plugins/canvas-loom/`.
2. Restart Obsidian. Open **Settings → Community plugins**, turn on community plugins if needed, and enable **Canvas Loom**.
3. Open a Canvas, edit a text card, and type `@`. If a Canvas was already open when you enabled the plugin, exit the card's editor and re-enter it, or reopen the Canvas.

To reveal hidden folders in Finder, press **Cmd + Shift + .**. You can also use **Go → Go to Folder** and enter your vault's `.obsidian/plugins/` path. If `plugins` does not exist, create it.

You do not need Node.js, npm, or a build step to install this release. Those are needed only to edit and rebuild its source. Installing Loom does not require Chat Stream, Copilot, Advanced Canvas, or Magnific.

## Set up Codex inside Obsidian

1. Open **Settings → Canvas Loom**.
2. Click **Set up Codex**.
3. If sign-in opens in your browser, finish signing in with your ChatGPT account. The settings panel updates automatically to **Ready**.

The plugin downloads the correct official Codex package for your computer, checks its SHA-256 digest, installs the runtime and its helper programs, tests that the executable starts, and configures its local state automatically. You do not need Terminal, npm, Homebrew, an executable path, or an API key.

An existing ChatGPT login is reused when Codex can load it. If the shared Codex profile is missing, incompatible, signed out, or unwritable, setup uses a separate managed profile and opens browser sign-in. That profile keeps new authentication separate from another application's API-key profile. Codex owns the OAuth flow and credentials; Loom does not read or copy authentication tokens.

The settings panel shows download progress, the current setup step, the connected account, and readiness. **Ready** requires authentication, available models, and a successfully created read-only session. Merely downloading the executable does not enable generation. Setup checks do not generate content or consume model inference.

**Cancel** stops setup or sign-in. **Retry setup** resumes without downloading again when the runtime is already installed. **Repair installation** downloads and tests a fresh package. A failed download or cancelled update preserves the previously selected runtime. Startup failures appear in settings with a **Copy error** action.

The managed package is Codex **0.167.1**, pinned to verified official release digests. This release supports Apple Silicon and Intel macOS, Linux x64/arm64, and Windows x64/arm64 package selection. Native operation was tested on Linux; macOS and Windows execution still need validation on those operating systems. The macOS arm64 release package and its archive layout were independently verified.

Installation files and Codex state are stored locally outside the vault:

| System | Managed folder |
| --- | --- |
| macOS | `~/Library/Application Support/Canvas Loom` |
| Linux | `$XDG_DATA_HOME/canvas-loom` or `~/.local/share/canvas-loom` |
| Windows | `%LOCALAPPDATA%/Canvas Loom` |

The runtime does not need to be on PATH and is not synced as part of your vault. It does not replace a system Codex installation. Optional custom executable controls are under **Advanced connection settings**. Leave **Model** blank to use Codex's default model. Runs use the signed-in account's allowance and limits.

## Update from 0.1.0

Disable Canvas Loom, replace **`main.js`**, **`manifest.json`**, and **`styles.css`** in the existing plugin folder, then re-enable it or restart Obsidian. Keep your existing `data.json` and Canvas files. Open settings and click **Set up Codex**. The old manual executable field is now an optional Advanced setting and is not required for managed setup.

## Use it

### Mention a card

Create two cards. Give the source a descriptive first line, such as `# Artist identity`. In the destination, type `Use @Artist`, then choose the source. Arrow keys navigate; Enter or Tab inserts; Escape dismisses the picker. Picking the source adds an inline chip and a native Canvas arrow from source to destination.

Click a chip to jump to its source. Move your caret into the reference to edit its underlying Markdown. The readable storage syntax is:

```md
Use [Artist identity](canvas-node:source-node-id) to develop three premises.
```

The visible title is for people; the ID identifies the source. Source edits are read on the next run. The picker and chips use the current card title. Stored Markdown labels are not rewritten whenever a source is edited.

### Draw a connection instead

Use Obsidian's existing handles to draw **source → prompt**. Any directed incoming arrow supplies context, regardless of how it was created. A manually drawn arrow does not choose an insertion position in your text, so it supplies background context without automatically inserting an inline chip.

Arrow direction matters. Lines with no arrowhead are decorative. A two-headed arrow supplies context in both directions and generally creates a cycle; Loom will flag it before running.

### Preview and run

Hover or select a text card to reveal **Context** and **Run**.

- **Context** lists all included cards and lets you inspect or copy the exact compiled request.
- **Run** reads the prompt and all its upstream sources, then streams the Codex response into a **new** card with a real response arrow.
- **Stop** cancels the active generation. Partial text is retained with a stopped message.
- Running the same prompt again creates another response card, so you can compare versions.
- For a follow-up, create a new text card, connect the previous response → new prompt (or mention it), and write your next instruction. Upstream context follows that branch.

Loom does not generate anything merely because you type a mention or connect an arrow. Only an explicit **Run** invokes Codex.

Commands are available from Obsidian's command palette:

- **Canvas Loom: Run selected node with Codex** — also works for a selected text file card.
- **Canvas Loom: Preview selected node context**
- **Canvas Loom: Cancel active generations**
- **Canvas Loom: Check Codex connection**
- **Canvas Loom: Create example canvas** — creates a new example without overwriting existing files.

## Reference and connection rules

| Action | Behavior |
| --- | --- |
| Insert an `@` reference | Store a stable node ID and create an incoming native reference arrow. |
| Repeat the same reference | Reuse its connection; include source context once. |
| Edit a source | Read its current content on the next run. |
| Remove a reference | Remove its Loom-owned arrow when no matching mentions remain. |
| Delete its arrow while keeping the reference | Recreate the arrow, because the mention still declares the dependency. Remove the mention to remove that dependency. |
| Remove a hand-drawn arrow | Stop including that connection, unless an inline reference also declares it. |
| Remove a reference that reused a hand-drawn arrow | Keep the hand-drawn arrow and its context. Remove that arrow separately if no longer needed. |
| Delete a referenced node | Mark its chip as missing and block the request until the reference is fixed. |
| Connect a source through several branches | Include it once, with each dependent card's input IDs preserved. |
| Create a cycle | Show an error before sending a request. |
| Disconnect an arrow used to create a previous answer | Change context on the next run; existing answers remain saved snapshots. |

Managed edges have IDs beginning with `loom-ref:`. Hand-drawn edge IDs and other plugins' metadata are preserved. Loom updates the active native Canvas model; it does not independently overwrite the open `.canvas` file on disk.

## Supported context

Native text cards, Markdown files, and other supported text files supply their content. Markdown heading and paragraph-block references are supported. URL cards supply the URL **only**, not a fetched webpage. Groups are organizational containers; connect their individual cards.

Images, PDFs, audio, and video are not interpreted by this release. Connecting unsupported media blocks the run with an explanation rather than pretending the model has seen it. There is no automatic execution of whole graphs, image generation, or automatic re-running when a source changes.

Context traversal includes upstream cards, respects direction, rejects cycles or missing sources, and deduplicates shared sources. Requests above the configured character limit fail visibly without silently dropping content. The default is 120,000 characters and at most 100 cards. This character limit is not a token estimate or a guarantee of model capacity.

## Compatibility and limits

- **Desktop only.** The local process bridge is intended primarily for macOS and Linux. Managed setup downloads a native executable and its helpers. Custom `.cmd` shims are not launched through a shell. Mobile does not support this local bridge.
- **Native `.canvas` only.** A new file extension would require replacing or registering another editor. The existing format retains normal Canvas behavior and stays readable if Loom is disabled. Disabled Loom leaves its Markdown reference labels and ordinary edges in place.
- **IDs are canvas-local.** A reference copied into a different canvas must be reselected unless the referenced ID also exists there. Duplicating selected source and prompt cards does not automatically remap custom inline references to the duplicated source IDs. References in a Markdown file shared across canvases likewise belong to the original canvas's IDs.
- **Groups are excluded from the mention picker.** Frame contents are not implicitly included as a group.
- **Text edits do not refresh old answers.** A run uses a snapshot of connected content. Run again to produce an updated response.
- **Canvas APIs are internal.** `src/native.ts` contains the compatibility layer. The plugin checks required methods before mutation, but a future Obsidian release may require adjustments. Coexistence with other plugins that patch Canvas is not comprehensively tested.
- **No imported third-party implementation.** Chat Stream, Advanced Canvas, Obsidian's API, and Codex documentation informed the design; this plugin is an original implementation with no runtime dependency on those plugins.

## Data and execution

Typing, referencing, and graph synchronization are local. Clicking Run sends the selected prompt and its connected text to OpenAI through Codex. Loom stores responses in the canvas and ordinary settings in plugin `data.json`. It does not store account credentials in the vault, run a public HTTP bridge, or log prompt contents.

Generation creates a temporary, ephemeral, read-only Codex session outside the vault. Setup can open Codex’s localhost OAuth callback while you sign in; generation uses private stdio. It requests no approvals, disables shell execution, unified execution, app tools, configured MCP servers, and web search in that session, and rejects interactive tool/approval requests. Your underlying Codex installation and any organization policies still govern what the runtime can do. The plugin verifies the returned read-only session policy before sending the prompt. This is a writing/context client; it does not expose Codex file editing in the vault. Your Codex login/profile and OpenAI account policies govern backend processing and retention.

For evaluating on valuable boards, use a copy or vault backup. The preview shows the exact material supplied by the plugin; it is useful for checking that only the intended branches are connected.

## Build and test

```sh
npm ci
npm run check
```

`npm run check` runs graph and subprocess-protocol tests, type checks the source, and bundles `main.js`. No account login or inference is required for the automated tests. The fake Codex executable in `tests/` is only a protocol test fixture; it is never selected as a production fallback.

See [docs/TESTING.md](docs/TESTING.md) for actual validation and remaining verification. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for implementation details.

## References

- [Obsidian Canvas](https://obsidian.md/canvas)
- [JSON Canvas format](https://jsoncanvas.org/spec/1.0/)
- [Obsidian plugin API](https://github.com/obsidianmd/obsidian-api)
- [Chat Stream](https://github.com/rpggio/obsidian-chat-stream)
- [Advanced Canvas](https://github.com/Developer-Mike/obsidian-advanced-canvas)
- [Copilot's local Codex integration](https://docs.obsidiancopilot.com/agent-mode-and-tools/)
- [Codex App Server](https://learn.chatgpt.com/docs/app-server)

MIT licensed.
