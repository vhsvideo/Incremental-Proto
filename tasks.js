var Tasks = {
    taskName: "",
    taskStage: 0,
    taskId: 0,
    taskCompleteFlag: false,
    maxTasks: 0,
    onTask: false,
    isKilling: false,
    isLooting: false,
    isBoss: false,
    bossPower: 10,
    bossdef: 10,
    bossTimer: undefined,
    taskIncr: 1,
    numTasks: 0,
    xpMod: 1,
    goldMod: 1,
    tasksComplete: 0,
    taskList: [],

    Task: function(options) {
        this.taskName = options.taskName;
        this.taskStage = options.taskStage;
        this.taskId = options.taskId;
        this.taskCompleteFlag = options.taskCompleteFlag;
        this.maxTasks = options.maxTasks;
        this.onTask = options.onTask;
        this.isKilling = options.isKilling;
        this.isLooting = options.isLooting;
        this.isBoss = options.isBoss;
        this.bossPower = options.bossPower;
        this.bossDef = options.bossDef;
        this.taskIncr = options.taskIncr;
        this.numTasks = options.numTasks;
        this.bossTimer = options.bossTimer;
        this.xpMod = options.xpMod;
        this.goldMod = options.goldMod;
    },

    startNewTask: function(id) {
        let task = new Tasks.Task({
            taskName: ("Floor"+(this.tasksComplete + 1)),
            taskStage: 0,
            taskId: id,
            taskIncr: 1,
            maxTasks: 0,
            numTasks: 1,
            taskCompleteFlag: false,
            onTask: false,
            isKilling: false,
            isLooting: false,
            isBoss: false,
            bossPower: 10,
            bossDef: 10,
            bossTimer: undefined,
            xpMod: Math.round((1+id)*1.1),
            goldMod: Math.round((1+id)*1.1)
        });
        this.taskList.push(task);
    },

    initTask: function(id) {
        if (typeof this.taskList[id] == 'undefined') {
            this.startNewTask(id);
        }
        
        let task = this.taskList[id];

        if ((task.isLooting == false) && (task.isKilling == false)){ //if it's a new task
            task.isKilling = true;
            task.maxTasks = getRandomInt(3, 10);

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

    //this could be used on the main game loop - keep track of calls?  date.now shenanigans? etc.
    doTask: function(task) {
        clearTimeout(taskTimer);
        if (task.isKilling) {
            taskTimer = setTimeout(function(){updateKill(task);}, 1000);
        } else if (task.isLooting){
            taskTimer = setTimeout(function(){updateLoot(task);}, 1000);
        }
    },

    completeTask: function(task) {
        Tasks.tasksComplete += 1;
        let floorLvl = Tasks.tasksComplete + 1;
        $('<div>')
        .addClass('btn')
        .attr("id",("btn-f"+floorLvl))
        .text('Floor '+(floorLvl))
        .click(function(){switchScene('.mainScene', ("btn-f"+floorLvl), Tasks.tasksComplete);})
        .appendTo('.taskScene');
    }
}
