const { spawn } = require('node:child_process');
const { existsSync, unlinkSync } = require('node:fs');
const { join } = require('node:path');

const yarnPath = join(
  process.cwd(),
  '.yarn',
  'releases',
  'yarn-4.6.0.cjs'
);
const installStatePath = join(
  process.cwd(),
  '.yarn',
  'install-state.gz'
);

if (existsSync(installStatePath)) {
  unlinkSync(installStatePath);
}

// StackBlitz's automatic installer ignores yarnPath and invokes Yarn 1.
// Run the committed release directly so the fixed branch can use `patch:`.
const installer = spawn(process.execPath, [yarnPath, 'install'], {
  stdio: 'inherit',
});

let devServerStarted = false;

function startDevServer() {
  if (devServerStarted) {
    return;
  }

  devServerStarted = true;
  clearInterval(installStateWatcher);

  const devServer = spawn(process.execPath, [yarnPath, 'dev'], {
    stdio: 'inherit',
  });

  devServer.on('exit', (code) => {
    process.exitCode = code ?? 0;
  });
}

const installStateWatcher = setInterval(() => {
  if (existsSync(installStatePath)) {
    startDevServer();
  }
}, 50);

installer.on('exit', () => {
  startDevServer();
});
