var Player = {
    gold: 0,
    xp: 0,
    xpReq: 5,
    level: 1,
    lvlBefore: 1,
    lvlAfter: 1,
    lvlDiff: 0,
    energy: 100,
    power: 10,
    defense: 10,
    renown: 0,
    
    inventory: {
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

    setEnergy: function(){

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

    getPower: function(){
        return this.power;
    },


};