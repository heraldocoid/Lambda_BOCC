const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

function rmrf(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

async function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);
  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream);
    stream.on('close', () => resolve());
    archive.finalize();
  });
}

(async function main() {
  try {
    const root = path.resolve(__dirname, '..');
    // ensure process cwd is repo root (helps when previous steps changed terminal cwd)
    try { process.chdir(root); } catch (e) {}
    // 1) Build
    run('npm run build', { cwd: root });
    const dist = path.join(root, 'dist');
    const artifact = path.join(root, 'artifact');

    // 2) Clean artifact
    rmrf(artifact);
    fs.mkdirSync(artifact, { recursive: true });

    // 3) Copy dist -> artifact
    copyDir(dist, artifact);

    // 4) Prepare minimal package.json (only production deps) so npm install is deterministic
    const pkg = path.join(root, 'package.json');
    const pkgLock = path.join(root, 'package-lock.json');
    const pkgData = JSON.parse(fs.readFileSync(pkg, 'utf8'));
    const minimalPkg = {
      name: pkgData.name || 'artifact',
      version: pkgData.version || '1.0.0',
      private: pkgData.private === true,
      type: pkgData.type || 'commonjs',
      dependencies: pkgData.dependencies || {},
    };
    fs.writeFileSync(path.join(artifact, 'package.json'), JSON.stringify(minimalPkg, null, 2));
    if (fs.existsSync(pkgLock)) {
      fs.copyFileSync(pkgLock, path.join(artifact, 'package-lock.json'));
    }

    // 5) Install production deps inside artifact
    console.log('Installing production dependencies inside artifact...');
    try {
      if (fs.existsSync(pkgLock)) {
        execSync('npm ci --omit=dev', { cwd: artifact, stdio: 'inherit' });
      } else {
        execSync('npm install --omit=dev --no-audit --no-fund', { cwd: artifact, stdio: 'inherit' });
      }
    } catch (err) {
      console.error('npm install failed', err);
      throw err;
    }

    // 6) Create zip
    const zipPath = path.join(root, 'deployment.zip');
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    console.log('Creating deployment.zip...');
    await zipDirectory(artifact, zipPath);

    console.log('Created', zipPath);
    console.log('Done.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
