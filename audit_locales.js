
/* eslint-disable no-console */
import { en } from './packages/cli/src/locales/en.ts';
import { ua } from './packages/cli/src/locales/ua.ts';

const enKeys = new Set(Object.keys(en));
const uaKeys = new Set(Object.keys(ua));

const missingInUa = [...enKeys].filter(k => !uaKeys.has(k));
const extraInUa = [...uaKeys].filter(k => !enKeys.has(k));

console.log('--- Translation Audit Report ---');
console.log(`Total keys in EN: ${enKeys.size}`);
console.log(`Total keys in UA: ${uaKeys.size}`);

if (missingInUa.length > 0) {
  console.error('MISSING keys in UA (Need translation):', missingInUa);
} else {
  console.log('✅ All EN keys are present in UA.');
}

if (extraInUa.length > 0) {
  console.warn('EXTRA keys in UA (Likely obsolete):', extraInUa);
} else {
  console.log('✅ No extra keys in UA.');
}

// Check for empty strings in UA
const emptyInUa = Object.entries(ua).filter(([, v]) => v === '').map(([k]) => k);
if (emptyInUa.length > 0) {
    console.error('EMPTY values in UA:', emptyInUa);
} else {
    console.log('✅ No empty translations in UA.');
}
