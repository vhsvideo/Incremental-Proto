var msgBoxShow = true;



function onKill(){
    Player.gold += 1;

    if (Player.xp + 2 >= Player.xpReq) {
        Player.level += 1;
        Player.xp = 0;
        Player.xpReq *= 2;
        $('.level').text("Level: " + Player.level);
    } else {
        Player.xp += 2;
    }

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
    $('<div>').addClass('gold').text('Gold: 0').appendTo('.infoPanel');
    $('<div>').addClass('xp').text('Experience: 0').appendTo('.infoPanel');
    $('<div>').addClass('level').text('Level: 1').appendTo('.infoPanel');
}

function initTimers(){
    $('<div>').attr("id","mainBar").appendTo(".centerPanel");
    $('<div>').attr("id","progressBarMain").appendTo("#mainBar");

    var mainTimer = Timer.setTimer("#progressBarMain", 1000); //Main timer in middle
}



init();
//initTimers();

