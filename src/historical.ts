import {getLocationData, BaseFetcher, writeToPath} from "./common.js";

import { default as axios } from 'axios';
import pLimit from 'p-limit';
import * as path from 'path';

type HistoricalMonitor = {
    files: object
}

export class HistoricalFetcher implements BaseFetcher {
    outputDest: string;
    concurrencyLimit: number;
    startUrl = "https://www.dosairnowdata.org/dos/AllPostsHistorical.json";

    async fetch(): Promise<void> {
        // get the historical data from API
        // parse the response into a list of URLs to CSVs
        const locations: object = await getLocationData(this.startUrl);
        let dataUrls = [];
        for (const location in locations) {
            const monitors: HistoricalMonitor[] = locations[location].monitors;
            for (const monitor of monitors) {
                dataUrls = dataUrls.concat(Object.values(monitor.files));
            }
        }

        // set concurrency limit
        const limit = pLimit(this.concurrencyLimit);

        // define what to do with each URL
        const inputs = dataUrls.map(url => limit(async () => {
            console.log(`Downloading ${url}`);
            const response = await axios.get(url);

            const {data, request} = response;
            const filePath = path.join(this.outputDest, request.path);

            await writeToPath(data, filePath);
        }));

        // wait until all promises are returned
        await Promise.all(inputs);
    }

    constructor(outputDest: string = "./output",
                concurrencyLimit: number = 5) {
        this.outputDest = outputDest;
        this.concurrencyLimit = concurrencyLimit;
    }
}