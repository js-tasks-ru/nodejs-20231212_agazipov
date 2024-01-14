const Category = require('../models/Category');
const Product = require('../models/Product');
const mapCategory = require('../mappers/category');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  // const resultFind = await Category.find();
  // const result = resultFind.map((categories) => {
  //   return mapCategory(categories);
  // });
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const findProducts = await Product.find({subcategory: subcategory});

  ctx.body = {product: findProducts};
};

module.exports.productList = async function productList(ctx, next) {
  console.log(ctx.body);
  ctx.body = {};
};

module.exports.productById = async function productById(ctx, next) {
  ctx.body = {};
};

