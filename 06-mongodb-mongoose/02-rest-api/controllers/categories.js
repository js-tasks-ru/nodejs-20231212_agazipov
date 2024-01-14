const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const resultFind = await Category.find();
  console.log('resultFind', resultFind);
  const result = resultFind.map((categories) => {
    return mapCategory(categories);
  });
  ctx.body = {categories: result};
};
