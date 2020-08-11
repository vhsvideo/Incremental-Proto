var Timer = {
    setTimer: function(barId, speed, callback) {
        window.setInterval(function(){
            $(barId).animate({width: '100%'}, speed, 'linear', function(){
                $(barId).css("width", "0%");
            });
            onKill();
        }, speed);
        
    },

    resetBar: function(barId) {
        $(barId).css("width", "0%");
    },
};