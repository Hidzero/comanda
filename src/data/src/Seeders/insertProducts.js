import connectDB from '../../database.js';  // Função de conexão com o banco
import Product from '../Models/Product.js';

import { combosData, porcoesSeparadasData, meiaPorcao, churrascoNoPalito, naoAlcoolicos, drinksProntos, cerveja600ml, longNeck} from '../../../ui/components/menuData.js';  // Supondo que esses dados estejam exportados no menuData.js

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
      ...naoAlcoolicos.map(bebida => ({ ...bebida, category: 'nao alcoolico' })),
      ...drinksProntos.map(drink => ({ ...drink, category: 'drinks prontos' })),
      ...cerveja600ml.map(cerveja => ({ ...cerveja, category: 'cerveja 600ml' })),
      ...longNeck.map(cerveja => ({ ...cerveja, category: 'long neck' }))
    ]);

    console.log('Produtos inseridos com sucesso!');
    process.exit();
  } catch (error) {
    console.error('Erro ao inserir os produtos:', error);
    process.exit(1);
  }
};

seedProducts();
