import {HistoricalFetcher} from "./historical.js";
import {DailyFetcher} from "./daily.js";
import {BaseFetcher} from "./common.js";

const lastArg: string = process.argv.slice(-1)[0];
let fetcher: BaseFetcher = null;
switch (lastArg) {
    case 'current': {
        fetcher = new DailyFetcher();
        break;
    }
    case 'historical': {
        fetcher = new HistoricalFetcher();
        break;
    }
    default: {
        throw Error("unknown command");
    }
}

if (fetcher) {
    fetcher.fetch();
}