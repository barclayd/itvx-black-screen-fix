# ITVX Black Screen Fix

A tiny Chrome extension that fixes the **black/blank video player on [ITVX](https://www.itv.com/watch)** that can occur when your laptop is plugged into an external display.

## The problem

The stream plays (you can hear audio, the progress bar moves) but the picture is completely black. This happens because Chrome renders DRM-protected video through a *hardware overlay* plane for efficiency, and that rendering path can break when an external monitor is connected — frames are decoded but never painted to the screen.

## The fix

This extension applies a near-invisible CSS filter (`brightness(1.001)`) to the video element. That disqualifies the video from Chrome's hardware overlay path and forces it to be composited as a normal GPU texture, which renders correctly on any display.

It does two things:

1. **Automatic:** applies the filter on every `itv.com` page, so the player shouldn't go black in the first place.
2. **Manual rescue:** adds a toolbar button that rebuilds the video's compositor layer and nudges playback on the active tab — a backup if a player ever goes black anyway (works on any site).

## Download

**Easiest:** grab `itvx-black-screen-fix.zip` from the [latest release](../../releases/latest) — no GitHub account needed. Unzip it somewhere permanent (Chrome loads the extension from this folder, so don't delete it).

Alternatives:

- Download the **itvx-black-screen-fix** artifact from the most recent [Actions run](../../actions) (requires being signed in to GitHub).
- Clone this repo — the extension files are at the repo root.

## Install in Chrome

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked** and select the unzipped folder.

That's it — it survives Chrome restarts. Visit https://www.itv.com/watch and the fix is active automatically.

## Usage

- Normally you don't need to do anything — the filter is applied automatically on ITVX.
- If a video player still goes black (on ITVX or any other site), click the extension's toolbar icon to run the manual rescue: it re-attaches the video element and nudges playback back half a second, forcing Chrome to repaint it.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (Manifest V3) |
| `fix.css` | The automatic anti-overlay filter, injected on `itv.com` |
| `background.js` | Toolbar-button handler that runs the manual rescue |

## Releasing

Releases are automated. Bump the `version` in `manifest.json` in your PR — when it merges to `main`, the [build workflow](.github/workflows/build.yml) tags `v<version>`, creates a GitHub release, and attaches the packaged zip. Pushes that don't change the version just rebuild the artifact and skip the release.

## Extending to other sites

The same black-screen bug can affect other DRM streaming sites. To protect them automatically, add their domains to the `matches` array in `manifest.json`, e.g.:

```json
"matches": ["*://www.itv.com/*", "*://www.channel4.com/*"]
```

Then click the reload icon on the extension card in `chrome://extensions`.
