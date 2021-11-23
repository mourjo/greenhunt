import getRawData from "./utils.js";
import * as es from "./es.js";
import Store, {ScoredDocument} from "./store.js";
import {RawDocument} from './utils.js';

async function indexDoc(store: Store, doc: RawDocument) {
    await store.put(doc.id, doc.text);
}

async function indexEsDocs(docs : RawDocument[]) {
    let batch : Array<RawDocument> = [], counter = 0;

    const processBatch = async (aBatch: Array<RawDocument>, doc:RawDocument|null) => {
        if (doc) {
            aBatch.push(doc);
        }

        if (aBatch.length >= 2000 || !doc) {
            await es.bulkInsert(aBatch);
            counter += aBatch.length;
            console.log(`${new Date()}: Inserted ${counter}/${docs.length} documents into ES`)
            aBatch = [];
        }
        return aBatch;
    };

    for (const doc of docs) {
        batch = await processBatch(batch, doc);
    }
    await processBatch(batch, null);
}

function stats(esResults : es.ESResult[], storeResults: ScoredDocument[]) {
    let relevant = esResults.map(doc => doc.id);

    let retrieved = storeResults.map(doc => doc.id);
    let retrievedSet = new Set(retrieved);

    let x = (relevant.filter(id => retrievedSet.has(id)).length);
    let precision = x / retrieved.length;
    let recall = x / relevant.length;

    return { precision: precision, recall: recall };
}

async function main() {
    await es.deleteIndex();
    await es.createIndex();
    const store = new Store();

    console.log(`${new Date()}: Reading raw docs from file...`);
    const docs = await getRawData();

    console.log(`${new Date()}: Inserting docs into store...`);
    await Promise.all(docs.map(doc => indexDoc(store, doc)));

    console.log(`${new Date()}: Inserting docs into ES in batches...`);
    await indexEsDocs(docs);
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
}

main();