_DEFAULT_SPEED = 1000;

var msgBoxShow = true;
var lootList = [];
var intervalSpeed = 1000;
var mainTimer = undefined;

var mainBarProg = 0;
var taskCompleteFlag = false;

var newGame = true;

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
    var i;
    
    for(i = 0; i < (lootList.length); i++) {
        var roll = Math.random();
        if (roll <= lootList[i].weight) {
            var item = lootList[i].name;
            item = item.replace(/\s+/g, '');    //remove spaces for class
            if ($("." + item)[0]) {                     //if it's already listed in inventory, add to it
                Player.inventory[lootList[i].name] += 1;
                $("." + item)
                .text(Player.inventory[lootList[i].name] +" "+ lootList[i].name)
            } else {
                Player.inventory[lootList[i].name] += 1;
                $('<div>')
                .addClass(item)
                .text(Player.inventory[lootList[i].name] +" "+ lootList[i].name)
                .appendTo(".inventory");
            }
        }
    }
}

function switchScene(scene) {
    if (scene == ".mainScene") {
        Player.lvlBefore = Player.level;
        initTimers();
    } else if (scene == ".restScene") {
        clearInterval(mainTimer);
        Player.lvlAfter = Player.level;
        Player.rest();
        intervalSpeed = _DEFAULT_SPEED;
    } 
    
    $('.smithScene').css("display", "none");
    $('.shopScene').css("display", "none");
    $('.startScene').css("display", "none");
    $('.restScene').css("display","none");
    $('.mainScene').css("display","none");
    $(scene).css("display","inline-block");
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

function initPage(){
    //menu - append to top of center panel?
    $('<div>').addClass('menuBar').prependTo("#content");
    //3 Center panels & Message Box
    $('<div>').addClass('gameContent').appendTo("#content");
    $('<div>').addClass('infoPanel').appendTo(".gameContent");
    $('<h1>').addClass('statsHeader').text('Stats').appendTo(".infoPanel");
    $('<div>').addClass('centerPanel').appendTo(".gameContent");
    $('<div>').addClass('inventory').appendTo(".gameContent");
    $('<h1>').addClass('invHeader').text('Inventory').appendTo(".inventory");
    
    //Scenes
    $('<div>').addClass('shopScene').appendTo('.centerPanel');
    $('<div>').addClass('smithScene').appendTo('.centerPanel');
    $('<div>').addClass('mainScene').appendTo('.centerPanel');
    $('<div>').addClass('restScene').appendTo('.centerPanel');
    $('<div>').addClass('startScene').appendTo('.centerPanel');
    //Bars
    $('<div>').attr("id","mainBar").appendTo(".mainScene");
    $('<div>').attr("id","progressBarMain").appendTo("#mainBar");

    $('<div>').addClass('messageBox').appendTo('.centerPanel');

    //Player Info
    $('<div>').addClass('gold').html('Gold: 0').appendTo('.infoPanel');
    $('<div>').addClass('xp').text('Experience: 0').appendTo('.infoPanel');
    $('<div>').addClass('level').text('Level: 1').appendTo('.infoPanel');
    $('<h1>').addClass('attrHeader').text('Attributes').appendTo('.infoPanel');
    $('<div>').addClass('energy').text('Energy: 100%').appendTo('.infoPanel');
    $('<div>').addClass('str').text('Str: 10').appendTo('.infoPanel');
    $('<div>').addClass('dex').text('Dex: 10').appendTo('.infoPanel');
    $('<div>').addClass('int').text('Int: 10').appendTo('.infoPanel');
    $('<div>').addClass('con').text('Con: 10').appendTo('.infoPanel');
    $('<div>').addClass('wis').text('Wis: 10').appendTo('.infoPanel');
    $('<div>').addClass('luk').text('Luk: 10').appendTo('.infoPanel');

    //Menu Buttons
    $('<div>')
    .addClass('btn')
    .attr("id","btn-kill")
    .text('Kill')
    .click(function(){switchScene(".mainScene");})
    .prependTo('.menuBar');

    $('<div>')
    .addClass('btn')
    .attr("id","btn-rest")
    .text('Rest')
    .click(function(){switchScene(".restScene");})
    .prependTo('.menuBar')

    $('<div>')
    .addClass('btn')
    .attr("id","btn-smith")
    .text('Smith')
    .click(function(){switchScene(".smithScene");})
    .prependTo('.menuBar')
}

function initTimers(){

    mainTimer = window.setInterval(function(){
        /*
        $("#progressBarMain").animate({width: '100%'}, intervalSpeed, 'linear', function(){
            $("#progressBarMain").css("width", "0%");
        });
        */
        onKill();
    }, intervalSpeed);

}

function initLootTables(){
    for (var l in Loot.list.trash) {   //l is a number
        var loot = {};
        loot.name = Loot.list.trash[l].name;
        loot.value = Loot.list.trash[l].value;
        loot.weight = Loot.list.trash[l].weight;
        lootList.push(loot);
    };
}

function onKill(){
    Player.gold += 1;
    gainXp();
    getLoot();
    
    $('.gold').text("Gold: " + Player.gold);
    $('.xp').text("Experience: " + Player.xp);
    $('.energy').text("Energy: " + Player.energy + "%");

    //Timer object function returns undefined - need to fix?  Maybe?
    if((Player.energy) > 0){
        clearInterval(mainTimer);
        Player.energy -= 5;
        intervalSpeed = (intervalSpeed + (25 * (100 - Player.energy)));
        mainTimer = window.setInterval(function(){
            /*
            $("#progressBarMain").animate({width: '100%'}, intervalSpeed, 'linear', function(){
                $("#progressBarMain").css("width", "0%");
            });
            */
            onKill();
        }, intervalSpeed);
        $('.energy').text("Energy: " + Player.energy + "%");
        console.log(intervalSpeed);
    }

    if (mainBarProg < 100) { 
        mainBarProg += 10;
        $("#progressBarMain").css("width", (mainBarProg + "%"))
    } else {
        taskCompleteFlag = true;
    }
    
}

function sendMessage(msg) {
    $('<div>').addClass('msg').text(msg).prependTo('.messageBox');
    $('.msg').animate({opacity: '100%'}, 500, 'linear');
}

function startGame() {
    $('.restScene').css("display","none");
    $('.startScene').css("display","inline-block");

    $('<div>')
        .addClass('btn')
        .attr('id','start-btn')
        .text('Wake up')
        .click(function(){
            sendMessage("You wake up.  It is dark.");
            $('#start-btn')
            .text('Listen')
            .unbind('click')
            .bind('click', function(){
            sendMessage("You hear noises outside.");
            $('#start-btn')
                .text('Survive')
                .unbind('click')
                .bind('click', function(){
                sendMessage("It's chaos.");
                switchScene(".mainScene");
                })
            })
        })
        .appendTo('.startScene');
}

function initSmith() {
    $('<div>').addClass('btn-smith').text('Helm');
    $('<div>').addClass('btn-smith').text('Body');
    $('<div>').addClass('btn-smith').text('Gloves');
    $('<div>').addClass('btn-smith').text('Legs');
    $('<div>').addClass('btn-smith').text('Boots');
}

initPage();
initSmith();
initLootTables();
if (newGame) {
    startGame();
}
//initTimers();