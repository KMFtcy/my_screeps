import { } from 'game/utils';
import { } from 'game/prototypes';
import { prototypes, utils, constants} from 'game';
import { ATTACK, CARRY, MOVE, WORK } from 'game/constants';
import { getObjectsByPrototype } from 'game/utils';
import { StructureSpawn, Source, StructureContainer } from 'game/prototypes';

let miner;

export function loop() {
    // scan context
    var mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my);
    var source = getObjectsByPrototype(StructureContainer)[0];
    var enemyCreeps = getObjectsByPrototype(prototypes.Creep).filter(creep => !creep.my);
    var warriors = getObjectsByPrototype(prototypes.Creep).filter(creep => creep.my && creep.body.some(body => body.type == ATTACK));

    // report on console
    console.log("enermy creeps: " + enemyCreeps.length);
    console.log("warriors: " + warriors.length);

    // spawn screeps
    if (!miner) {
        console.log("spawning miner")
        miner = mySpawn.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]).object;
    }else{
        console.log("spawning worrior")
        mySpawn.spawnCreep([MOVE, MOVE, ATTACK, ATTACK]);
    }

    // mining
    if ( miner ){
        if(!miner.store[constants.RESOURCE_ENERGY]) {
            const container = utils.findClosestByPath(miner, utils.getObjectsByPrototype(prototypes.StructureContainer).filter(i => i.store[constants.RESOURCE_ENERGY] > 0));
            if(miner.withdraw(container, constants.RESOURCE_ENERGY) == constants.ERR_NOT_IN_RANGE) {
                miner.moveTo(container);
            }
        } else {
            console.log("transfering")
            if(miner.transfer(mySpawn, constants.RESOURCE_ENERGY) == constants.ERR_NOT_IN_RANGE) {
                miner.moveTo(mySpawn);
            }
        }
    }

    // defencer
    if (enemyCreeps.length > 0){
        for (var idx in warriors){
            let enermy= utils.findClosestByPath(warriors[idx], enemyCreeps);
            if(warriors[idx].attack(enermy) == constants.ERR_NOT_IN_RANGE) {
                warriors[idx].moveTo(enermy);
            }
        }
    }

    // attacker
    if (enemyCreeps.length <= 0){
        const enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
        for (var idx in warriors){
            if(warriors[idx].attack(enemySpawn) == constants.ERR_NOT_IN_RANGE) {
                warriors[idx].moveTo(enemySpawn);
            }
        }
    }
}
