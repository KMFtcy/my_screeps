
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

var roleTranfer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // find containers
        if (creep.store.getFreeCapacity() > 0) {
            // find a filled container, if there is no container, be a harvester
			var Container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_CONTAINER
					&& s.store[RESOURCE_ENERGY] > 0
			})
			if (Container) {
                if (creep.withdraw(Container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Container, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                roleHarvester.run(creep) // be a harvester
            }
        } else {
            // transfer to a needed structure
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION
                    ) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // if can't find a place to put energy, just find a place to stay
                var spawns_target = creep.room.find(FIND_MY_SPAWNS)
                creep.moveTo(spawns_target[0])
            }

        }
    }
};

module.exports = roleTranfer;