// Converts an original Conflict: Korea saved game (*.SAV) into a remake save file (.json) that the save dialog's
// "파일 올리기" loads (docs/rules/save.md 4). The web client never reads original binaries itself.
// Usage: node tools/extract/sav2json.ts <game.SAV> [out.json] [--seed N] [--exe path/to/KOREA.EXE]
// Needs data/extracted (map.json and the scenario JSON the save is based on) and KOREA.EXE for the data layout.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, basename, dirname } from 'node:path';
import { layoutFromExe, convertSav } from './lib/sav.ts';
import { saveToText } from '../../src/engine/save.ts';

const ROOT = resolve(import.meta.dirname, '..', '..');
const args = process.argv.slice(2);
const flag = (name: string) => { const i = args.indexOf(name); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const seedArg = flag('--seed');
const exeArg = flag('--exe');
const [input, outArg] = args;
if (!input) {
  console.error('Usage: node tools/extract/sav2json.ts <game.SAV> [out.json] [--seed N] [--exe KOREA.EXE]');
  process.exit(1);
}
const savPath = resolve(input);
const candidates = [exeArg, join(dirname(savPath), 'KOREA.EXE'), join(ROOT, '..', 'Conflict-Korea-The-First-Year-1950-51_DOS_EN', 'confkorea', 'KOREA.EXE')]
  .filter((p): p is string => !!p).map((p) => resolve(p));
const exePath = candidates.find((p) => existsSync(p));
if (!exePath) { console.error(`KOREA.EXE not found (tried ${candidates.join(', ')}); pass --exe`); process.exit(1); }
const DATA = join(ROOT, 'data', 'extracted');
if (!existsSync(join(DATA, 'map.json'))) { console.error('data/extracted/map.json missing: run tools/extract/extract.ts first'); process.exit(1); }

const layout = layoutFromExe(readFileSync(exePath));
const map = JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8'));
const res = convertSav(readFileSync(savPath), layout, map, { file: basename(savPath).toUpperCase(), seed: seedArg ? Number(seedArg) : undefined });
if (!res.ok) { console.error(`${basename(savPath)}: cannot convert (${res.error}): ${res.detail}`); process.exit(2); }
if (!existsSync(join(DATA, 'scenarios', `${res.info.scenarioId}.json`))) {
  console.warn(`warning: data/extracted/scenarios/${res.info.scenarioId}.json is missing; the remake needs it to load this save`);
}
const outPath = resolve(outArg ?? savPath.replace(/\.[^.\\/]+$/, '') + '.json');
writeFileSync(outPath, saveToText(res.save));
const i = res.info;
const mode = ['two players', 'UN Solitaire (computer: Communist)', 'Red Solitaire (computer: UN)'][i.options.playMode];
console.log(`${basename(savPath)} -> ${outPath}`);
console.log(`  scenario ${i.options.scenario} (${i.scenarioId}), turn ${i.turn}, ${i.phase === 1 ? 'first' : 'second'} orders phase of player ${i.player} (${i.player === 1 ? 'Communist' : 'UN'}), order ${i.order.join(',')}`);
console.log(`  ${mode}, competence ${i.options.competence}, ${i.options.limitedIntel ? 'limited' : 'complete'} intelligence, air ${i.options.airPlayerControl ? 'player' : 'program'} control, CCF ${i.options.ccfFixed ? 'fixed' : 'historical'}`);
console.log(`  ${i.notes} news lines${i.victoryVoid ? ', continued past the end of the game' : ''}. Load it in the remake: 저장 -> 파일 올리기`);
