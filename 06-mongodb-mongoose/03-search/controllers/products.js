const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  const serchProducts = await Product.find({$text: {$search: `${query}`}});
  const result = serchProducts.map((product) => {
    return mapProduct(product);
  });
  ctx.body = {products: result};
};
