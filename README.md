# AI Testing Helper

Tests the SauceDemo sample store. Only public demo credentials are used.

## Run on your Mac

Open Terminal in this folder and run these commands one at a time:

```sh
npm ci
npx playwright install chromium
npm test
npm run report
```

Two tests cover the five-step shopping flow and rejection of an incorrect password. Tests run once with one worker. Failures include screenshots and traces. Each test starts in a separate browser session.

## Run on GitHub

Publish this entire folder to a repository with a main branch, including the hidden .github folder and package-lock.json. GitHub Actions runs the tests on updates to main, pull requests, and manual runs. Open the repository's Actions tab, select Store tests, and select Run workflow for a manual run. Download store-test-report from a completed run to inspect results.

GitHub tests do not need an AI key or access to your laptop. OpenClaw can explain the resulting reports when you provide them. Automatic delivery of GitHub reports to OpenClaw is a separate integration and is not configured yet.
