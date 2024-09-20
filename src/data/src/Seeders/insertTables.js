import connectDB from '../../database.js';  // Conexão com o MongoDB
import Table from '../Models/Table.js';  // Modelo de Mesa (Table)

// Função para gerar as mesas
const seedTables = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    // Apaga todas as mesas existentes para evitar duplicatas
    console.log('Conectando ao banco de dados...');
    await Table.deleteMany();

    // Dados de mesas que você quer adicionar (exemplo: 10 mesas)
    const tables = [
      { tableNumber: 1, status: 'livre' },
      { tableNumber: 2, status: 'livre' },
      { tableNumber: 3, status: 'livre' },
      { tableNumber: 4, status: 'livre' },
      { tableNumber: 5, status: 'livre' },
      { tableNumber: 6, status: 'livre' },
      { tableNumber: 7, status: 'livre' },
      { tableNumber: 8, status: 'livre' },
      { tableNumber: 9, status: 'livre' },
      { tableNumber: 10, status: 'livre' },
      { tableNumber: 11, status: 'livre' },
      { tableNumber: 12, status: 'livre' },
      { tableNumber: 13, status: 'livre' },
      { tableNumber: 14, status: 'livre' },
      { tableNumber: 15, status: 'livre' },
      { tableNumber: 16, status: 'livre' },
      { tableNumber: 17, status: 'livre' },
      { tableNumber: 18, status: 'livre' },
      { tableNumber: 19, status: 'livre' },
      { tableNumber: 20, status: 'livre' },
      { tableNumber: 21, status: 'livre' },
      { tableNumber: 22, status: 'livre' },
      { tableNumber: 23, status: 'livre' },
      { tableNumber: 24, status: 'livre' },
      { tableNumber: 25, status: 'livre' },
      { tableNumber: 26, status: 'livre' },
      { tableNumber: 27, status: 'livre' },
      { tableNumber: 28, status: 'livre' },
      { tableNumber: 29, status: 'livre' },
      { tableNumber: 30, status: 'livre' },
      { tableNumber: 31, status: 'livre' },
      { tableNumber: 32, status: 'livre' },
      { tableNumber: 33, status: 'livre' },
      { tableNumber: 34, status: 'livre' },
      { tableNumber: 35, status: 'livre' },
      { tableNumber: 36, status: 'livre' },
      { tableNumber: 37, status: 'livre' },
      { tableNumber: 38, status: 'livre' },
      { tableNumber: 39, status: 'livre' },
      { tableNumber: 40, status: 'livre' },
      { tableNumber: 41, status: 'livre' },
      { tableNumber: 42, status: 'livre' },
      { tableNumber: 43, status: 'livre' },
      { tableNumber: 44, status: 'livre' },
      { tableNumber: 45, status: 'livre' },
      { tableNumber: 46, status: 'livre' },
      { tableNumber: 47, status: 'livre' },
      { tableNumber: 48, status: 'livre' },
      { tableNumber: 49, status: 'livre' },
      { tableNumber: 50, status: 'livre' },
      { tableNumber: 51, status: 'livre' },
      { tableNumber: 52, status: 'livre' },
      { tableNumber: 53, status: 'livre' },
      { tableNumber: 54, status: 'livre' },
      { tableNumber: 55, status: 'livre' },
      { tableNumber: 56, status: 'livre' },
      { tableNumber: 57, status: 'livre' },
      { tableNumber: 58, status: 'livre' },
      { tableNumber: 59, status: 'livre' },
      { tableNumber: 60, status: 'livre' },
      { tableNumber: 61, status: 'livre' },
      { tableNumber: 62, status: 'livre' },
      { tableNumber: 63, status: 'livre' },
      { tableNumber: 64, status: 'livre' },
      { tableNumber: 65, status: 'livre' },
      { tableNumber: 66, status: 'livre' },
      { tableNumber: 67, status: 'livre' },
      { tableNumber: 68, status: 'livre' },
      { tableNumber: 69, status: 'livre' },
      { tableNumber: 70, status: 'livre' },
      { tableNumber: 71, status: 'livre' },
      { tableNumber: 72, status: 'livre' },
      { tableNumber: 73, status: 'livre' },
      { tableNumber: 74, status: 'livre' },
      { tableNumber: 75, status: 'livre' },
      { tableNumber: 76, status: 'livre' },
      { tableNumber: 77, status: 'livre' },
      { tableNumber: 78, status: 'livre' },
      { tableNumber: 79, status: 'livre' },
      { tableNumber: 80, status: 'livre' },
      { tableNumber: 81, status: 'livre' },
      { tableNumber: 82, status: 'livre' },
      { tableNumber: 83, status: 'livre' },
      { tableNumber: 84, status: 'livre' },
      { tableNumber: 85, status: 'livre' },
      { tableNumber: 86, status: 'livre' },
      { tableNumber: 87, status: 'livre' },
      { tableNumber: 88, status: 'livre' },
      { tableNumber: 89, status: 'livre' },
      { tableNumber: 90, status: 'livre' },
      { tableNumber: 91, status: 'livre' },
      { tableNumber: 92, status: 'livre' },
      { tableNumber: 93, status: 'livre' },
      { tableNumber: 94, status: 'livre' },
      { tableNumber: 95, status: 'livre' },
      { tableNumber: 96, status: 'livre' },
      { tableNumber: 97, status: 'livre' },
      { tableNumber: 98, status: 'livre' },
      { tableNumber: 99, status: 'livre' },
      { tableNumber: 100, status: 'livre' },

    ];

    // Insere as mesas no banco de dados
    await Table.insertMany(tables);

    console.log('Mesas inseridas com sucesso!');
    process.exit();  // Finaliza o script
  } catch (error) {
    console.error('Erro ao inserir mesas:', error);
    process.exit(1);  // Encerra o processo com erro
  }
};

// Rodar o seeder
seedTables();
