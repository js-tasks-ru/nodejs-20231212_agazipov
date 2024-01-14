const mongoose = require('mongoose');
mongoose.set('strictQuery', true)

async function main() {
  const subCategorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
  });

  const categorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    subcategories: [subCategorySchema],
  });
  const productSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    images: [String],

  });
  const Categories = mongoose.model('Category', categorySchema)
  const Product = mongoose.model('Product', productSchema)
  await mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'testDB'
  },
    (err) => {
      if (err) console.log(err)
      else console.log("mongdb is connected");
    })
    
    const category = await Categories.create({
      title: 'testCategories222',
      subcategories: [{
        title: 'Subcategory1',
      },
      {
        title: 'Subcategory2',
      }]
    })
  await Product.create({
    title: 'Product1',
    description: 'Description1',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[0].id,
    images: ['image1'],
  })
}

main();