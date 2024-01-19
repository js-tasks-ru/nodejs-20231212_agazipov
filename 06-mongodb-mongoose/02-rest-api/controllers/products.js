const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const findProducts = await Product.find({subcategory: subcategory});
  const productsResult = findProducts.map((product) => {
    return mapProduct(product);
  });

  ctx.body = {products: productsResult};
};

module.exports.productList = async function productList(ctx, next) {
  const findProducts = await Product.find();
  const productsResult = findProducts.map((product) => {
    return mapProduct(product);
  });
  ctx.body = {products: productsResult};
};

module.exports.productById = async function productById(ctx, next) {
  const pathId = ctx.path.substr(ctx.path.lastIndexOf('/') + 1);
  if (!ObjectId.isValid(pathId)) return ctx.status = 400;
  const findProduct = await Product.findById(pathId);
  if (!findProduct) return ctx.status = 404;
  const productResult = mapProduct(findProduct);
  ctx.body = {product: productResult};
};

