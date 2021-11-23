import fetch from "node-fetch";
/*
curl -X PUT "localhost:9200/test?pretty" -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "_doc" : {
            "properties" : {
                "field1" : { "type" : "text" }
            }
        }
    }
}
'
*/
const INDEX_NAME = "greenhunt";
export async function createIndex() {
    return await fetch(`http://localhost:9201/${INDEX_NAME}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            settings: {
                number_of_shards: 1
            },
            mappings: {
                properties: {
                    plot: {
                        type: "text"
                    }
                }
            }
        })
    }).then(r => r.json())
}


/*
curl -XPOST "http://es01:9200/test/_doc" -H 'Content-Type: application/json' -d'
{
  "field1": "i am a value"
}'
*/
export async function insertDoc(id: string, text: string, retries = 5) {
    try {
        return await fetch(`http://localhost:9201/${INDEX_NAME}/_doc/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                plot: text
            })
        }).then(r => r.json())
    } catch (e) {
        if (retries <= 0) {
            throw e;
        }
        return await new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    let res = await insertDoc(id, text, retries - 1);
                    resolve(res);
                } catch (err) {
                    reject(err);
                }
            }, (Math.random() * 1000) | 0)
        })
    }
}


/*
curl -X DELETE "localhost:9200/my-index"
*/
export async function deleteIndex() {
    return await fetch(`http://localhost:9201/${INDEX_NAME}`, { method: "DELETE" }).then(r => r.json())
}

export type ESResult = {
    id: string,
    doc: string,
    score: number
}

export async function search(text: string, limit = 5): Promise<ESResult[]> {
    let results: any = await fetch(`http://localhost:9201/${INDEX_NAME}/_search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: {
                match: {
                    plot: text
                }
            },
            size: limit
        })
    }).then(r => r.json());

    return results.hits.hits.map((hit: any) => {
        return {
            id: hit["_id"],
            doc: hit["_source"].plot.substring(0, 50) + "...",
            score: hit["_score"]
        };
    });
}

export async function refresh() {
    await fetch(`http://localhost:9201/${INDEX_NAME}/_refresh`);
}


/*
curl -X POST "localhost:9200/_bulk?pretty" -H 'Content-Type: application/json' --data-binary'
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }
'
*/
export async function bulkInsert(docs: any[]) {

    let body = docs.map(doc =>
        `{"index":{"_index":"${INDEX_NAME}", "_id":"${doc.id}"}}\n${JSON.stringify({ plot: doc.text })}`
    ).join("\n");

    return await fetch(`http://localhost:9201/_bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body + "\n"
    }).then(r => r.json())
}

