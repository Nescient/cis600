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
        this.timerToken = setInterval(() => this.onTimerElapse(), this.timerTimeout);
        return;
    }

    stop() {
        clearInterval(this.timerToken);
        return;
    }

    onTimerElapse() {
        this.updateTime();
        this.dostuff();
        //$("#timep").text(new Date().toUTCString() + " oheayah");
        return;
    }

    abstract dostuff();

}
