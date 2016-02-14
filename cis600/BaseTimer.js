/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
var BaseTimer = (function () {
    function BaseTimer(elementId) {
        this.timeId = elementId;
        this.timerTimeout = 50;
        this.updateTime();
        return;
    }
    BaseTimer.prototype.updateTime = function () {
        $("#" + this.timeId).text(new Date().toUTCString());
        return;
    };
    BaseTimer.prototype.start = function () {
        this.timerToken = setInterval(function () { return function () {
            this.updateTime();
            this.dostuff();
            $("#timep").text(new Date().toUTCString() + " oheayah");
            return;
        }; }, this.timerTimeout);
        return;
    };
    BaseTimer.prototype.stop = function () {
        clearTimeout(this.timerToken);
        return;
    };
    return BaseTimer;
})();
//# sourceMappingURL=BaseTimer.js.map