"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoWithoutWatermark = exports.getVideoIdsList = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const selenium_webdriver_1 = require("selenium-webdriver");
const chromedriver_1 = __importDefault(require("chromedriver"));
const chrome_1 = __importDefault(require("selenium-webdriver/chrome"));
const getVideoWithoutWatermark = (video_id) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, node_fetch_1.default)(`https://api.tiktokv.com/aweme/v1/multi/aweme/detail/?aweme_ids=%5B${video_id}%5D`);
    try {
        let data = yield response.json();
        if (data["aweme_details"] === undefined)
            return null;
        return data["aweme_details"][0]["video"]["play_addr"]["url_list"][0];
    }
    catch (e) {
        return null;
    }
});
exports.getVideoWithoutWatermark = getVideoWithoutWatermark;
const getVideoIdsList = (sources, counts) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const service = new chrome_1.default.ServiceBuilder(chromedriver_1.default.path).build();
        chrome_1.default.setDefaultService(service);
        const driver = yield new selenium_webdriver_1.Builder().withCapabilities(selenium_webdriver_1.Capabilities.chrome()).build();
        try {
            const result = [];
            for (let [i, source] of sources.entries()) {
                yield driver.get('https://www.tiktok.com/@' + source);
                for (let _ of new Array(Math.floor(counts[i] / 30))) {
                    yield driver.sleep(3000);
                    yield driver.executeScript('window.scrollTo(0,document.querySelector("body").scrollHeight);');
                }
                yield driver.sleep(3000);
                const ids = yield driver.findElements(selenium_webdriver_1.By.js(() => {
                    let links = document.querySelectorAll('a');
                    return Array.from(links).filter((link) => link.href.indexOf(`/video/`) === -1 ? false : true);
                }));
                for (let [index, id] of ids.entries()) {
                    if (index === counts[i])
                        break;
                    const href = yield id.getAttribute('href');
                    result.push(href.split('/').at(-1));
                }
            }
            yield driver.quit();
            return resolve(result);
        }
        catch (e) {
            return reject(e);
        }
    }));
};
exports.getVideoIdsList = getVideoIdsList;
