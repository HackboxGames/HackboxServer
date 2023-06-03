'use client'

const $ = require("jquery");

export default function waitForSelector(selector) {
    return new Promise(resolve => {

        const frame = document.getElementById("jackbox");
        
        const body = frame.contentDocument.body || frame.contentWindow.document.body;

        console.log(body);

        if (body.querySelector(selector)) {
            return resolve(body.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            console.log(body);
            if (body.querySelector(selector)) {
                resolve(body.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(body, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });
    });
}