const machines = require('express').Router();
const {
    getMachines,
    getMachine,
    getUserMachines,
    createMachine,
    updateMachine,
    deleteMachine,
    addMachineToGroup,
    removeMachineFromGroup
} = require('../controllers/machineController');
const alreadyExists = require('../middleware/alreadyExists');

machines.get('/', getMachines);
machines.get('/user', getUserMachines);
machines.post('/create', createMachine);

// Middleware specifico per le rotte che richiedono un id di macchina
machines.use('/:id', alreadyExists('machine', true));

machines.get('/:id', getMachine);
machines.post('/:id/add', alreadyExists('groupMachine', false), addMachineToGroup);
machines.put('/:id', updateMachine);
machines.delete('/:id', deleteMachine);
machines.delete('/:id/remove', alreadyExists('groupMachine', true), removeMachineFromGroup);

module.exports = machines;