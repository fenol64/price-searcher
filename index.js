const AmazonController = require('./src/AmazonController');
const MercadoLivreController = require('./src/MercadoLivreController');

const products = [
    "Whey Protein",
]

const main = async () => {
    for (const product of products) {
        // await new AmazonController().getProductsByUrl(product);
        await new MercadoLivreController().getProductsByUrl(product);
    }
}

main();
