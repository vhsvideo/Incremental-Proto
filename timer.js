var Timer = {
    setTimer: function(barId, speed, callback) {
        //Can't put function at the end of animate, cause animation suspends when tab is inactive
        //Can't clear interval - doesn't return right id?  try let?
        window.setInterval(function(){
            $(barId).animate({width: '100%'}, speed, 'linear', function(){
                $(barId).css("width", "0%");
            });
            onKill();
        }, speed);
        
    },

    resetBar: function(barId) {
        $(barId).css("width", "0%");
    }
};