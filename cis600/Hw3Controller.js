var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
var Hw3Controller = (function (_super) {
    __extends(Hw3Controller, _super);
    function Hw3Controller(elementId) {
        _super.call(this, elementId);
        this.currentRow = [];
        this.data = [];
        this.a = Math.random();
        this.b = Math.random();
        // http://stackoverflow.com/a/20066663
        //this.currentRow = Array.apply(null, { length: length }).map(Function.call, Math.random);
        for (var i = 0; i < length; ++i) {
            this.currentRow.push(Math.random());
        }
        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 2).attr("height", length * 20);
        //svg.on("mousemove", () => this.onMouse());
        this.svg = svg;
        this.graphRow(this.currentRow, 0);
        //this.statsBox = d3.select("main").append("div");
        //this.statsBox.attr("id", "hw2stats");
        return;
    }
    Hw3Controller.prototype.dostuff = function () {
        var next_row = this.nextRow(this.currentRow);
        this.data.push(this.currentRow);
        this.graphRow(next_row, this.data.length);
        this.currentRow = next_row;
        return;
    };
    Hw3Controller.prototype.realMod = function (n, m) {
        // javascript mod doesnt work with negative numbers
        //http://stackoverflow.com/a/17323608
        return ((n % m) + m) % m;
    };
    Hw3Controller.prototype.nextRow = function (row) {
        var rval = Array(row.length);
        for (var i = 0; i < row.length; ++i) {
            var previous = row[this.realMod(i - 1, row.length)];
            var current = row[this.realMod(i, row.length)];
            var next = row[this.realMod(i + 1, row.length)];
            rval[i] = this.poly(previous, current, next);
            if (rval[i] > 1) {
                alert(rval[i]);
            }
            else if (rval[i] < 0) {
                alert(rval[i]);
            }
        }
        return rval;
    };
    // taken from Blair's ALife1Dim Java program
    Hw3Controller.prototype.poly = function (u, x, v) {
        return (0.5 - 0.5 * Math.cos(Math.PI * (this.a + (this.a - this.b) * v + this.b * u * v - 2 * u * x * v)));
    };
    Hw3Controller.prototype.graphRow = function (row, yIndex) {
        var total_width = parseInt(this.svg.style("width"));
        var rec_width = total_width / row.length;
        var y_index = yIndex * rec_width;
        var context = this.svg.node().getContext("2d");
        row.forEach(function (d, i) {
            var hexstring = Math.round(row[i] * 0xFFFFFF).toString(16);
            hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
            context.beginPath();
            context.rect(i * rec_width, y_index, rec_width, rec_width);
            context.fillStyle = "#" + hexstring;
            context.fill();
            //if (row[i] == 0 && context.fillStyle != "#000000") {
            //    var stop = true;
            //}
            //console.log(row[i].toString() + " -> " + context.fillStyle);
            context.closePath();
        });
    };
    return Hw3Controller;
})(BaseTimer);
//# sourceMappingURL=Hw3Controller.js.map