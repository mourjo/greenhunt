import getRawData from "./utils.js";
import * as es from "./es.js";

class Store {

    constructor() {
        this.docTermFreq = new Map();
        this.wordCount = 0;
        this.docCount = 0;
        this.docIdx = new Map();
        this.docFreq = new Map();
        this.counter = 0;
    }

    get(docId) {
        return this.docIdx.get(docId).raw;
    }

    getAll() {
        return Array.from(this.docIdx.entries()).map(([id, doc]) => { return { id: id, doc: doc }; });
    }

    async put(id, document) {
        const words = document.toLowerCase().split(/[\s.,;]+/);
        this.wordCount += words.length;
        this.docCount++;
        this.docIdx.set(id, { words: words, raw: document });
        this.docTermFreq.set(id, new Map());

        for (let word of words) {
            // update IDF
            if (!this.docFreq.has(word)) {
                this.docFreq.set(word, new Set());
            }
            this.docFreq.get(word).add(id);

            // update TF
            let previousTF = 0;
            if (this.docTermFreq.get(id).has(word)) {
                previousTF = this.docTermFreq.get(id).get(word);
            }
            this.docTermFreq.get(id).set(word, previousTF + 1);
        }
    }

    async search(query) {
        const words = query.toLowerCase().split(/[\s.,;]+/);
        const result = await Promise.all(this.getAll().map(entry => this.scoreDoc(entry, words)));
        return result.filter(scoredDoc => scoredDoc.score > 0).sort((doc1, doc2) => doc2.score - doc1.score).slice(0,5);
    }

    async scoreDoc({ id: docId, doc: { raw: doc } }, queryWords) {
        const k1 = 1.2, b = 0.75, avgLen = this.avgDocLength(), currentDocLen = this.docLength(docId);
        let score = 0;
        for (let word of queryWords) {
            const currentTF = this.tf(word, docId);
            let numerator = currentTF * (k1 + 1);

            let x = k1 * (1 - b + (b * currentDocLen / avgLen));
            let denominator = currentTF + x;

            score += this.idf(word) * (numerator / denominator);
        }
        return {
            id: docId,
            score: score,
            doc: doc.substring(0, 50) + '...'
        };
    }

    tf(word, docId) {
        if (this.docTermFreq.get(docId).has(word)) {
            return this.docTermFreq.get(docId).get(word);
        }
        return 0;
    }

    avgDocLength() {
        return this.wordCount / this.docCount;
    }

    docLength(docId) {
        return this.docIdx.get(docId).words.length;
    }

    idf(word) {
        if (this.docFreq.has(word)) {
            let nqi = this.docFreq.get(word).size;
            return Math.log(1 + (this.docCount - nqi + 0.5) / (nqi + 0.5));
        }
        return 0;
    }

}

async function indexDoc(store, doc) {
    let sanitizedID = (doc.id + "_" + doc.name).replace(/ /gi,'_').replace(/[^a-z0-9_]/gi,'');
    await store.put(sanitizedID, doc.text);
    await es.insertDoc(sanitizedID, doc.text);
}
await es.deleteIndex();
await es.createIndex();
const s = new Store();
await getRawData().then(async docs => Promise.all(docs.map(doc => indexDoc(s, doc))))

console.log(await s.search("drama scary horror mississippi"));
console.log(s.docCount);