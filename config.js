const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp : 1,
    lasthash : 'XXXXX',
    hash: 'Hash 1',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data : []
};
const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*authorized-reward*'};

const MINING_REWARD = 75;

module.exports = { 
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};
