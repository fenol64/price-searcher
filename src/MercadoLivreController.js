const Cheerio = require("cheerio");
const rp = require("request-promise");


class MercadoLivreController {
    constructor() {
        this.base_url = "https://lista.mercadolivre.com.br";
        this.crawler_starts = 0;
    }

    async getProductsByUrl(product_name) {
        try {
            console.log("Getting product data from Mercado Livre for: " + product_name);

            const url = this.base_url + "/" + product_name.replace(" ", "-");
            const html_request = await rp(url);
            const $ = Cheerio.load(html_request);

            const products_data = [];

            $(".ui-search-layout__item").each((index, element) => {


                const product_image = $(element).find(".ui-search-result-image__element .shops__image-element").attr("src");
                const product_name = $(element).find(".ui-search-item__title").text();
                const product_url = $(element).find(".ui-search-link").attr("href");



                const product_price_whole = $(element).find(`.price-tag-amount > .price-tag-fraction`).first().text();
                const product_price_fraction_separador = $(element).find(" .price-tag-amount > .price-tag-decimal-separator").first().text();
                const product_price_fraction = $(element).find(" .price-tag-amount > .price-tag-cents").first().text();
                const product_discount = $(element).find(`.ui-search-price__second-line > .ui-search-price__discount`).text();

                const product_data = {
                    name: product_name,
                    price: product_price_whole + product_price_fraction_separador + product_price_fraction,
                    discount: product_discount.replace("&nbsp;", "") ?? null,
                    image: product_image,
                    url: product_url,

                }

                if (
                    (product_data.name != "")
                ) products_data.push(product_data);

            });

            console.log("Products data from Mercado Livre: " + products_data.length);
            console.log(products_data)



        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = MercadoLivreController;