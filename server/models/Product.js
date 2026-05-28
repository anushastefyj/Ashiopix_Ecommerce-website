import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add product price'],
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      default: 0.0,
    },
    category: {
      type: String,
      required: [true, 'Please add product category'],
    },
    brand: {
      type: String,
      required: [true, 'Please add product brand'],
    },
    image: {
      type: String,
      required: [true, 'Please add main product image URL'],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Please add product stock quantity'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
