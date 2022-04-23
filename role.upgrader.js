var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            } else {
                // if can't find a place to build, just find a place to stay
                var spawns_target = creep.room.find(FIND_MY_SPAWNS)
                creep.moveTo(spawns_target[0])
            }
        }
        else {
            var Container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    && s.store[RESOURCE_ENERGY] > 0
            })
            if (Container) {
                if (creep.withdraw(Container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Container)
                }
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES)
                if (creep.store.getFreeCapacity() == 0) {
                    creep.moveTo(STRUCTURE_SPAWN)
                } else {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;