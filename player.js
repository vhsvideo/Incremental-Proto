var Player = {
    gold: 0,
    xp: 0,
    xpReq: 20,
    level: 1,
    lvlBefore: 1,
    lvlAfter: 1,
    lvlDiff: 0,
    energy: 100,
    maxEnergy: 100,
    energyMod: 1,
    power: 10,
    defense: 10,
    renown: 0,
    energyFlag: false,

    inventory: {
        'raw meat': 100
    },
    
    stats: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        luk: 10
    },

    equipment: {
        helm: undefined,
        body: undefined,
        gloves: undefined,
        legs: undefined,
        boots: undefined,
        wpn1: undefined,
        wpn2: undefined
    },

    handleEnergy: function(){
        let randEnergy = (Math.round(Math.random()*(300 - 50) + 50) / 100) * Player.energyMod;

        if (Player.energy - randEnergy < 0) {
            if (Player.energyFlag == false) {
                sendMessage('You feel exhausted.');
                Player.energyFlag = true;
            }
            Player.energy = 0;
            return Player.energy.toFixed(2);
        } else {
            Player.energyFlag = false;
            Player.energy -= randEnergy;
            $('.energy').text("Energy: " + Player.energy.toFixed(2) + "%");
            return Player.energy.toFixed(2);
        } 
        
    },

    getPower: function(){
        return this.power;
    },

    rest: function(){
        Player.energy = 100;
        $('.energy').text('Energy: ' + Player.energy + '%');
        let diff = this.lvlAfter - this.lvlBefore;
        console.log(diff)
        if (diff > 0) {
            this.stats.str += diff * 3;
            $('.str').text("Str: " + this.stats.str);
        } else {
            console.log("No difference.")
        }
    },

    levelUp: function(){
        Player.level +=1;
        Player.xp = 0;
        Player.xpReq = Math.round(Player.xpReq * 1.1);
        
        $('.level').text("Level: " + Player.level);
        $('.xpReq').text("Next Lvl: " + Player.xpReq);
    },

    gainXp: function(_xpmod) {
        let gainedXp = Math.round(getRandomInt(1,3) * _xpmod);
        if (Player.xp + gainedXp >= Player.xpReq) {
            this.levelUp();
        } else {
            Player.xp += gainedXp;
            $('.xp').text('Experience: ' + Player.xp);
        }
    },

    gainGold: function(task) {
        let gainedGold = Math.round(getRandomInt(1,5) * task.goldMod);
        Player.gold += gainedGold;
        $('.gold').text('Gold: ' + Player.gold);
    },

    eat: function() {

    }
};