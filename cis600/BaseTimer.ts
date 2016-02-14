/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

abstract class BaseTimer {
    timeId: string;
    timerToken: number;
    timerTimeout: number;

    constructor(elementId: string) {
        this.timeId = elementId;
        this.timerTimeout = 50;
        this.updateTime();
        return;
    }

    updateTime() {
        $("#" + this.timeId).text(new Date().toUTCString());
        return;
    }

    start() {
        this.timerToken = setInterval(() => function () {
           this.updateTime();
        this.dostuff();
            $("#timep").text(new Date().toUTCString() + " oheayah");
            return;
        }, this.timerTimeout);
        return;
    }

    stop() {
        clearTimeout(this.timerToken);
        return;
    }

    abstract dostuff();

}
