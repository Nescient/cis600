var Greeter = (function () {
    function Greeter(element, svg) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
        this.x = this.y = 0;
        this.a = 1.4;
        this.b = 0.3;
        this.svg = svg;
        init_svg();
        // rule: x_n+1 = 1 - ax_n^2 + y_n
        //       y_n+1 = bx_n
        //this.svg = this.element.append('svg')
        //   .attr('height', 400)
        //    .attr('width', 800);
        ///<reference path="d3.d.ts" />
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.dostuff(); }, 50);
    };
    Greeter.prototype.dostuff = function () {
        this.span.innerHTML = new Date().toUTCString();
        // plot x, y
        //var circle = document.createElement(';
        //this.svg.appendChild(circle);
        plot(this.x, this.y);
        var x = 1 - this.a * (this.x * this.x) + this.y;
        var y = this.b * this.x;
        this.x = x;
        this.y = y;
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();
window.onload = function () {
    var el = document.getElementById('content');
    var s1 = document.getElementById('graph');
    var greeter = new Greeter(el, s1);
    greeter.start();
};
//class Greeter {
//    element: HTMLElement;
//    span: HTMLElement;
//    timerToken: number;
//    constructor(element: HTMLElement) {
//        this.element = element;
//        this.element.innerHTML += "The time is: ";
//        this.span = document.createElement('span');
//        this.element.appendChild(this.span);
//        this.span.innerText = new Date().toUTCString();
//    }
//    start() {
//        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
//    }
//    stop() {
//        clearTimeout(this.timerToken);
//    }
//}
//window.onload = () => {
//    var el = document.getElementById('content');
//    var greeter = new Greeter(el);
//    greeter.start();
//}; 
//# sourceMappingURL=app.js.map