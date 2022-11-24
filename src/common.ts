import { default as axios } from 'axios';

import * as fs from 'fs';
import * as path from 'path';

export interface BaseFetcher {
    startUrl: string;
    fetch(): Promise<void>;
}

export const writeToPath = async(data: any, outputDest: string): Promise<string> => {
    const folderPath = path.dirname(outputDest)
    await fs.promises.mkdir(folderPath, { recursive: true }).catch(console.error);
    await fs.promises.writeFile(outputDest, data).catch(console.error);

    console.log("Data written to", outputDest);
    return Promise.resolve(outputDest);
}


export const getLocationData = async (indexUrl: string): Promise<object> => {

    // get the data from API
    const res = await axios.get(indexUrl);

    // filter objects that has no `monitors` attribute
    const locations: Array<any> = Object.entries(res.data).filter(item => item[1].hasOwnProperty("monitors"));

    // convert filtered list back to object
    return Object.fromEntries(locations);

}