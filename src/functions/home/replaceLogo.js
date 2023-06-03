import * as UTIL from '../util.js';

export default function replaceLogo() {
    UTIL.getFrame().find(".logo").first().css("background-image", "url('/hbassets/hackbox.png')");
}