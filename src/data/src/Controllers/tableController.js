import tableRepository from "../Repositories/tableRepository.js";

export async function createTable(req, res) {
    try {
        const newTable = await tableRepository.create(req.body);
        res.status(201).json({
            statusCode: 201,
            message: "Mesa criada com sucesso",
            data: newTable
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllTables(req, res) {
    try {
        const tables = await tableRepository.findAllTables();
        res.status(200).json({
            statusCode: 200,
            message: "Todas as mesas",
            data: tables
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateTable(req, res) {
    try {
        const updatedTable = await tableRepository.updateById(req.params.id, req.body);
        res.status(200).json({
            statusCode: 200,
            message: "Mesa atualizada",
            data: updatedTable
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteTable(req, res) {
    try {
        await tableRepository.deleteById(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: "Mesa deletada"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
