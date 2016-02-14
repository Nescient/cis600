var BaseTimer = (function () {
    function BaseTimer(element) {
        this.element = element;
        this.timerTimeout = 50;
        this.updateTime();
        return;
    }
    BaseTimer.prototype.updateTime = function () {
        this.element.innerText = new Date().toUTCString();
        return;
    };
    BaseTimer.prototype.start = function () {
        this.timerToken = setInterval(function () {
            this.updateTime();
            this.dostuff();
        }, this.timerTimeout);
        return;
    };
    BaseTimer.prototype.stop = function () {
        clearTimeout(this.timerToken);
        return;
    };
    return BaseTimer;
})();
//# sourceMappingURL=BaseTimer.js.map