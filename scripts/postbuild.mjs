import { copyFileSync, existsSync, writeFileSync } from 'node:fs';

const dist = 'dist';

writeFileSync(`${dist}/.nojekyll`, '');

if (existsSync(`${dist}/index.html`)) {
  copyFileSync(`${dist}/index.html`, `${dist}/404.html`);
}

console.log('postbuild: wrote .nojekyll and 404.html');
