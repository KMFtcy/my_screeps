var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            // send to container first, if there is no containers, send to spawn
            var container_targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_CONTAINER
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (container_targets.length > 0) {
                if (creep.transfer(container_targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container_targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // can't find containers, find spawns
                var spawns_target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_SPAWN
                        ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (spawns_target.length > 0) {
                    if (creep.transfer(spawns_target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawns_target[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
                // if can't find a place to put energy, just find a place to stay
                var spawns_target = creep.room.find(FIND_MY_SPAWNS)
                creep.moveTo(spawns_target[0])
            }
        }
    }
};

module.exports = roleHarvester;