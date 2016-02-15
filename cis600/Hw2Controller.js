var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
var Hw2Controller = (function (_super) {
    __extends(Hw2Controller, _super);
    //xScaleMouse: any;
    function Hw2Controller(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.currentRow = [];
        this.data = [];
        // http://stackoverflow.com/a/20066663
        //this.currentRow = Array.apply(null, { length: length }).map(Function.call, Math.random);
        for (var i = 0; i < length; ++i) {
            this.currentRow.push(Math.random() < 0.5);
        }
        //this.xScaleMouse = d3.scale.linear()
        //    .domain([0, length * 2])
        //    .range([0, this.currentRow.length]);
        //this.yScale = d3.scale.linear()
        //    .domain([-10, 10])
        //    .range([1000, 0]);
        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 2).attr("height", length * 2);
        svg.on("mousemove", function () { return _this.onMouse(); });
        // svg.on("mousemove",this.onMouseover);
        //svg.on("mousemove", () => function() {
        //    var d3this = d3.event;//.currentTarget;
        //    console.log(this);
        //    var canvas = d3.select(this);
        //    var width = parseInt(canvas.style("width"));
        //    var height = parseInt(canvas.style("height"));
        //    var mouse_pos = d3.mouse(this);
        //    var x = mouse_pos[0];
        //    var y = mouse_pos[1];
        //    console.log(x / 2 + " " + y / 2);
        //    //console.log(this.data[Math.floor(y / 2)][Math.floor(x / 2)]);
        //    //var mousePos = getMousePos(canvas, evt);
        //    //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        //    //writeMessage(canvas, message);
        //});
        this.svg = svg;
        this.graphRow(this.currentRow, 0);
        var msg_box = d3.select("main").append("div");
        msg_box.attr("id", "hw2stats");
        this.stats = msg_box.append("p");
        //msgBox.text("hellow wolrld and sutff");
        //msgBox.style("display:line");
        return;
    }
    Hw2Controller.prototype.onMouseover = function (d, i) {
        //console.log(d3.select(d3.event.currentTarget));
    };
    Hw2Controller.prototype.onMouse = function () {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var x = mouse_pos[0];
            var y = mouse_pos[1];
            console.log(x / 2 + " " + y / 2);
        }
        //console.log(this.data[Math.floor(y / 2)][Math.floor(x / 2)]);
        //var mousePos = getMousePos(canvas, evt);
        //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        //writeMessage(canvas, message);
        return;
    };
    Hw2Controller.prototype.dostuff = function () {
        var next_row = this.nextRow(this.currentRow);
        this.data.push(this.currentRow);
        this.graphRow(next_row, this.data.length);
        this.currentRow = next_row;
        return;
    };
    Hw2Controller.prototype.realMod = function (n, m) {
        // javascript mod doesnt work with negative numbers
        //http://stackoverflow.com/a/17323608
        return ((n % m) + m) % m;
    };
    Hw2Controller.prototype.nextRow = function (row) {
        var rval = Array(row.length);
        for (var i = 0; i < row.length; ++i) {
            var previous = row[this.realMod(i - 1, row.length)];
            var current = row[this.realMod(i, row.length)];
            var next = row[this.realMod(i + 1, row.length)];
            rval[i] = this.lookupRule(previous, current, next);
        }
        return rval;
    };
    Hw2Controller.prototype.lookupRule = function (p, c, n) {
        // https://en.wikipedia.org/wiki/Rule_110
        // current state: 111 	110 	101 	100 	011 	010 	001 	000
        // new state:      0     1       1       0       1       1       1       0
        var states = [false, true, true, true, false, true, true, false];
        var index = (p ? 4 : 0) + (c ? 2 : 0) + (n ? 1 : 0);
        return (index < states.length ? states[index] : false);
    };
    Hw2Controller.prototype.graphRow = function (row, yIndex) {
        var total_width = parseInt(this.svg.style("width"));
        var rec_width = total_width / row.length;
        var y_index = yIndex * rec_width;
        var context = this.svg.node().getContext("2d");
        //var total_height = parseInt(this.svg.style("height"));
        //if (total_height < y_index) {
        //    var svg = d3.select("main").append("canvas");
        //    svg.attr("width", total_width).attr("height", y_index * 2);
        //    this.svg = svg;
        //}
        row.forEach(function (d, i) {
            context.beginPath();
            context.rect(i * rec_width, y_index, rec_width, rec_width);
            if (row[i]) {
                context.fillStyle = "#000";
                context.fill();
            }
            context.closePath();
        });
        //for (var i: number = 0; i < row.length; ++i) {
        //    this.svg.append("rect").attr({
        //        x: i * rec_width,
        //        y: y_index,
        //        width: rec_width,
        //        height: rec_width,
        //        "fill": "#000",
        //        "fill-opacity": row[i] ? 1 : 0
        //    });
        //}
    };
    Hw2Controller.prototype.getStats = function (data, rowIndex, colIndex, width) {
        var rval = {};
        for (var i = 0; i < colIndex; ++i) {
            var row = data[i];
            var local_width = Math.min(Math.floor(width), row.length);
            var start_index = colIndex - Math.floor(local_width / 2);
            //            var max_left = local_width - max_right;
            var value = this.getNumber(row, start_index, local_width);
            rval[value]++;
        }
        return rval;
    };
    Hw2Controller.prototype.getNumber = function (data, start, length) {
        var rval = 0;
        for (var i = start; i < (start + length); ++i) {
            rval += (data[this.realMod(i, data.length)] ? (1 << (start - i)) : 0);
        }
        return rval;
    };
    return Hw2Controller;
})(BaseTimer);
//# sourceMappingURL=Hw2Controller.js.map