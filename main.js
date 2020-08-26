_DEFAULT_SPEED = 1000;
_MIN_SPEED = 100;
var lastUpdate = new Date().getTime();
var newGame = true;

var msgBoxShow = true;
var lootList = [];
var intervalSpeed = 1000;
var mainTimer = undefined;
var taskTimer = undefined;
var mainTimerGoing = false;



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

//Maybe refactor this into the loot var?

function rollLoot() {
    var i;
    
    for(i = 0; i < (lootList.length); i++) {
        var roll = (Math.floor(Math.random()*100) / 100);
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

function disableBtn(btn) {
    $(btn).css({"opacity": "50%", "cursor": "context-menu"})
    .unbind('click');
}

function switchScene(scene, btnId, taskInd) {
    //Make this switch/case?
    if (scene == ".mainScene") {
        $('#progressBarMain').css("width", "0%");
        $('#progressBarMain').animate({width: '100%'}, 800, 'linear', function(){
            $('#progressBarMain').css("width", "0%");
        });  //temporary fix, move for some reason breaks at first scene
        Tasks.initTask(taskInd); 
    } else if (scene == ".restScene") {
        mainTimerGoing = false;
        clearTimeout(taskTimer);
        Player.lvlAfter = Player.level;
        Player.rest();
        intervalSpeed = _DEFAULT_SPEED;
    } else if (scene == ".smithScene") {
        clearTimeout(taskTimer);
    } else if (scene == ".taskScene") {
        clearTimeout(taskTimer);
    }

    $('.taskScene').css("display","none");
    $('.smithScene').css("display", "none");
    $('.shopScene').css("display", "none");
    $('.startScene').css("display", "none");
    $('.restScene').css("display","none");
    $('.mainScene').css("display","none");
    //disableBtn(btn);
    $(scene).css("display","inline-block");
}

function cookStuff() {
    if (Player.inventory["raw meat"] > 0) {
        Player.inventory["raw meat"] -= 1;
        if(Player.inventory["raw meat"] - 1 == 0){
            $('.rawmeat').remove();
        } else {
            $('.rawmeat').text(Player.inventory["raw meat"]+' raw meat');
        }
        if (Player.inventory.hasOwnProperty('rations')) {
            Player.inventory.rations += 1;
            $('.rations').text(Player.inventory.rations+" rations");
        } else {
            Player.inventory['rations'] = 1;
            $('<div>').addClass('rations').text("1 rations").appendTo('.inventory');
        }
    } else {
        sendMessage("No meat to cook with.");
    }
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
    $('<div>').addClass('messageBox').appendTo('.centerPanel');

    //Scenes
    $('<div>').addClass('shopScene').appendTo('.centerPanel');
    $('<div>').addClass('smithScene').appendTo('.centerPanel');
    $('<div>').addClass('mainScene').appendTo('.centerPanel');
    $('<div>').addClass('restScene').appendTo('.centerPanel');
    $('<div>').addClass('startScene').appendTo('.centerPanel');
    $('<div>').addClass('taskScene').appendTo('.centerPanel');

    //Main Scene Task stuf
    $('<h1>').addClass('areaHeader').text('Floor 1').appendTo('.mainScene')
    $('<div>').addClass('currentTask').appendTo('.mainScene')
    $('<div>').attr("id","mainBar").appendTo('.mainScene');
    $('<div>').attr("id","progressBarMain").appendTo("#mainBar");
    $('<div>').addClass('timer').attr("id","timer").appendTo('.mainScene');

    //Rest Scene stuff
    $('<h1>').addClass('campTitle').text('Camp').appendTo('.restScene');
    $('<div>')
    .text('Cook')
    .addClass('btn')
    .attr("id","btn-cook")
    .click(function(){cookStuff();})
    .appendTo('.restScene');

    //Task/Area scene stuff
    //addButton("btn-f1","Floor 1",'.taskScene', function(){Tasks.initTask(0)});
    $('<div>')
    .addClass('btn')
    .attr("id","btn-f1")
    .text('Floor 1')
    .click(function(){switchScene('.mainScene', "btn-f1",0)})
    .appendTo('.taskScene');

    //Player Info
    $('<div>').addClass('gold').html('Gold: 0').appendTo('.infoPanel');
    $('<div>').addClass('xp').text('Experience: 0').appendTo('.infoPanel');
    $('<div>').addClass('level').text('Level: 1').appendTo('.infoPanel');
    $('<h1>').addClass('attrHeader').text('Attributes').appendTo('.infoPanel');
    $('<div>').addClass('energy').text('Energy: 100%').appendTo('.infoPanel');
    $('<div>').addClass('power').text('Power: 10').appendTo('.infoPanel');
    $('<div>').addClass('defense').text('Defense: 10').appendTo('.infoPanel');
    $('<div>').addClass('str').text('Str: 10').appendTo('.infoPanel');
    $('<div>').addClass('dex').text('Dex: 10').appendTo('.infoPanel');
    $('<div>').addClass('int').text('Int: 10').appendTo('.infoPanel');
    $('<div>').addClass('con').text('Con: 10').appendTo('.infoPanel');
    $('<div>').addClass('wis').text('Wis: 10').appendTo('.infoPanel');
    $('<div>').addClass('luk').text('Luk: 10').appendTo('.infoPanel');
    $('<h1>').addClass('equipHeader').text('Equipment').appendTo('.infoPanel');
    $('<div>').addClass('helm').text('Helm: ').appendTo('.infoPanel');
    $('<div>').addClass('body').text('Body: ').appendTo('.infoPanel');
    $('<div>').addClass('gloves').text('Gloves: ').appendTo('.infoPanel');
    $('<div>').addClass('legs').text('Legs: ').appendTo('.infoPanel');
    $('<div>').addClass('boots').text('Boots: ').appendTo('.infoPanel');
    $('<div>').addClass('wpn1').text('Weapon: ').appendTo('.infoPanel');
    $('<div>').addClass('wpn2').text('Off-hand: ').appendTo('.infoPanel');

    //Menu Buttons
    $('<div>')
    .addClass('btn')
    .attr("id","btn-kill")
    .text('Kill')
    .click(function(){switchScene(".mainScene", "#btn-kill");})
    .prependTo('.menuBar');

    $('<div>')
    .addClass('btn')
    .attr("id","btn-rest")
    .text('Rest')
    .click(function(){switchScene(".restScene", "#btn-rest");})
    .prependTo('.menuBar');

    $('<div>')
    .addClass('btn')
    .attr("id","btn-smith")
    .text('Smith')
    .click(function(){switchScene(".smithScene", "#btn-smith");})
    .prependTo('.menuBar');

    $('<div>')
    .addClass('btn')
    .attr("id","btn-tasks")
    .text('Tower')
    .click(function(){switchScene(".taskScene","#btn-tasks");})
    .prependTo('.menuBar');

    Tasks.startNewTask();
    let task = Tasks.taskList[0];
    addButton("btn-boss","Fight Boss",".startScene",function(){
        switchScene('.mainScene', 'btn-boss',0);
        fightBoss(task);
    });
}

function initLootTables(){
    for (var l in Loot.list.trash) {   //l is a number
        var loot = {};
        loot.name = Loot.list.trash[l].name;
        loot.value = Loot.list.trash[l].value;
        loot.weight = Loot.list.trash[l].weight;
        lootList.push(loot);
        Player.inventory[lootList[l].name] = 0;
    };
}

function sendMessage(msg) {
    $('<div>').addClass('msg').text(msg).prependTo('.messageBox');
    $('.msg').animate({opacity: '100%'}, 500, 'linear');
}

function startGame() {
    $('.restScene').css("display","none");
    $('.startScene').css("display","inline-block");
    /*
    $('.mainScene').css("display","inline-block");
    Tasks.initTask(0);*/

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
                sendMessage("You escape.");
                switchScene(".taskScene");
                })
            })
        })
        .appendTo('.startScene');
}

function addButton (id, text, scene, clickFunc) {
    $('<div>')
    .addClass('btn')
    .attr("id", id)
    .text(text)
    .click(clickFunc)
    .appendTo(scene);
}

function initSmith() {
    addButton("btn-helm","Helm",'.smithScene',
    function() {Equipment.buy('helm')});
    addButton("btn-body","Body",'.smithScene',
    function() {Equipment.buy('body')});
    addButton("btn-gloves","Gloves",'.smithScene',
    function() {Equipment.buy('gloves')});
    addButton("btn-legs","Legs",'.smithScene',
    function() {Equipment.buy('legs')});
    addButton("btn-boots","Boots",'.smithScene',
    function() {Equipment.buy('boots')});
}

function updateLoot(task) {
    task.numTasks += 1;
    rollLoot(); //might need to update for task-dependent loot tables

    if(task.numTasks <= task.maxTasks) {
        $('.currentTask')
            .text("Looting... ("+task.numTasks+"/"+task.maxTasks+")");
        
        move('#progressBarMain')
            .set('width', '100%')
            .duration(900)
            .end(function(){
                $('#progressBarMain').css("width","0%");
            });
        //taskTimer = setTimeout(function(){Tasks.doTask(task);}, 1000);
        Tasks.doTask(task);
    } else {
        if (task.taskStage < 0){
            task.taskStage += 1;
        } else if (task.taskStage == 0) {
            task.taskStage += 1;
            task.taskCompleteFlag = true;
            sendMessage("You find a staircase heading upward.");
            addButton("btn-boss","Fight Boss",".mainScene",function(){
                fightBoss(task);
            })
        }
        task.numTasks = 1;
        task.maxTasks = getRandomInt(3,11);
        task.isKilling = true;
        task.isLooting = false;
        $('.currentTask')
            .text("Killing... ("+task.numTasks+"/"+task.maxTasks+")");
            
        move('#progressBarMain')
            .set('width', '100%')
            .duration(900)
            .end(function(){
                $('#progressBarMain').css("width","0%");
            });
        //taskTimer = setTimeout(function(){Tasks.doTask(task);}, 1000);
        Tasks.doTask(task);
    }
}

function updateKill(task) {
    task.numTasks += 1;

    /* UPDATE PLAYER STATS*/
    Player.gold += 1;
    gainXp();
    $('.gold').text("Gold: " + Player.gold);
    $('.xp').text("Experience: " + Player.xp);
    $('.energy').text("Energy: " + Player.energy + "%");
    /* UPDATE PLAYER STATS*/

    if(task.numTasks <= task.maxTasks) {
        $('.currentTask')
            .text("Killing... ("+task.numTasks+"/"+task.maxTasks+")");
        move('#progressBarMain')
            .set('width', '100%')
            .duration(900)
            .end(function(){
                $('#progressBarMain').css("width","0%");
            });
        //taskTimer = setTimeout(function(){Tasks.doTask(task);}, 1000);
        Tasks.doTask(task);
    } else {
        task.numTasks = 1;
        task.isKilling = false;
        task.isLooting = true;
        $('.currentTask')
            .text("Looting... ("+task.numTasks+"/"+task.maxTasks+")");
        move('#progressBarMain')
            .set('width', '100%')
            .duration(900)
            .end(function(){
                $('#progressBarMain').css("width","0%");
            });
        //taskTimer = setTimeout(function(){Tasks.doTask(task);}, 1000);
        Tasks.doTask(task);
    }
}

function fightBoss(task) {
     //need to remove when boss is done?
    clearTimeout(taskTimer);
    $('#btn-boss').remove();
    $('.timer').css("display","inline-block")
    $('.currentTask')
        .text("Boss");

    if (Player.power <= task.bossPower) {
        $('#progressBarMain').css("width","100%");
        sendMessage("You don't feel powerful enough to defeat this boss.");
    } else {
        //Timer.setTimer(60);
    }
    Timer.setTimer(600); //XX.X seconds
    console.log("Count outer: "+Timer.count);
    /*
    move('#progressBarMain')
        .set('width', '100%')
        .duration(900)
        .end(function(){
            $('#progressBarMain').css("width","0%");
        });*/
        //taskTimer = setTimeout(function(){updateKill(task);}, 1000);
}

function displayCount(count) {
    var res = count / 10;
    $('.timer').text(res + ' secs')
    //document.getElementById("timer").innerHTML = res.toPrecision(count.toString().length) + " secs";
}


initPage();
initSmith();
initLootTables(); //might need to move this to be area dependent
if (newGame) {
    startGame();
}