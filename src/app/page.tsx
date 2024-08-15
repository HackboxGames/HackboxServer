'use client'

import { Button } from "@nextui-org/react";
import { useEffect } from "react";

function jackboxLoaded() {
    console.log("Hello, World!");

    const jackbox = document.getElementById("jackbox") as HTMLIFrameElement;
    
    // add /jackbox to the URL
    const head = jackbox.contentDocument?.getElementsByTagName("head")[0];
    const links = head?.getElementsByTagName("link");
    for (let i = 0; i < links?.length; i++) {
        const link = links[i];
        link.href = "https://jackbox.tv" + new URL(link.href).pathname;
    }
    const scripts = head?.getElementsByTagName("script");
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