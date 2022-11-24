import {getLocationData, BaseFetcher, writeToPath} from "./common.js";

import * as path from 'path';

type DailyMonitor = {
    parameter: string,
    beginTimeLT: string,
    concUnit: string,
    aqi: number[],
    aqiCat: number[],
    conc: number[],
    rss: string,
    twitter?: string
}

export class DailyFetcher implements BaseFetcher {
    outputDest: string;
    startUrl = "https://www.dosairnowdata.org/dos/AllPosts24Hour.json";

    getPathFromRss(monitor: DailyMonitor): string {
        const rssPath: string = monitor.rss;
        // get last two splits from RSS feed
        return rssPath.split("/").slice(-2).join("/")
    }

    async fetch(): Promise<void> {

        const locations = await getLocationData(this.startUrl);
        const patternToMatch = /\.xml/g;

        for (const key in locations) {
            const monitors: DailyMonitor[] = locations[key].monitors;
            for (const monitor of monitors) {
                const outputFilename: string = path.join(
                    this.outputDest,
                    this.getPathFromRss(monitor).replace(patternToMatch, ".json")
                )
                // serialize JSON data
                const data = JSON.stringify(monitor);
                await writeToPath(data, outputFilename);
            }
        }
        return Promise.resolve(undefined);
    }

    constructor(outputDest: string = "./output/dos/current") {
        this.outputDest = outputDest;
    }
}