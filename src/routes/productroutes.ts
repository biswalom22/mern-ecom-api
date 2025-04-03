import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getColors,
  getBrands,
  getFilteredProducts,
} from '../controllers/productController';

const router = express.Router();

router.post('/products', createProduct);

router.get('/products/categories', getCategories);

router.get('/products/colors', getColors);

router.get('/products/brands', getBrands);

router.get('/products', getFilteredProducts);

router.get('/products', getProducts);

router.get('/products/:id', getProductById);

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);

export default router;