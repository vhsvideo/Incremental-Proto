var msgBoxShow = true;

function gainXp(){
    if (Player.xp + 2 >= Player.xpReq) {
        Player.level += 1;
        Player.xp = 0;
        Player.xpReq *= 2;
        $('.level').text("Level: " + Player.level);
    } else {
        Player.xp += 2;
    }
}

function getLoot(){
    var lootList = [];
    for (var l in Loot.trash.list) {   //l is a number
        var loot = {};
        loot.name = Loot.trash.list[l].name;
        loot.value = Loot.trash.list[l].value;
        loot.weight = Loot.trash.list[l].weight;
        lootList.push(loot);
    };
    console.log(lootList.length);
    

    var i;
    
    for(i = 0; i < (lootList.length); i++) {
        var roll = Math.random();
        if (roll <= lootList[i].weight) {
            if ($("." + lootList[i].name)[0]) {  //if it's already listed in inventory
                lootList[i].name;
                Player.inventory[lootList[i].name] += 1;
                $("." + lootList[i].name)
                .text(Player.inventory[lootList[i].name] +" "+ lootList[i].name)
            } else {
                Player.inventory[lootList[i].name] += 1;
                $('<div>')
                .addClass(lootList[i].name)
                .text(Player.inventory[lootList[i].name] +" "+ lootList[i].name)
                .appendTo(".inventory");
            }
        }
    }
}

function onKill(){
    Player.gold += 1;
    gainXp();
    getLoot();
    $('.gold').text("Gold: " + Player.gold);
    $('.xp').text("Experience: " + Player.xp);
}

function msgBoxToggle(){
    if (msgBoxShow){
        $(".messageBox").hide();
        msgBoxShow = false;
    } else {
        $(".messageBox").show();
        msgBoxShow = true;
    }
}

function init(){
    
    $('<div>').addClass('menuTop').text('Placeholder').prependTo('body');   
    $('<div>').addClass('messageBox').text('Hello?').appendTo("body");
    $('<div>').addClass('options').appendTo("body");
    $('<span>')
        .addClass('showMsgBox')
        .text('Show/Hide')
        .click(msgBoxToggle)
        .appendTo(".options");
    $('<div>').addClass('infoPanel').text('Info').appendTo("#content");
    $('<div>').addClass('centerPanel').text('Progress').appendTo("#content");
    $('<div>').addClass('inventory').text('Inventory').appendTo("#content");

    //Player Info
    $('<div>').addClass('gold').html('<b>Gold: 0</b>').appendTo('.infoPanel');
    $('<div>').addClass('xp').text('Experience: 0').appendTo('.infoPanel');
    $('<div>').addClass('level').text('Level: 1').appendTo('.infoPanel');
}

function initTimers(){
    $('<div>').attr("id","mainBar").appendTo(".centerPanel");
    $('<div>').attr("id","progressBarMain").appendTo("#mainBar");

    var mainTimer = Timer.setTimer("#progressBarMain", 1000); //Main timer in middle
}



init();
initTimers();

getLoot();