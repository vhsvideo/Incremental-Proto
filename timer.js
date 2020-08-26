var Timer = {
    initial: 30000,
    count: 0,
    counter: undefined, //10 will  run it every 100th of a second
    initialMillis: undefined,

    countdown: function(diff){
        console.log("diff: "+diff);
        if (Timer.count <= 0) {
            clearInterval(Timer.counter);
            return;
        }
        Timer.count -= 1 * diff;
        displayCount(Timer.count);
    },

    setTimer: function(startTime){
        this.initial = startTime;
        this.count = startTime;
        var lastUpdate = Date.now();
        this.counter = setInterval(function(){
            var thisUpdate = Date.now();
            var diff = (thisUpdate - lastUpdate); //if this function isn't being called every 100ms, then there will be a difference
            diff = Math.round(diff / 100); //how many times this function should have been called
            Timer.countdown(diff); //the diff between this - last should be ~100 if in active tab
            lastUpdate = thisUpdate;
        }, 100);
    }
};