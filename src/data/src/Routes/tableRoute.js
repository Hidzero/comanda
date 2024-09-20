import express from 'express';
import * as TableController from '../Controllers/tableController.js';

const router = express.Router();

router.post('/', TableController.createTable);
router.get('/', TableController.getAllTables);
router.put('/:id', TableController.updateTable);
router.delete('/:id', TableController.deleteTable);

export default router;
