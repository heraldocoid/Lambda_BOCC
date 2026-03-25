const esbuild = require('esbuild');
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
    const artifact = path.join(root, 'artifact');
    const entry = path.join(root, 'src', 'interfaces', 'http', 'handler.ts');

    // 1) Clean artifact
    rmrf(artifact);
    fs.mkdirSync(artifact, { recursive: true });

    // 2) Bundle with esbuild
    console.log('Bundling with esbuild...');
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      platform: 'node',
      target: ['node18'],
      format: 'cjs',
      outfile: path.join(artifact, 'index.js'),
      external: [],
    });

    // 3) Prepare minimal package.json (only production deps) so npm install is deterministic
    const pkgPath = path.join(root, 'package.json');
    const pkgLock = path.join(root, 'package-lock.json');
    const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const minimalPkg = {
      name: pkgData.name || 'artifact',
      version: pkgData.version || '1.0.0',
      private: pkgData.private === true,
      type: pkgData.type || 'commonjs',
      dependencies: pkgData.dependencies || {},
    };
    fs.writeFileSync(path.join(artifact, 'package.json'), JSON.stringify(minimalPkg, null, 2));
    if (fs.existsSync(pkgLock)) fs.copyFileSync(pkgLock, path.join(artifact, 'package-lock.json'));

    // 4) Copy production dependencies from root node_modules into artifact/node_modules
    console.log('Copying production dependencies into artifact (from root node_modules)...');
    const rootNodeModules = path.join(root, 'node_modules');
    const artifactNodeModules = path.join(artifact, 'node_modules');
    fs.mkdirSync(artifactNodeModules, { recursive: true });
    const deps = Object.keys(minimalPkg.dependencies || {});
    for (const dep of deps) {
      const src = path.join(rootNodeModules, dep);
      const dest = path.join(artifactNodeModules, dep);
      if (!fs.existsSync(src)) {
        console.warn(`Warning: dependency ${dep} not found in root node_modules; skipping copy.`);
        continue;
      }
      fs.cpSync(src, dest, { recursive: true });
    }

    // 5) Create zip
    const zipPath = path.join(root, 'deployment-esbuild.zip');
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    console.log('Creating deployment-esbuild.zip...');
    await zipDirectory(artifact, zipPath);

    console.log('Created', zipPath);
    console.log('Done. Handler inside zip: index.handler');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
