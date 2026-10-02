const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const gh = process.env.GH_BINARY || 'gh';
const env = { ...process.env };
const repo = process.env.TEST_REPOSITORY || 'ambatiroshan7-source/ai-testing-helper';
function call(args) { return execFileSync(gh, args, { env, encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024 }); }
try {
  const runs = JSON.parse(call(['run', 'list', '--repo', repo, '--workflow', 'tests.yml', '--branch', 'main', '--limit', '1', '--json', 'databaseId,status,conclusion,url,createdAt,headSha']));
  if (!runs.length) throw new Error('No test runs found.');
  const run = runs[0];
  let evidence = 'The run has not completed. Check again later.';
  if (run.status === 'completed') {
    const logs = call(['run', 'view', String(run.databaseId), '--repo', repo, '--log']);
    evidence = logs.split('\n').filter(line => /Run npm test/.test(line)).slice(-100).join('\n') || 'No test-step log available. Inspect the run link below.';
  }
  const report = `# Latest GitHub store tests\n\nChecked: ${new Date().toISOString()}\nRepository: ${repo}\nRun: ${run.databaseId}\nCommit: ${run.headSha}\nStatus: ${run.status}\nConclusion: ${run.conclusion || 'pending'}\nRun started: ${run.createdAt}\nLink: ${run.url}\n\n## Test evidence\n\n\`\`\`text\n${evidence}\n\`\`\`\n\nA failed workflow can mean a setup or network issue; only test-step evidence establishes a failed website check.\n`;
  const dir = path.join(process.env.OPENCLAW_WORKSPACE || path.join(os.homedir(), '.openclaw/workspace'), 'reports');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'latest-github-tests.md');
  fs.writeFileSync(file, report);
  console.log(report);
  console.log(`Report saved: ${file}`);
} catch (error) {
  console.error('Could not retrieve test results:', error.message);
  process.exitCode = 1;
}
