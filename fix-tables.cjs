const { readFileSync, writeFileSync } = require('fs');

const files = [
  'src/lib/server.ts',
  'src/app/api/messages/route.ts',
  'src/app/api/vlogs/route.ts',
  'src/app/api/users/[openid]/route.ts',
  'src/app/api/evaluate/route.ts',
  'src/app/api/toastmasters/route.ts',
  'src/app/api/discover/route.ts',
  'src/app/api/register/route.ts',
  'src/app/api/profile/route.ts',
  'src/app/api/parties/[id]/route.ts',
  'src/app/api/parties/route.ts',
  'src/app/api/parties/[id]/join/route.ts',
];

const tables = [
  'users',
  'parties',
  'toastmasters_clubs',
  'vlogs',
  'messages',
  'appointments',
  'evaluations',
];

const re = new RegExp(
  '\\b(FROM|INTO|UPDATE|JOIN|TABLE)\\s+(' + tables.join('|') + ')\\b',
  'g'
);

let changed = 0;
for (const f of files) {
  const orig = readFileSync(f, 'utf8');
  const next = orig.replace(re, (m, kw, t) => kw + ' wy_' + t);
  if (next !== orig) {
    writeFileSync(f, next, 'utf8');
    changed++;
    console.log('updated: ' + f);
  } else {
    console.log('no change: ' + f);
  }
}
console.log('total files changed: ' + changed);
