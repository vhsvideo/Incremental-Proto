var msgBoxShow = true;



function onKill(){
    Player.gold += 1;
    Player.xp += 2;

    $('.gold').text("Gold: " + Player.gold);
    $('.xp').text("Experience: " + Player.xp);
    
    $('#progressBarMain').css("width", "0%");
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

    //Player Info
    $('<div>').addClass('gold').text('Gold: 0').appendTo('.infoPanel');
    $('<div>').addClass('xp').text('Experience: 0').appendTo('.infoPanel');
}

function initTimers(){
    $('<div>').attr("id","mainBar").appendTo("#main");
    $('<div>').attr("id","progressBarMain").appendTo("#mainBar");

    var mainTimer = Timer.setTimer("#progressBarMain", 2000, onKill); //Main timer in middle
}







init();
initTimers();

