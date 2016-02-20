var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
function gRealMod(n, m) {
    // javascript mod doesnt work with negative numbers
    //http://stackoverflow.com/a/17323608
    return ((n % m) + m) % m;
}
function gToHexString(val) {
    var hexstring = Math.round(val * 0xFFFFFF).toString(16);
    hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
    return hexstring;
}
var ColumnCount = (function () {
    function ColumnCount(column) {
        this.column = 0;
        this.counts = [];
        this.column = column;
        return;
    }
    ColumnCount.prototype.addCount = function (str) {
        this.counts[str] = (this.counts[str] ? this.counts[str] + 1 : 1);
        return;
    };
    ColumnCount.prototype.getEntropy = function (rowCount) {
        var entropy = 0;
        var valid_strings = Object.keys(this.counts);
        var total_count = 0;
        for (var i = 0; i < valid_strings.length; ++i) {
            var count = this.counts[valid_strings[i]];
            var weight = count / rowCount;
            entropy += weight * (Math.log(weight) / Math.log(2));
            total_count += count;
        }
        return 0 - entropy;
    };
    return ColumnCount;
})();
var CellularAutomaton = (function () {
    function CellularAutomaton(a, b, row) {
        this.a = 0;
        this.b = 0;
        this.counts = [];
        this.currentRow = [];
        this.rowCount = 0;
        this.a = a;
        this.b = b;
        this.currentRow = row;
        if (this.currentRow) {
            this.rowCount = 1;
            this.counts = Array(this.currentRow.length);
            for (var i = 0; i < this.counts.length; ++i) {
                this.counts[i] = new ColumnCount(i);
            }
            this.updateCounts();
        }
        return;
    }
    CellularAutomaton.prototype.getA = function () {
        return this.a;
    };
    CellularAutomaton.prototype.getB = function () {
        return this.a;
    };
    CellularAutomaton.prototype.makeNewRow = function () {
        var len = this.currentRow.length;
        var new_row = Array(len);
        for (var i = 0; i < len; ++i) {
            var previous = this.currentRow[gRealMod(i - 1, len)];
            var current = this.currentRow[gRealMod(i, len)];
            var next = this.currentRow[gRealMod(i + 1, len)];
            new_row[i] = this.poly(this.a, this.b, previous, current, next);
            if (new_row[i] > 1) {
                alert(new_row[i]);
            }
            else if (new_row[i] < 0) {
                alert(new_row[i]);
            }
        }
        return this.setNextRow(new_row);
    };
    // taken from Blair's ALife1Dim Java program
    CellularAutomaton.prototype.poly = function (a, b, u, x, v) {
        return (0.5 - 0.5 * Math.cos(Math.PI * (a + (a - b) * v + b * u * v - 2 * u * x * v)));
    };
    CellularAutomaton.prototype.setNextRow = function (row) {
        this.currentRow = row;
        ++this.rowCount;
        this.updateCounts();
        return;
    };
    CellularAutomaton.prototype.updateCounts = function () {
        for (var i = 0; i < this.currentRow.length; ++i) {
            var value = gToHexString(this.currentRow[gRealMod(i, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 1, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 2, this.currentRow.length)]);
            this.counts[i].addCount(value);
        }
    };
    CellularAutomaton.prototype.getEntropy = function () {
        var entropy = this.counts[0].getEntropy(this.rowCount);
        for (var i = 1; i < this.counts.length; ++i) {
            var new_entropy = this.counts[i].getEntropy(this.rowCount);
            if (new_entropy < entropy) {
                entropy = new_entropy;
            }
        }
        return entropy;
    };
    return CellularAutomaton;
})();
var Hw3Controllerv2 = (function (_super) {
    __extends(Hw3Controllerv2, _super);
    function Hw3Controllerv2(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.data = [];
        this.increment = 0.01;
        var a = 0;
        var b = 0;
        var data = [];
        for (var i = 0; i < length; ++i) {
            data.push(Math.random());
        }
        for (var b = 0; b <= 1; b += this.increment) {
            for (var a = 0; a <= 1; a += this.increment) {
                var ca = new CellularAutomaton(a, b, data);
                this.data.push(ca);
            }
        }
        var svg = d3.select("main").append("svg");
        svg.attr("width", length * 3).attr("height", length * 3);
        svg.on("mousemove", function () { return _this.onMouse(); });
        this.svg = svg;
        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw3stats");
        return;
    }
    Hw3Controllerv2.prototype.onMouse = function () {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var col_number = Math.floor(mouse_pos[0] / 2);
            var row_number = Math.floor(mouse_pos[1] / 2);
        }
        return;
    };
    Hw3Controllerv2.prototype.dostuff = function () {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var num_boxes = (1 / this.increment) + 1;
        var heat_data = [];
        for (var i = 0; i < this.data.length; ++i) {
            var ca = this.data[i];
            ca.makeNewRow();
            var entropy = ca.getEntropy();
            heat_data.push({
                value: entropy,
                x: ca.getA() / this.increment,
                y: ca.getB() / this.increment,
                color: "#" + gToHexString(entropy)
            });
        }
        this.graphHeatMap(heat_data);
        return;
    };
    Hw3Controllerv2.prototype.graphHeatMap = function (data) {
        var total_width = parseInt(this.svg.style("width"));
        var total_height = parseInt(this.svg.style("height"));
        var num_boxes = (1 / this.increment) + 1;
        var size = total_width / num_boxes;
        var rects = this.svg.selectAll("rect")
            .data(data, function (d, i) { return d.value; });
        rects.exit().remove();
        rects.enter().append("rect")
            .attr("x", function (d) {
            return d.x * size;
        })
            .attr("y", function (d) {
            return d.y * size;
        })
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) {
            return d.color;
        });
    };
    return Hw3Controllerv2;
})(BaseTimer);
//# sourceMappingURL=Hw3ControllerPart2.js.map