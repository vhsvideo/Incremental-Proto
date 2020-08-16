var Player = {
    gold: 0,
    xp: 0,
    xpReq: 5,
    level: 1,
    lvlBefore: 1,
    lvlAfter: 1,
    energy: 100,
    power: 6,
    defense: 10,
    
    inventory: {
        tooth: 0,
        pelt: 0,
        "coin pouch": 0
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
        helm: "",
        body: "",
        gloves: "",
        legs: "",
        boots: "",
        wpn1: "",
        wpn2: ""
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
    }
};