const rp = require("request-promise");
const cheerio = require('cheerio');

class AmazonController {

    constructor() {
        this.base_url = "https://www.amazon.com.br";
        this.crawler_starts = 6;
    }

    async getProductsByUrl(product_name) {
        try {
            console.log("Getting product data from Amazon for: " + product_name);

            const url = this.base_url + "/s?k=" + product_name.replace(" ", "+");
            const html_request = await rp(url);
            const $ = cheerio.load(html_request);

            const products_data = [];

            $(".s-search-results > .s-result-item").each((index, element) => {

                const product_image = $(element).find(".s-image").attr("src");
                const product_name = $(element).find(".a-size-base-plus.a-color-base.a-text-normal").text();
                const product_data_asin = $(element).attr("data-asin");

                const product_price_whole = $(element).find(".a-price-whole").text();
                const product_price_fraction = $(element).find(".a-price-fraction").text();
                const product_discount = $(element).find(`.a-text-price > .a-offscreen`).text();

                const product_data = {
                    name: product_name,
                    price: product_price_whole + product_price_fraction,
                    discount: product_discount.replace("&nbsp;", "") ?? null,
                    image: product_image,
                    asin: product_data_asin,
                }

                if (
                    (product_data.name != "") &&
                    (product_data.asin != "")
                ) products_data.push(product_data);

            });

            return products_data;


        } catch (error) {
            console.log(error);

        }

    }
}

module.exports = AmazonController;