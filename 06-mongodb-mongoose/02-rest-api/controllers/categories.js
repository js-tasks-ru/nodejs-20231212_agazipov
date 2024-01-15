const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const resultFind = await Category.find();
  const result = resultFind.map((categories) => {
    return mapCategory(categories);
  });
  ctx.body = {categories: result};
};
