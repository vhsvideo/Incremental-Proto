var Timer = {
    initial: 30000,
    count: 0,
    counter: undefined, //10 will  run it every 100th of a second
    initialMillis: undefined,

    countdown: function(){
        console.log("Count inner: "+Timer.count);
        if (Timer.count <= 0) {
            clearInterval(Timer.counter);
            return;
        }
        Timer.count--;
        displayCount(Timer.count);
    },

    setTimer: function(startTime){
        this.initial = startTime;
        this.count = startTime;
        this.initialMillis = startTime;
        console.log("Count: "+this.count);
        this.counter = setInterval(this.countdown, 100);
    }
};