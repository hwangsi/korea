// Static build (no dependencies, Node built-in TypeScript type stripping):
//   dist/                  ES modules + data, serve with any static web server
//   dist/standalone.html   single file with all code and data inlined, opens directly from disk
//
//   node tools/build.mjs
//   python -m http.server -d dist   -> http://localhost:8000   (or just open dist/standalone.html)

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, statSync } from 'node:fs';
import { join, resolve, relative, dirname, extname, posix } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const DATA = join(ROOT, 'data', 'extracted');
const emitWarning = process.emitWarning;
process.emitWarning = (w, ...rest) => (String(w).includes('stripTypeScriptTypes') ? undefined : emitWarning.call(process, w, ...rest));

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const toPosix = (p) => p.split('\\').join('/');
const modules = new Map(); // 'src/x.js' -> js source

for (const file of walk(join(ROOT, 'src'))) {
  const rel = toPosix(relative(ROOT, file));
  const target = join(DIST, rel.replace(/\.ts$/, '.js'));
  mkdirSync(dirname(target), { recursive: true });
  if (extname(file) === '.ts') {
    const js = stripTypeScriptTypes(readFileSync(file, 'utf8'), { mode: 'strip' })
      .replace(/(from\s+['"])(\.{1,2}\/[^'"]+)\.ts(['"])/g, '$1$2.js$3')
      .replace(/(import\s+['"])(\.{1,2}\/[^'"]+)\.ts(['"])/g, '$1$2.js$3');
    writeFileSync(target, js);
    modules.set(rel.replace(/\.ts$/, '.js'), js);
  } else {
    cpSync(file, target);
  }
}
const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
writeFileSync(join(DIST, 'index.html'), indexHtml.replace('src/main.ts', 'src/main.js'));
const hasData = existsSync(join(DATA, 'map.json'));
if (hasData) for (const name of ['map.json', 'scenarios']) cpSync(join(DATA, name), join(DIST, 'data', 'extracted', name), { recursive: true });

// ---------- standalone.html: tiny module bundler for our own code style ----------
function bundleModule(id, src) {
  const exports = [];
  let code = src.replace(/^\s*import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"];?/gm, (_, names, spec) => {
    const dep = posix.normalize(posix.join(posix.dirname(id), spec));
    const list = names.split(',').map((n) => n.trim()).filter(Boolean).map((n) => n.replace(/\s+as\s+/, ': '));
    return `const { ${list.join(', ')} } = __modules[${JSON.stringify(dep)}];`;
  });
  code = code.replace(/^export\s+(async\s+function|function|class|const|let)\s+([A-Za-z_$][\w$]*)/gm, (_, kw, name) => {
    exports.push(name);
    return `${kw} ${name}`;
  });
  return `__modules[${JSON.stringify(id)}] = (() => {\n${code}\nreturn { ${exports.join(', ')} };\n})();\n`;
}

const order = [];
const visit = (id, seen = new Set()) => {
  if (order.includes(id) || seen.has(id)) return;
  seen.add(id);
  const src = modules.get(id);
  if (!src) throw new Error(`missing module ${id}`);
  for (const m of src.matchAll(/from\s*['"](\.{1,2}\/[^'"]+)['"]/g)) visit(posix.normalize(posix.join(posix.dirname(id), m[1])), seen);
  order.push(id);
};
visit('src/main.js');

const embedded = {};
if (hasData) {
  embedded['data/extracted/map.json'] = JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8'));
  for (const f of readdirSync(join(DATA, 'scenarios'))) {
    const s = JSON.parse(readFileSync(join(DATA, 'scenarios', f), 'utf8'));
    delete s.hexExtra; // not used by the viewer
    delete s.terrainCodes;
    embedded[`data/extracted/scenarios/${f}`] = s;
  }
}
const css = readFileSync(join(ROOT, 'src', 'styles.css'), 'utf8');
const script = `window.__EMBEDDED_DATA__ = ${JSON.stringify(embedded)};\n(() => {\nconst __modules = {};\n${order.map((id) => bundleModule(id, modules.get(id))).join('\n')}\n})();`;
const standalone = indexHtml
  .replace(/<link rel="stylesheet" href="src\/styles.css" \/>/, () => `<style>\n${css}\n</style>`)
  .replace(/<script type="module" src="src\/main.ts"><\/script>/, () => `<script>\n${script.replace(/<\/script/gi, '<\\/script')}\n</script>`);
writeFileSync(join(DIST, 'standalone.html'), standalone);

console.log(`built ${modules.size} modules -> ${DIST}`);
console.log(`standalone.html: ${(standalone.length / 1024 / 1024).toFixed(2)} MB (${order.join(', ')})`);
