var Tasks = {
    taskProg: 0,
    taskCompleteFlag: false,
    maxTasks: 0,
    onTask: false,
    isKilling: false,
    isLooting: false,
    taskIncr: 1,
    numTasks: 0,

    startTask: function() {
        if (this.isKilling) {
            $('#progressBarMain').css("width","0%");
            $('.currentTask')
            .text("Killing... ("+this.numTasks+"/"+Tasks.maxTasks+")");
        } else if (this.isLooting) {
            $('#progressBarMain').css("width","0%");
            $('.currentTask')
            .text("Looting... ("+this.numTasks+"/"+Tasks.maxTasks+")");
        } else {
            this.numTasks = 0;
            this.maxTasks = getRandomInt(2,10);
            this.taskCompleteFlag = false;
            this.onTask = true;
            $('.currentTask').text("Killing (0/" + this.maxTasks + ")");
        }
    },

    resetTask: function() {
        this.numTasks = 0;
        this.maxTasks = getRandomInt(2,10);
        this.taskCompleteFlag = false;
        this.onTask = true;
    }
}
