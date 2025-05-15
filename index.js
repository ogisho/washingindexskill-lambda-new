const Alexa = require('ask-sdk-core');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const url = 'https://tenki.jp/indexes/cloth_dried/3/17/4610/14133/'; // 川崎市中原区 洗濯指数ページ

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        let message = '洗濯指数を取得できませんでした。';

        try {
            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            });

            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

            // 乾き具合コメントを取得
            const text = await page.$eval('.indexes-weather-wrap .indexes-icon-box span', el => el.textContent.trim());
            await browser.close();

            message = `中原区の洗濯指数は「${text}」です。`;
        } catch (error) {
            console.error(`スクレイピングエラー: ${error.message}`);
            message = `データ取得時にエラーが発生しました。`;
        }

        return handlerInput.responseBuilder
            .speak(message)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler
    )
    .lambda();