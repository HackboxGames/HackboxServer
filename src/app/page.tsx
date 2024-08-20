'use client'

import { Button } from "@nextui-org/react";
import { createRoot } from 'react-dom/client';
import { waitForSelector } from "@public/scripts/util";
import { useEffect } from "react";

function addCSSGlobals(jackbox: HTMLIFrameElement) {
    const head = jackbox.contentDocument?.getElementsByTagName("head")[0];
    const link = document.createElement("link");
    link.href = "/styles/globals.css";
    link.rel = "stylesheet";
    head?.appendChild(link);
}

function addUserProfile(app: HTMLElement) {
    const accessory = app.getElementsByClassName("accessory").item(1);

    console.log(app.getElementsByClassName("accessory"));
    console.log(accessory);

    if (!accessory) {
        return;
    }

    let root = createRoot(accessory)

    root.render(
        <div className="flex flex-row items-center">
            <Button>Profile</Button>
        </div>
    )
}


async function jackboxLoaded() {

    // SOMETHING IS WRONG WITH THIS CODE
    // Rare case where waitForSelector never resolves
    // TODO: 
    // fix waitForSelector instead of reusing code from old project
    // fix mobile sometimes firing this event twice, causing the mods to be undone and for react to yell at me

    const jackbox = document.getElementById("jackbox") as HTMLIFrameElement;
    const app = jackbox.contentDocument?.getElementById("app");

    if (!app) {
        return;
    }
    
    await waitForSelector("#button-join", app);
    
    addCSSGlobals(jackbox);
    
    addUserProfile(app);
}

export default function RootPage() {
    return (
        <iframe
            id="jackbox"
            title="Jackbox"
            src="/proxy/jackbox"
            allow="camera;microphone"
            className="fixed inset-0 w-full h-full"
            onLoad={jackboxLoaded}
        />
    )
}