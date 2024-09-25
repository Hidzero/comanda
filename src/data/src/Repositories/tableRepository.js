import Table from '../Models/Table.js';

class TableRepository {
    async create(tableData) {
        const table = new Table(tableData);
        await table.save();
        return table;
    }

    async updateStatusByTableNumber(tableNumber, status) {
        return await Table.findOneAndUpdate({ tableNumber: tableNumber }, { status: status }, { new: true });
    }

    async findAllTables() {
        return await Table.find();
    }

    async findById(id) {
        return await Table.findById(id);
    }

    async updateById(id, tableData) {
        return await Table.findByIdAndUpdate(id, tableData, { new: true });
    }

    async deleteById(id) {
        return await Table.findByIdAndDelete(id);
    }
}

const tableRepository = new TableRepository();
export default tableRepository;