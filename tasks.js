var Tasks = {
    taskName: "",
    taskStage: 0,
    taskCompleteFlag: false,
    maxTasks: 0,
    onTask: false,
    isKilling: false,
    isLooting: false,
    taskIncr: 1,
    numTasks: 0,
    tasksComplete: 0,
    taskList: [],

    Task: function(options) {
        this.taskName = options.taskName;
        this.taskStage = options.taskStage;
        this.taskCompleteFlag = options.taskCompleteFlag;
        this.maxTasks = options.maxTasks;
        this.onTask = options.onTask;
        this.isKilling = options.isKilling;
        this.isLooting = options.isLooting;
        this.taskIncr = options.taskIncr;
        this.numTasks = options.numTasks;
    },

    startNewTask: function() {
        let task = new Tasks.Task({
            taskName: ("Floor"+(this.tasksComplete + 1)),
            taskStage: this.tasksComplete + 1,
            taskIncr: 1,
            maxTasks: 0,
            numTasks: 1,
            taskCompleteFlag: false,
            onTask: false,
            isKilling: false,
            isLooting: false
        })

        this.taskList.push(task);
    },

    initTask: function(id) {
        if (typeof this.taskList[id] == 'undefined') {
            this.startNewTask();
        }
        switchScene('.mainScene');
        let task = this.taskList[id];

        if (!(task.isLooting && task.isKilling)){ //if it's a new task
            task.isKilling = true;
            task.maxTasks = getRandomInt(3, 10);
            $('#progressBarMain').css("width","0%");
            $('.currentTask')
            .text("Killing... ("+task.numTasks+"/"+task.maxTasks+")");
            this.doTask(task);
        } else if (task.isKilling) {
            $('.currentTask')
            .text("Killing... ("+task.numTasks+"/"+task.maxTasks+")");
            this.doTask(task);
        } else if (task.isLooting) {
            $('.currentTask')
            .text("Looting... ("+task.numTasks+"/"+task.maxTasks+")");
            this.doTask(task);
        }
    },

    doTask: function(task) {
        if (task.isKilling) {
            /*
            move('#progressBarMain')
                .set('width', '100%')
                .duration(900)
                .end(function(){
                    $('#progressBarMain').css("width","0%");
                });*/
            taskTimer = setTimeout(function(){updateKill(task);}, 1000);
        } else {
            /*
            move('#progressBarMain')
                .set('width', '100%')
                .duration(900)
                .end(function(){
                    $('#progressBarMain').css("width","0%");
                });*/
            taskTimer = setTimeout(function(){updateLoot(task);}, 1000);
        }
    },
    
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
