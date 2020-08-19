var Tasks = {
    taskProg: 0,
    taskCompleteFlag: false,
    maxTasks: 0,
    onTask: false,
    taskIncr: 1,
    numTasks: 0,

    startTask: function() {
        this.numTasks = 0;
        this.maxTasks = getRandomInt(2,10);
        this.onTask = true;
        $('.currentTask').text("Killing (0/" + this.maxTasks + ")");
    }
}
