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
var currentScene;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Maybe refactor this into the loot var?
function rollLoot() {
    var i;
    
    for(i = 0; i < (lootList.length); i++) {
        var roll = (Math.round(Math.random()*100) / 100);
        console.log(roll);
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
    $('#'+btn).css({"opacity": "50%", "cursor": "context-menu"})
    .unbind('click');
}

function enableBtn(btn, clickFunc) {
    $('#'+btn).css({"opacity": "100%", "cursor": "pointer"})
    .click(clickFunc);
}

function btnCooldown(btn, cd, clickFunc) {
    let btnSelector = 'cooldown-'+btn;

    $("<style type='text/css'> ."+btnSelector+"{ height: 30px; width: 100%; background: lightgray;position: absolute;top: 0;left: 0;opacity: 50%;} </style>")
    .appendTo('#wrapper');
    $('<div>').addClass(btnSelector).appendTo('#'+btn);

    disableBtn(btn);
    
    move('.'+btnSelector) //for some reason if i dont set this, the following animation doesn't play
    .set('width', '100%')
    .end();

    setTimeout(function(){
        enableBtn(btn, clickFunc);
        $('.'+btnSelector).remove();
    }, cd)
    
    move('.'+btnSelector)
        .set('width', '0%')
        .ease('linear')
        .duration(cd)
        .end();
}

function switchScene(scene, btnId, taskInd) {
    //Make this switch/case?
    if (scene == currentScene) {
        console.log("On same page.");
    } else if (scene == ".mainScene") {
        $('#progressBarMain').css("width", "0%");
        $('#progressBarMain').animate({width: '100%'}, 800, 'linear', function(){
            $('#progressBarMain').css("width", "0%");
        });  //temporary fix, move for some reason breaks at first scene

        Tasks.initTask(taskInd);

        if(Tasks.taskList[taskInd].isBoss == true){
            $('#btn-boss').remove();
            addButton("btn-boss","Fight Boss",".mainScene",function(){
                switchScene('.bossScene',"btn-boss",taskInd);
                fightBoss(Tasks.taskList[taskInd]);
            });
        }
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

    //moving position while keeping main container overflow: hidden allows animations to keep playing in the bg
    //maybe a stupid way to do it?
    $('.taskScene').css("top","1000");
    $('.smithScene').css("top", "1000");
    $('.shopScene').css("top", "1000");
    $('.startScene').css("top", "1000");
    $('.restScene').css("top","1000");
    $('.mainScene').css("top","1000");
    $('.bossScene').css("top","1000");
    //disableBtn(btn);
    $(scene).css("top","0");

    currentScene = scene;
}

function cookStuff(btn) {
    if (Player.inventory["raw meat"] >= 5 && Player.inventory.hasOwnProperty("raw meat")) {
        btnCooldown(btn, 10000, 
            (function(){cookStuff(btn)}));
        Player.inventory["raw meat"] -= 5;
        sendMessage("You cook some rations.");
        if(Player.inventory["raw meat"] <= 0){
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
    $('<div>').addClass('bossScene').appendTo('.centerPanel');

    //Main Scene Task stuff
    $('<h1>').addClass('areaHeader').text('Floor 1').appendTo('.mainScene')
    $('<div>').addClass('currentTask').appendTo('.mainScene')
    $('<div>').attr("id","mainBar").appendTo('.mainScene');
    $('<div>').attr("id","progressBarMain").appendTo("#mainBar");

    //Boss Scene
    $('<h1>').addClass('bossHeader').text('Floor 1').appendTo('.bossScene')
    $('<div>').addClass('currentTask').appendTo('.bossScene')
    $('<div>').attr("id","bossBar").appendTo('.bossScene');
    $('<div>').attr("id","bossBarMain").appendTo("#bossBar");
    $('<div>').addClass('timer').attr("id","timer").appendTo('.bossScene');
    

    //Rest Scene stuff
    $('<h1>').addClass('campTitle').text('Camp').appendTo('.restScene');
    $('<div>')
    .text('Cook')
    .addClass('btn')
    .attr("id","btn-cook")
    .click(function(){cookStuff('btn-cook');})
    .appendTo('.restScene');
    $('<div>')
    .text('Eat')
    .addClass('btn')
    .attr("id","btn-eat")
    .click(function(){Player.eat()})
    .appendTo('.restScene')

    //Task/Area scene stuff
    //addButton("btn-f1","Floor 1",'.taskScene', function(){Tasks.initTask(0)});
    $('<h1>').addClass('towerHeader').text('The Tower').appendTo('.taskScene');
    $('<div>')
    .addClass('btn')
    .attr("id","btn-f1")
    .text('Floor 1')
    .click(function(){switchScene('.mainScene', "btn-f1",0);})
    .appendTo('.taskScene');

    //Player Info
    $('<div>').addClass('gold').html('Gold: 0').appendTo('.infoPanel');
    $('<div>').addClass('xp').text('Experience: 0').appendTo('.infoPanel');
    $('<div>').addClass('xpReq').text('Next Lvl: 20').appendTo('.infoPanel')
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
    .prependTo('.menuBar'); //makes more sense for this to be a go back type context?

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

    $('<div>')
    .addClass('btn')
    .attr("id","btn-shop")
    .text('Scavenger')
    .click(function(){switchScene(".shopScene",'#btn-shop');})
    .appendTo('.menuBar');

    /*
    Tasks.startNewTask();
    let task = Tasks.taskList[0];
    addButton("btn-boss","Fight Boss",".startScene",function(){
        switchScene('.bossScene', 'btn-boss',0);
        fightBoss(task);
    });
    */
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

var msgId = 0;

function sendMessage(msg) {
    let _max_msgs = 8

    if (msgId == 0) {
        $('<div>').addClass('msg').attr("id","msg0").text(msg).prependTo('.messageBox');
        $('.msg').animate({opacity: '100%'}, 500, 'linear');
        msgId++;
    } else if (msgId <= _max_msgs) { //Push new msgs till max msgs
        for (i = (msgId - 1); i >= 0; i--) {
            $('#msg'+i).attr("id","msg"+(i+1));
        }
        $('<div>').addClass('msg').attr("id","msg0").text(msg).prependTo('.messageBox');
        $('.msg').animate({opacity: '100%'}, 500, 'linear');
        msgId++;
    }

    if (msgId >= _max_msgs) {  //pop em
        msgId = _max_msgs;
        $('#msg'+(_max_msgs-1)).remove();
    }
}

function startGame() {
    $('.restScene').css("top","1000");
    $('.startScene').css("visibility","visible");

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
    Player.gainGold(task);
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
        Tasks.doTask(task);
    } else {
        if (task.taskStage < 0){
            task.taskStage += 1;
        } else if (task.taskStage == 0) {
            task.taskStage += 1;
            task.isBoss = true;
            sendMessage("You find a staircase heading upward.");
            addButton("btn-boss","Fight Boss",".mainScene",function(){
                //$('#bossBarMain').css("width","0%");
                switchScene('.bossScene',"btn-boss",task.taskId);
                fightBoss(task);
            });
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
        Tasks.doTask(task);
    }
}

function updateKill(task) {
    task.numTasks += 1;

    /* UPDATE PLAYER STATS*/
    Player.gainXp(task.xpMod);
    var nrgMod = Player.handleEnergy();
    /* UPDATE PLAYER STATS*/

    if(task.numTasks <= task.maxTasks) {
        $('.currentTask')
            .text("Killing... ("+task.numTasks+"/"+task.maxTasks+")");
        move('#progressBarMain')
            .ease('linear') //apparently this sets the style to be linear forever (???)
            .set('width', '100%')
            .duration(900)
            .end(function(){
                $('#progressBarMain').css("width","0%");
            });
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
        Tasks.doTask(task);
    }
}

function fightBoss(task) {
    clearTimeout(taskTimer);
    clearTimeout(Timer.counter);
    clearTimeout(task.bossTimer);

    $('#btn-returnFloor').remove();
    
    move('#bossBarMain')
        .set('width', '0%')
        .end();

    $('#btn-boss').remove();
    $('.timer').css("display","block")
    $('.currentTask')
        .text("Boss");

    if (Player.power < task.bossPower) {
        $('#bossBarMain').css("width","100%");
        $('.timer').text("∞ secs");
        sendMessage("You don't feel powerful enough to defeat this boss.");
    } else {
        let bossTime = Math.round((Player.defense / task.bossPower) * 600);
        let bossKillTime = Math.round((task.bossDef / Player.power) * 60000); //millis for setTimeout?

        move('#bossBarMain')
            .ease('linear')
            .set('width', '100%')
            .duration(bossKillTime)
            .end();
        
        task.bossTimer = setTimeout(function(){  //requestAnimationFrame?
            clearInterval(Timer.counter);
            Tasks.completeTask(task);
            task.taskCompleteFlag = true;

            /* PLAYER REWARDS */

            /* PLAYER REWARDS */
            console.log("BOSS KILL");
        }, bossKillTime)
        Timer.setTimer(bossTime, task); //XX.X seconds
    }

    $('<div>')
    .addClass('btn')
    .attr("id","btn-returnFloor")
    .text("Go Back")
    .click(function(){
        switchScene('.mainScene','btn-returnFloor',task.taskId);
        clearTimeout(task.bossTimer);
        clearInterval(Timer.counter);
    })
    .appendTo('.bossScene');
}

function displayCount(count) {
    var res = count / 10;
    $('.timer').text(res + ' secs to break through your defences.')
    //document.getElementById("timer").innerHTML = res.toPrecision(count.toString().length) + " secs";
}

initPage();
initSmith();
initLootTables(); //might need to move this to be area dependent
if (newGame) {
    startGame();
}

console.log()