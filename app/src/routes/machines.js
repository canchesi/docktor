const machines = require('express').Router();
const {
    getMachines,
    getMachine,
    createMachine,
    updateMachine,
    deleteMachine,
    addGroupToMachine,
    removeGroupFromMachine
} = require('../controllers/machineController');
const alreadyExists = require('../middleware/alreadyExists');


machines.get('/', getMachines);
machines.get('/:id', getMachine);
machines.post('/create', alreadyExists('machine', false), createMachine);
machines.use(alreadyExists('machine', true));
machines.post('/:id/add', alreadyExists('groupMachine', false), addGroupToMachine);
machines.put('/:id', updateMachine);
machines.delete('/:id', deleteMachine);
machines.delete('/:id/remove', alreadyExists('groupMachine', true), removeGroupFromMachine);

module.exports = machines;