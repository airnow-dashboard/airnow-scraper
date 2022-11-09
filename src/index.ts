type Monitor = {
    files: object
}

import { default as axios } from 'axios';
import pLimit from 'p-limit';
import * as fs from 'fs';
import * as path from 'path';

const indexUrl = "https://www.dosairnowdata.org/dos/AllPostsHistorical.json";
const concurrencyLimit = 5;
const outputFolder = "./output";

const fetch = async () => {
    // get the historical data from API
    const res = await axios.get(indexUrl);

    // parse the response into a list of URLs to CSVs
    const locations: object = res.data;
    let dataUrls = [];
    for (const location in locations) {
        const monitors: Monitor[] = locations[location].monitors;
        for (const monitor of monitors) {
            dataUrls = dataUrls.concat(Object.values(monitor.files));
        }
    }

    // set concurrency limit
    const limit = pLimit(concurrencyLimit);

    // define what to do with each URL
    const inputs = dataUrls.map(url => limit(async () => {
        console.log(`Downloading ${url}`);
        const response = await axios.get(url);

        const {data, request} = response;
        const filePath = outputFolder + request.path;
        const folderPath = path.dirname(filePath)

        await fs.promises.mkdir(folderPath, { recursive: true }).catch(console.error);
        await fs.promises.writeFile(filePath, data).catch(console.error);
        console.log("Done.");
    }));

    // wait until all promises are returned
    await Promise.all(inputs);
}

fetch();
