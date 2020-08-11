var Timer = {
    setTimer: function(barId, speed, callback) {
        //$('.gold').text('300');
        
        window.setInterval(function(){
            $(barId).animate({width: '100%'}, speed, 'linear', callback);
        }, speed);

        /*
        window.setInterval(function(){
            Player.gold += 1;
            $('.gold').text("Gold: " + Player.gold);
        }, speed);*/
    },

    testFunc: function(barId, speed) {
        
        $(barId).animate({width: '100%'}, speed, 'linear');
    }
};