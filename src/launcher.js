import getRawData from "./utils.js";
import * as es from "./es.js";
import Store from "./store.js";


async function indexDoc(store, doc) {
    await store.put(doc.id, doc.text);
    await es.insertDoc(doc.id, doc.text);
}

function stats(esResults, storeResults) {
    let relevant = esResults.map(doc => doc.id);

    let retrieved = storeResults.map(doc => doc.id);
    let retrievedSet = new Set(retrieved);

    let x = (relevant.filter(id => retrievedSet.has(id)).length);
    let precision = x / retrieved.length;
    let recall = x / relevant.length;

    return { precision: precision, recall: recall };
}

await es.deleteIndex();
await es.createIndex();
const store = new Store();
await getRawData().then(async docs => Promise.all(docs.map(doc => indexDoc(store, doc))))
await es.refresh();


const queries = [
    "robert de niro al pacino",
    "horror",
    "america washington france",
    "1970",
    "github gitlab fitbit",
    "wars were common in the early days of civilization",
    "a visit to the library",
    "world war",
    "alien star wars yoda",
    "live long and prosper",
    "crime thriller",
    "war story"
];

const comparison = await Promise.all(queries.map(async q => {
    let storeResults = await store.search(q, 25);
    let esResults = await es.search(q, 25);
    let { recall, precision } = stats(esResults, storeResults);
    return { query: q, precision: precision, recall: recall };
}));

comparison.sort((a, b) => a.query.localeCompare(b.query));

console.table(comparison);