import { waitForSelector } from './util.js';
import home from './home/home.js';
import pack7 from './Party Pack 7/pack7.js';

export default function register() {
    return new Promise(async (resolve, reject) => {
        await waitForSelector("#button-join");
        home();
        pack7();
        resolve();
    });
}