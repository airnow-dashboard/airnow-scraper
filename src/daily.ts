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
        const data = JSON.stringify(locations);
        await writeToPath(data, path.join(this.outputDest, 'AllPosts24Hour.json'));
        return Promise.resolve(undefined);
    }

    constructor(outputDest: string = "./output/dos/current") {
        this.outputDest = outputDest;
    }
}