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

machines.use('/:id', alreadyExists('machine', true)); // middleware comune

machines.get('/:id', getMachine);
machines.post('/:id/add', alreadyExists('groupMachine', false), addMachineToGroup);
machines.put('/:id', updateMachine);
machines.delete('/:id', deleteMachine);
machines.delete('/:id/remove', alreadyExists('groupMachine', true), removeMachineFromGroup);

module.exports = machines;