import * as UTIL from '../util.js';

export default function removeHackboxLoading() {
    const frame = UTIL.getFrame();
    const loading = frame.find("#hackbox-loader").first();
    loading.css("display", "none");
}