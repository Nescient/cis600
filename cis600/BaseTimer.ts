abstract class BaseTimer {
    element: HTMLElement;
    timerToken: number;
    timerTimeout: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.timerTimeout = 50;
        this.updateTime();
        return;
    }

    updateTime() {
        this.element.innerText = new Date().toUTCString();
        return;
    }

    start() {
        this.timerToken = setInterval(function () {
            this.updateTime();
            this.dostuff()
        }, this.timerTimeout);
        return;
    }

    stop() {
        clearTimeout(this.timerToken);
        return;
    }

    abstract dostuff();

}
