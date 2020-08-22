var Equipment = {
    Equipment: function(options) {
        this.name = options.name;
        this.rarity = options.rarity;
        this.ilvl = options.ilvl;
    },

    name: '',
    power: 0,
    defense: 0,
    ilvl: 1,
    rarity: '',

    helm: ["Cap",
        "Helm",
        "Visor",
        "Hood",
        "Barbute",
        "Circlet",
        "Coif"],
    
    body: ["Breastplate",
        "Mail",
        "Vest",
        "Robe",
        "Jerkin",
        "Platemail",
        "Jacket"],
    
    gloves: ["Gloves",
        "Mitts",
        "Gauntlets",
        "Bracers"],

    legs: ["Skirt",
        "Platelegs",
        "Mail",
        "Pants",
        "Chausses",
        "Cuisses",
        "Gambeson"],

    boots: ["Boots",
        "Sabatons",
        "Slippers",
        "Greaves",
        "Shoes"],

    getName: function (equipSlot, rarity) {
        var i;
        let randomChoice = getRandomInt(0, Equipment[equipSlot].length);
        let base = "";
        let prefix = "";
        for (i = 0; i < Equipment[equipSlot].length; i++) {
            if (i == randomChoice) {
               base = Equipment[equipSlot][i];
               break;
            }
        }

        switch (rarity) {
            case ('common'):
                prefix = "Poor";
                break;
            case ('uncommon'):
                prefix = "";
                break;
            case ('rare'):
                prefix = "Glowing"
                break;
            case ('epic'):
                prefix = "Shining"
                break;
            case ('legendary'):
                prefix = "Historic"
        }

        return prefix +" "+ base;
    },

    getRarity: function() {
        let rareRoll = Math.random();

        if (rareRoll <= 0.03) {
            return 'legendary';
        } else if (rareRoll > 0.03 && rareRoll <= 0.10) {
            return 'epic';
        } else if (rareRoll > 0.10 && rareRoll <= 0.25) {
            return 'rare';
        } else if (rareRoll > 0.25 && rareRoll <= 0.50) {
            return 'uncommon';
        } else {
            return 'common';
        }
    },

    getRarityMod: function (rarity) {
        switch (rarity) {
            case ('common'):
                return 1;
                break;
            case ('uncommon'):
                return 1.5;
                break;
            case ('rare'):
                return 2;
                break;
            case ('epic'):
                return 3;
                break;
            case ('legendary'):
                return 5;
        }
    },

    calcPowerMod: function(equipSlot, equipment) {
        if(typeof Player.equipment[equipSlot] != 'undefined') {
            let power = Math.ceil(this.getRarityMod(equipment.rarity) * 
                (Player.equipment[equipSlot].ilvl * 1.5) + (Player.power/10));
            return power;
        } else {
            return 2;
        }
    },

    make: function(equipSlot) {
        let rarity = this.getRarity();
        let ilvl = 1;
        if (typeof Player.equipment[equipSlot] != 'undefined') {
            ilvl = Math.ceil(Player.equipment[equipSlot].ilvl * this.getRarityMod(rarity));
        } else {
            ilvl = 2;
        }

        let equipment = new Equipment.Equipment({
            ilvl: ilvl,
            rarity: rarity
        });

        let powerMod = this.calcPowerMod(equipSlot, equipment);


        equipment.power = powerMod;  //change these to have some variance?
        equipment.defense = powerMod;
        equipment.name = this.getName(equipSlot, rarity);

        Player.power += equipment.power;
        Player.defense += equipment.defense;
        $('.power').text('Power: '+Player.power);
        $('.defense').text('Defense: '+Player.defense);
        Player.equipment[equipSlot] = equipment;
        return equipment.name;
    },

    buy: function(equipSlot) {
        var value = 0;  // do math to scale this
        if (Player.gold < value) {
            sendMessage('Not enough gold.');
        } else {
            switch (equipSlot) {
                case 'helm':
                    console.log('Helm buy');
                    Player.gold -= value;
                    let name = this.make('helm');
                    $('.helm').text("Helm: "+name);
                    break;
                default: 
                    console.log("Didn't work");
            }
        }
    }
    
}