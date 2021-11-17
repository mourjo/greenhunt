import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export default async function getRawData() {
    let xml = await fetch('https://otee.dev/feed.xml',
        {
            headers: { 'Content-Type': 'application/xml' }
        });
    xml = await xml.text();

    const parsed = new JSDOM(xml, {
        contentType: "text/xml",
    });
    let entries = parsed.window.document.getElementsByTagName("entry");
    const data = [];
    for (let i = 0; i < entries.length; i++) {
        try {
            let raw = entries[i].getElementsByTagName("content")[0].innerHTML;
            data.push(raw);
        } catch (e) { }

    }
    return data;
}