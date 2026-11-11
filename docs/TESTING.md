# Validation for 0.2.0

Validated on November 11, 2026.

## Automated checks

`npm run check` passes **41 tests**, type checks with TypeScript, and builds the installable plugin. Existing graph/reference tests remain. New tests exercise verified installation, helper preservation, failed-download rollback, cancellation and retry, concurrent/stale installer locks, archive-link rejection, architecture selection, persistent profile selection, in-app sign-in, model/session readiness, single-operation behavior, and fallback from a broken shared profile.

OAuth completion in the automated tests uses a local subprocess protocol fixture. It is never selected as a production fallback.

## Official Codex runtime checks

- Downloaded the pinned Linux x64 **Codex 0.167.1** package through the plugin's actual Node HTTPS downloader, including redirect/proxy handling and byte progress.
- Verified the complete 200,235,863-byte archive against its pinned official SHA-256 digest.
- Extracted the complete package, including its helper programs, and ran `codex --version` through the installer.
- Started the installed **real Codex app-server**, initialized its protocol, and successfully read signed-out account state from a managed profile.
- Started the **real ChatGPT browser OAuth flow**, received an `auth.openai.com` sign-in URL and login ID, and cancelled it without authenticating an account.
- Downloaded and verified the macOS arm64 package (166,615,534 bytes), inspected its archive layout, and confirmed the required runtime layout and absence of archive links. The macOS binary was not executed on Linux.

The former hosted startup failure is addressed by a separate writable SQLite state directory and an automatic managed-profile fallback. A read-only shared profile no longer requires manually editing paths or Codex configuration.

## Native settings flow

The settings flow is tested in an isolated Obsidian 1.15.0 Linux desktop vault. Native-app launch in this environment adapts single-instance/CLI socket handling to local socket restrictions; Canvas and editor code are unchanged. Real downloaded Codex packages are used for runtime checks. Completing account authentication and testing a generated response use a subprocess protocol fixture so no real account needs to be signed in by the test.

Passed in the native settings panel:

- Clicking **Set up Codex** installed the actual official runtime package (using the already-downloaded verified archive for the UI test), tested it, started real Codex, and reached its real browser sign-in flow.
- The waiting state displayed **Cancel** and **Open sign-in page** without claiming Ready.
- Cancelling retained the installed runtime and returned to an actionable state.
- Protocol-fixture sign-in completion verified account, models, and session startup before displaying **Ready** and **Reconnect**.
- A subsequent prompt generated a new connected response through a fresh subprocess using the fixture's persisted sign-in marker.
- No renderer errors occurred. Obsidian 1.15's separate settings window was exercised.

The real network download was tested independently through the production downloader. Real OAuth initialization was tested; completed authorization and model inference still require an actual user's account.

## Existing native Canvas baseline

The compiled plugin was loaded in a fresh isolated **Obsidian 1.15.0 Linux desktop** vault. Native Canvas, native embedded CodeMirror editors, native saves, and the plugin's shipped bundle were used. A temporary test launcher adapted single-instance/CLI sockets to this hosted environment's socket restrictions; no Canvas or Markdown-editor implementation was modified.

Passed:

- Typing `@Artist` in an actual Canvas text-card editor displayed the picker outside the editor iframe.
- Enter inserted the ID-based Markdown reference and created a real native source → prompt edge.
- The reference rendered as a chip in native Markdown preview.
- Context preview contained the source and root prompt.
- Running the preview sent source text to the local subprocess protocol fixture and created a native response card and response arrow.
- The generation job completed and released its resources without browser/renderer errors.
- Changing a source's content changed the compiled request.
- Adding an ordinary directed incoming edge included its text source in the compiled request.
- Removing an inline mention removed the managed edge while preserving a hand-drawn edge.
- Editor Undo restored the reference and its managed edge.
- Native Canvas saved source, prompt, response, and edges to disk.
- An editable Markdown file card supplied its latest unsaved editor content in the compiled request.
- Closing and reopening the Canvas restored the references and generated content.

Native testing found and corrected issues that unit tests alone could not catch: identifying iframe-owned editors, positioning overlays beyond card clipping, avoiding CodeMirror layout reads during transactions, synchronizing delayed text-card serialization, and using Node timers for subprocess cleanup inside Electron's renderer.


## Remaining local validation

- A real account's completed browser authorization and model inference still require the user's own sign-in. The plugin can install, launch, start OAuth, and display the waiting state without that authorization.
- Native UI execution and managed executable startup on macOS and Windows have not been run in this Linux environment. Platform/package selection is tested, and the Apple Silicon archive is verified; actual OS compatibility must pass the installer's executable check.
- Old Obsidian versions, every Canvas-modifying plugin combination, and complex shared-note/subpath cases are not comprehensively covered.

## First local check

1. Replace the plugin's compiled files and restart or re-enable it.
2. Open **Settings → Canvas Loom → Set up Codex**.
3. Finish the browser sign-in if requested, then wait for **Ready**.
4. Create the example canvas and run a small prompt.
5. Close and reopen the canvas to inspect the saved response and connections.

This remains a beta plugin. Setup now reports specific failures in settings and offers Retry or Repair instead of relying on manual CLI setup.
