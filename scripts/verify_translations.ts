
import { translations } from '../src/utils/translations';

const enKeys = translations.en;
const frKeys = translations.fr;
const esKeys = translations.es;

function getKeys(obj: any, prefix: string = ''): string[] {
    let keys: string[] = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

const enKeyList = getKeys(enKeys);
const frKeyList = getKeys(frKeys);
const esKeyList = getKeys(esKeys);

const missingFr = enKeyList.filter(k => !frKeyList.includes(k));
const missingEs = enKeyList.filter(k => !esKeyList.includes(k));

console.log('Missing French Keys:', missingFr);
console.log('Missing Spanish Keys:', missingEs);

if (missingFr.length === 0 && missingEs.length === 0) {
    console.log('All translations are present!');
}
