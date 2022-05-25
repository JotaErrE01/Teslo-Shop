import mongoose, { Schema, Model, model } from 'mongoose';
import { IProduct } from '../interfaces/Products';

const productSchema = new Schema({
  description: { type: String, required: true },
  images: { type: [String] },
  inStock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  sizes: {
    type: [String],
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      message: '{VALUE} No es una talla válida'
    }
  },
  slug: { type: String, required: true, unique: true },
  tags: { type: [String] },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: {
      values: ['shirts', 'pants', 'hoodies', 'hats'],
      message: '{VALUE} No es un tipo válido'
    }
  },
  gender: {
    type: String,
    enum: {
      values: ['men', 'women', 'kid', 'unisex'],
      message: '{VALUE} No es un género válido'
    }
  },
}, {
  // Para que mongoose cree el createdat y updatedat
  timestamps: true
});

// Para hacer la busquedad tipo includes en la base de datos
productSchema.index({ title: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;
