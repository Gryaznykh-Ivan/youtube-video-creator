import fetch from 'node-fetch';
import { Builder, Capabilities, By } from 'selenium-webdriver';
import chromedriver from 'chromedriver';
import chrome from 'selenium-webdriver/chrome';

const getVideoWithoutWatermark = async (video_id: string): Promise<string | null> => {
    let response = await fetch(`https://api.tiktokv.com/aweme/v1/multi/aweme/detail/?aweme_ids=%5B${video_id}%5D`);

    try {
        let data: any = await response.json();
        if (data["aweme_details"] === undefined) return null;

        return data["aweme_details"][0]["video"]["play_addr"]["url_list"][0] as string;
    } catch (e) {
        return null;
    }
}

const getVideoIdsList = (sources: string[], counts: number[]): Promise<Array<string>> => {
    return new Promise(async (resolve, reject) => {
        const service = new chrome.ServiceBuilder(chromedriver.path).build();
        chrome.setDefaultService(service);

        const driver = await new Builder().withCapabilities(Capabilities.chrome()).build();
        try {
            const result: Array<string> = [];

            for (let [i, source] of sources.entries()) {
                await driver.get('https://www.tiktok.com/@' + source);
    
                for (let _ of new Array(Math.floor(counts[i] / 30))) {
                    await driver.sleep(3000);
                    await driver.executeScript('window.scrollTo(0,document.querySelector("body").scrollHeight);');
                }
                
                await driver.sleep(3000);
    
                const ids = await driver.findElements(By.js(() => {
                    let links = document.querySelectorAll('a');
                    return Array.from(links).filter((link) => link.href.indexOf(`/video/`) === -1 ? false : true);
                }));
    
                for (let [index, id] of ids.entries()) {
                    if (index === counts[i]) break;
    
                    const href = await id.getAttribute('href');
                    result.push(href.split('/').at(-1) as string);
                }
            }

            await driver.quit();
            
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    });
}

export {
    getVideoIdsList, getVideoWithoutWatermark
}