import fs from 'fs';
import archiver from 'archiver';
import { execSync } from 'child_process';

console.log('\n🚀 1. Compilando el código TypeScript...');
execSync('npm run build', { stdio: 'inherit' });

console.log('\n📦 2. Excluyendo temporalmente las dependencias de desarrollo...');
// Guardamos las dependencias locales renombrando la carpeta
if (fs.existsSync('node_modules')) {
  fs.renameSync('node_modules', 'node_modules_backup');
}

// Instalamos sólo las de producción
try {
  execSync('npm install --omit=dev --legacy-peer-deps', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Error instalando las dependencias. Restaurando entorno...');
  fs.rmSync('node_modules', { recursive: true, force: true });
  if (fs.existsSync('node_modules_backup')) {
    fs.renameSync('node_modules_backup', 'node_modules');
  }
  process.exit(1);
}

console.log('\n🗜️ 3. Comprimiendo el archivo para AWS...');
const output = fs.createWriteStream('lambda-release.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`\n✅ Éxito! El archivo lambda-release.zip fue creado. Tamaño: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  
  console.log('🔄 Restaurando entorno de desarrollo local...');
  fs.rmSync('node_modules', { recursive: true, force: true });
  if (fs.existsSync('node_modules_backup')) {
    fs.renameSync('node_modules_backup', 'node_modules');
  }
  console.log('✨ Todo listo.');
});

archive.on('error', (err: any) => {
  throw err;
});

archive.pipe(output);

// Agregamos las carpetas y archivos necesarios al zip
archive.directory('dist/', 'dist');
archive.directory('node_modules/', 'node_modules');
archive.file('package.json', { name: 'package.json' });

archive.finalize();
