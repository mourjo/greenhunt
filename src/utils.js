import fs from 'fs';
import readline from 'readline';
export default async function getRawData() {
    let lines = fs.readFileSync("datasets/IMDB_movie_details.json", "utf8").split("\n");
    return lines
        .filter(line => line.length > 0)
        .map(line => {
            let movieData = JSON.parse(line);
            return { text: movieData.plot_synopsis, id: movieData.id, name: movieData.name };
        });
}
async function enrichMovies() {
    // cat datasets/IMDB_movie_details_raw.json  | bb --stream -i '(println (:movie_id (json/parse-string  *input* true)))' | sort | uniq > /tmp/interestingids.txt
    let mymovieIds = new Set(fs.readFileSync("datasets/interestingids.txt", "utf8").split("\n").map(id => id.replace("/", "")));

    const fileStream = fs.createReadStream("datasets/title.basics.tsv");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    const idToNames = new Map();

    for await (const line of rl) {
        let fields = line.split("\t");
        let id = fields[0].replace("/", "");
        let name = fields[2];
        if (mymovieIds.has(id)) {
            idToNames.set(id, name);
        }
    }

    let mymovies = fs.readFileSync("datasets/IMDB_movie_details.json", "utf8").split("\n").filter(line => line.length > 0).map(line => JSON.parse(line));
    let enrichedMovies = mymovies.map(movie => movie.name = idToNames.get(movie.movie_id.replace("/", "")));
    fs.writeFileSync("/tmp/anotherfile.txt", mymovies.map(movie => JSON.stringify(movie)).join("\n"));

}

export async function enrichIDs() {
    let newcontents = fs.readFileSync("datasets/IMDB_movie_details.json", "utf8")
        .split("\n")
        .map(doc => {
            let parsed = JSON.parse(doc);
            parsed.id = (parsed.movie_id + "_" + parsed.name).replace(/ /gi, '_').replace(/[^a-z0-9_]/gi, '');
            return JSON.stringify(parsed);
        }).join("\n");
    fs.writeFileSync("datasets/IMDB_movie_details_new_ids.json", newcontents);
}