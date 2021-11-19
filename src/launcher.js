import getRawData from "./utils.js";
import * as es from "./es.js";
import Store from "./store.js";


async function indexDoc(store, doc) {
    await store.put(doc.id, doc.text);
    await es.insertDoc(doc.id, doc.text);
}
await es.deleteIndex();
await es.createIndex();
const store = new Store();
await getRawData().then(async docs => Promise.all(docs.map(doc => indexDoc(store, doc))))
await es.refresh();

const q = "robert de niro al pacino";
console.table(await store.search(q, 10));
console.table(await es.search(q, 10));