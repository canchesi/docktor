const machines = require('express').Router();
const {
    getMachines,
    getMachine,
    createMachine,
    updateMachine,
    deleteMachine
} = require('../controllers/machineController');

machines.get('/', getMachines);
machines.get('/:id', getMachine);
machines.post('/create', createMachine);
machines.put('/:id', updateMachine);
machines.delete('/:id', deleteMachine);

module.exports = machines;