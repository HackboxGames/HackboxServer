'use client'

import { Button } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { createRoot, hydrateRoot } from 'react-dom/client';
import { waitForSelector } from "@public/scripts/util";

function redirect(jackbox: HTMLIFrameElement) {
    const head = jackbox.contentDocument?.getElementsByTagName("head")[0];
    const links = head?.getElementsByTagName("link");
    if (links) {
        for (let i = 0; i < links?.length; i++) {
            const link = links[i];
            link.href = "https://jackbox.tv" + new URL(link.href).pathname;
        }
    }
    const scripts = head?.getElementsByTagName("script");
    if (scripts) {
        for (let i = 0; i < scripts?.length; i++) {
            const script = scripts[i];
            let newScript = document.createElement("script");
            if (script.src.startsWith("/")) {
                newScript.src = "https://jackbox.tv" + script.src;
            } else if (script.src) {
                newScript.src = "https://jackbox.tv" + new URL(script.src).pathname;
            }
            newScript.innerHTML = script.innerHTML;
            script.replaceWith(newScript);
        }
    }
}

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
    console.log("Hello, World!");

    const jackbox = document.getElementById("jackbox") as HTMLIFrameElement;
    const app = jackbox.contentDocument?.getElementById("app");

    if (!jackbox) {
        return;
    }

    if (!app) {
        return;
    }

    redirect(jackbox);
    
    await waitForSelector("#button-join", app);
    
    addCSSGlobals(jackbox);
    
    addUserProfile(app);
}

export default function RootPage() {
    return (
        <iframe
            id="jackbox"
            src="/proxy/jackbox/"
            allow="camera;microphone"
            className="fixed inset-0 w-full h-full"
            onLoad={jackboxLoaded}
        />
    )
}