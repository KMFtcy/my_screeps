import { } from 'game/utils';
import { } from 'game/prototypes';
import { prototypes, utils, constants} from 'game';
import { ATTACK, CARRY, MOVE, WORK } from 'game/constants';
import { getObjectsByPrototype } from 'game/utils';
import { StructureSpawn, Source } from 'game/prototypes';

var miner;
var medics = [];

export function loop() {
    // scan context
    var mySpawn = getObjectsByPrototype(StructureSpawn)[0];
    var source = getObjectsByPrototype(Source)[0];
    var enemyCreeps = getObjectsByPrototype(prototypes.Creep).filter(creep => !creep.my);
    var warriors = getObjectsByPrototype(prototypes.Creep).filter(creep => creep.my && creep.body.some(body => body.type == ATTACK));

    // report on console
    console.log("enermy creeps: " + enemyCreeps.length);
    console.log("warriors: " + warriors.length);

    // spawn screeps
    if (!miner) {
        miner = mySpawn.spawnCreep([MOVE, MOVE, WORK, CARRY]).object;
    }else{
        if (warriors.length <= 4) {
            mySpawn.spawnCreep([MOVE, ATTACK]);
        }
    }

    // mining
    console.log(miner.store)
    if(miner.store.getFreeCapacity(constants.RESOURCE_ENERGY)) {
        if(miner.harvest(source) == constants.ERR_NOT_IN_RANGE) {
            miner.moveTo(source);
        }
    } else {
        if(miner.transfer(mySpawn, constants.RESOURCE_ENERGY) == constants.ERR_NOT_IN_RANGE) {
            miner.moveTo(mySpawn);
        }
    }

    //defencer
    if (enemyCreeps.length > 0 && warriors.length > 0){
        for (var idx in warriors){
            if(warriors[idx].attack(enemyCreeps[0]) == constants.ERR_NOT_IN_RANGE) {
                warriors[idx].moveTo(enemyCreeps[0]);
            }
        }
    }
}
