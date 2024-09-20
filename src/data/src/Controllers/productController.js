import productRepository from '../Repositories/productRepository.js';

export async function create(req, res) {
    try {
        const product = await productRepository.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar produto.' });
    }
}

export async function getAll(_, res) {
    try {
        const products = await productRepository.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await productRepository.updateProduct(id, req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
}

export async function deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await productRepository.deleteProduct(id);
      res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar produto.' });
    }
}

