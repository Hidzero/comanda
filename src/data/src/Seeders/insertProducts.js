import connectDB from '../../database.js';  // Função de conexão com o banco
import Product from '../Models/Product.js';

import { combosData, porcoesSeparadasData, meiaPorcao, churrascoNoPalito, cerveja, refrigerante, doses, doces, sorvetes, pf,  outros} from '../../../ui/components/menuData.js';  // Supondo que esses dados estejam exportados no menuData.js

const seedProducts = async () => {

  try {
    await connectDB();  // Conectar ao banco de dados

    // Limpar os produtos existentes (opcional)
    await Product.deleteMany();

    // Inserir os produtos do menu
    await Product.insertMany([
      ...combosData.map(combo => ({ ...combo, category: 'combo' })),
      ...porcoesSeparadasData.map(porcao => ({ ...porcao, category: 'porcao' })),
      ...meiaPorcao.map(porcao => ({ ...porcao, category: 'meia porcao' })),
      ...churrascoNoPalito.map(item => ({ ...item, category: 'churrasco' })),
      ...cerveja.map(cerveja => ({ ...cerveja, category: 'cerveja' })),
      ...refrigerante.map(refri => ({ ...refri, category: 'refrigerante' })),
      ...doses.map(dose => ({ ...dose, category: 'doses' })),
      ...doces.map(doce => ({ ...doce, category: 'doces' })),
      ...sorvetes.map(sorvete => ({ ...sorvete, category: 'sorvetes' })),
      ...pf.map(pf => ({ ...pf, category: 'pf' })),
      ...outros.map(item => ({ ...item, category: 'outros' })),
    ]);

    console.log('Produtos inseridos com sucesso!');
    process.exit();
  } catch (error) {
    console.error('Erro ao inserir os produtos:', error);
    process.exit(1);
  }
};

seedProducts();
