import Product from '../Models/Product.js';

class ProductRepository {
  async getAllProducts() {
    return await Product.find();
  }

  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async updateProduct(productId, productData) {
    return await Product.findByIdAndUpdate(productId, productData, { new: true });
  }

  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  }
}

const productRepository = new ProductRepository();
export default productRepository;