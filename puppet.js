const puppeteer = require('puppeteer');


const userAgent = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 OPR/56.0.3051.52',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16D57',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Linux; Android 6.0.1; Redmi 4A Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.116 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 7.1.2; Redmi 4A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36'
]



function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Puppet {
    constructor({ puppetOptions, targetUrl, }) {
        this.puppetOptions = puppetOptions;
        this.targetUrl = targetUrl;
        this.initStatus = false;
    }

    async init() {
        console.log('Init started');
        this.initStatus = true;
        this.browser = await puppeteer.launch({ 
            ...this.puppetOptions,
            args: [
                '--window-size=1920,1080',
                '--no-sandbox',
              ],
            defaultViewport: null,
        }).catch( e =>  { throw(e) });;
        
        this.page = await this.browser.newPage().catch( e =>  { throw(e) });
        await this.page.setUserAgent(userAgent[randomNumber(0,userAgent.length - 1)]);
        await this.page.goto(this.targetUrl, {
        //    waitUntil: 'networkidle2'
        }).catch( e =>  { throw(e) });;
    }

    async inputText(selector, text) {
        
        await this.page.waitForSelector(`input[${selector}]`);
        
        await this.page.focus(`input[${selector}]`);
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        await this.page.keyboard.press('Backspace');

        await this.page.type(`input[${selector}]`, text, {delay: randomNumber(100,200)})
        console.log(selector,text);
    }
    
    async wait(time) {
        await this.page.waitForTimeout(time).catch( e =>  { throw(e) });
    }

    async enterWord(selector,text) {
        await this.page.waitForSelector(`.plus-icon#${selector}`,{visible: true});                        

        const word = await this.page.$(`.plus-icon#${selector}`);            
        await word.click();
        await this.inputText('id=prompt-input',text);
        
        await this.page.click('[value="Ok"]').catch( e =>  { throw(e) });

    }

    

    async close() {
        //await this.page.close().catch( e =>  { throw(e) });
        const pages = await this.browser.pages();
        await Promise.all(pages.map((page) => page.close()));
        await this.browser.close().catch( e =>  { throw(e) });
    }
}


module.exports =  Puppet;