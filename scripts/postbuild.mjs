import { copyFileSync, existsSync, writeFileSync } from 'node:fs';

const dist = 'dist';

writeFileSync(`${dist}/.nojekyll`, '');
writeFileSync(`${dist}/CNAME`, 'doublo.sviara.com\n');

if (existsSync(`${dist}/index.html`)) {
  copyFileSync(`${dist}/index.html`, `${dist}/404.html`);
}

console.log('postbuild: wrote .nojekyll, CNAME and 404.html');
