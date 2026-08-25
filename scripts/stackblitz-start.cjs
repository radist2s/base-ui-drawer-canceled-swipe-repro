const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const yarnPath = join(
  process.cwd(),
  '.yarn',
  'releases',
  'yarn-4.6.0.cjs'
);
const linkedFiles = [
  join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
  join(process.cwd(), 'node_modules', 'react-dom', 'client.js'),
  join(
    process.cwd(),
    'node_modules',
    '@base-ui',
    'react',
    'drawer',
    'viewport',
    'DrawerViewport.mjs'
  ),
];

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
  clearInterval(linkedFilesWatcher);

  const devServer = spawn(process.execPath, [yarnPath, 'dev'], {
    stdio: 'inherit',
  });

  devServer.on('exit', (code) => {
    process.exitCode = code ?? 0;
  });
}

const linkedFilesWatcher = setInterval(() => {
  if (linkedFiles.every((filePath) => existsSync(filePath))) {
    clearInterval(linkedFilesWatcher);
    setTimeout(startDevServer, 100);
  }
}, 50);

installer.on('exit', () => {
  startDevServer();
});
