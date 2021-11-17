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
        return this.docIdx.get(docId);
    }

    getAll() {
        return Array.from(this.docIdx.entries()).map(entry => { return { id: entry[0], doc: entry[1] }; });
    }

    put(document) {
        const id = ++this.counter;
        const words = document.toLowerCase().split(/[\s.,;]+/);
        this.wordCount += words.length;
        this.docCount++;
        this.docIdx.set(id, words);
        this.docTermFreq.set(id, new Map());

        for (let word of words) {

            // update IDF
            let numDocsWithWord = 0;
            if (this.docFreq.has(word)) {
                numDocsWithWord = this.docFreq.get(word);
            }
            this.docFreq.set(word, numDocsWithWord + 1);


            // update TF
            let previousTF = 0;
            if (this.docTermFreq.get(id).has(word)) {
                previousTF = this.docTermFreq.get(id).get(word);
            }
            this.docTermFreq.get(id).set(word, previousTF + 1);
        }
        return id;
    }

    async search(query) {
        const words = query.toLowerCase().split(/[\s.,;]+/);
        const result = await Promise.all(this.getAll().map(entry => this.scoreDoc(entry, words)));
        return result.filter(scoredDoc => scoredDoc.score > 0).sort((doc1, doc2) => doc2.score - doc1.score);
    }

    async scoreDoc({ id: docId, doc: doc }, queryWords) {
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
            doc: doc
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
        return this.docIdx.get(docId).length;
    }

    idf(word) {
        if (this.docFreq.has(word)) {
            let nqi = this.docFreq.get(word);
            return Math.log(1 + (this.docCount - nqi + 0.5) / (nqi + 0.5));
        }
        return 0;
    }

}

const s = new Store();

s.put("this is a doc");
s.put("this is another mighty long doc");
s.put("the mighty king of wostershier");
s.put("somewhere in the world there is peace of mind");

console.log(await s.search("this king"));
console.log(await s.search("there is a wonderful king somewhere in wostershier"));