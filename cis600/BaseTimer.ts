// Copyright © Sam Savage 2016
/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

abstract class BaseTimer {
    timeId: string;
    timerToken: number;
    timerTimeout: number;

    constructor(elementId: string) {
        this.timeId = elementId;
        this.timerTimeout = 10;
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
        return;
    }

    abstract dostuff();

}
