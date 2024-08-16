export default function waitForSelector(selector: string, target: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve) => {
        if (target.querySelector(selector)) {
            resolve(target.querySelector(selector) as HTMLElement);
            return;
        }
        const observer = new MutationObserver(() => {
            if (target.querySelector(selector)) {
                observer.disconnect();
                resolve(target.querySelector(selector) as HTMLElement);
            }
        });
        observer.observe(target, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        })
    });
}