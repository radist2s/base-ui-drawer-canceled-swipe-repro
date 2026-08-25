const { spawn, spawnSync } = require('node:child_process');
const { join } = require('node:path');

const yarnPath = join(
  process.cwd(),
  '.yarn',
  'releases',
  'yarn-4.6.0.cjs'
);

// StackBlitz's automatic installer ignores yarnPath and invokes Yarn 1.
// Run the committed release directly so the fixed branch can use `patch:`.
spawnSync(process.execPath, [yarnPath, 'install'], {
  stdio: 'inherit',
});

const devServer = spawn(process.execPath, [yarnPath, 'dev'], {
  stdio: 'inherit',
});

devServer.on('exit', (code) => {
  process.exitCode = code ?? 0;
});
