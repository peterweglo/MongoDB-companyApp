const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departments.controller');

router.get('/departments', DepartmentController.getAll);

router.get('/departments/random', DepartmentController.getRandom);

router.get('/departments/:id', DepartmentController.getById);

router.post('/departments', DepartmentController.addNew);

router.put('/departments/:id', DepartmentController.editById);

router.delete('/departments/:id', DepartmentController.deleteByID);

module.exports = router;
