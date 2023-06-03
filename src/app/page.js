'use client'

import { useEffect } from 'react';
import home from '../functions/home/home.js';

async function enableHackbox() {
  home();
}

export default function Hackbox() {
  useEffect(() => {
    document.getElementById("jackbox").src = "/proxy/jackbox/";
  });
  return (
    <iframe id="jackbox" allow="camera;microphone" className="fixed inset-0 w-full h-full" onLoad={enableHackbox}/>
  )
}
