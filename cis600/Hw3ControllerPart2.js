var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
var CellularAutomaton = (function () {
    function CellularAutomaton() {
    }
    return CellularAutomaton;
})();
var Hw3Controllerv2 = (function (_super) {
    __extends(Hw3Controllerv2, _super);
    function Hw3Controllerv2(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.data = [];
        this.increment = 0.1;
        var a = 0;
        var b = 0;
        var data = [];
        for (var i = 0; i < length; ++i) {
            data.push(Math.random());
        }
        for (var b = 0; b <= 1; b += this.increment) {
            for (var a = 0; a <= 1; a += this.increment) {
                this.data.push({ a: a, b: b, data: [data] });
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
        var heat_data = [];
        for (var i = 0; i < this.data.length; ++i) {
            var row = this.data[i].data[this.data[i].data.length - 1];
            this.data[i].data.push(this.nextRow(this.data[i].a, this.data[i].b, row));
            // somehow get a single shannons entropy for all of data[i]
            // this will be heat map x,y
            var entropy = Math.random();
            var width = parseInt(this.svg.style("width"));
            var height = parseInt(this.svg.style("height"));
            var num_boxes = (1 / this.increment) + 1;
            heat_data.push({
                value: entropy,
                x: this.data[i].a / this.increment,
                y: this.data[i].b / this.increment,
                color: "#" + this.toHexString(entropy)
            });
        }
        this.graphHeatMap(heat_data);
        return;
    };
    Hw3Controllerv2.prototype.realMod = function (n, m) {
        // javascript mod doesnt work with negative numbers
        //http://stackoverflow.com/a/17323608
        return ((n % m) + m) % m;
    };
    Hw3Controllerv2.prototype.nextRow = function (a, b, row) {
        var rval = Array(row.length);
        for (var i = 0; i < row.length; ++i) {
            var previous = row[this.realMod(i - 1, row.length)];
            var current = row[this.realMod(i, row.length)];
            var next = row[this.realMod(i + 1, row.length)];
            rval[i] = this.poly(a, b, previous, current, next);
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
    Hw3Controllerv2.prototype.poly = function (a, b, u, x, v) {
        return (0.5 - 0.5 * Math.cos(Math.PI * (a + (a - b) * v + b * u * v - 2 * u * x * v)));
    };
    Hw3Controllerv2.prototype.toHexString = function (val) {
        var hexstring = Math.round(val * 0xFFFFFF).toString(16);
        hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
        return hexstring;
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
    Hw3Controllerv2.prototype.graphRow = function (row, yIndex) {
        var total_width = parseInt(this.svg.style("width"));
        var rec_width = total_width / row.length;
        var y_index = yIndex * rec_width;
        var context = this.svg.node().getContext("2d");
        row.forEach(function (d, i) {
            context.beginPath();
            context.rect(i * rec_width, y_index, rec_width, rec_width);
            context.fillStyle = "#" + Hw3Controller.prototype.toHexString(row[i]);
            context.fill();
            //if (row[i] == 0 && context.fillStyle != "#000000") {
            //    var stop = true;
            //}
            //console.log(row[i].toString() + " -> " + context.fillStyle);
            context.closePath();
        });
    };
    Hw3Controllerv2.prototype.getStats = function (data, rowIndex, colIndex, width) {
        var rval = {};
        for (var i = 0; i < rowIndex; ++i) {
            var row = data[i];
            var local_width = Math.min(Math.floor(width), row.length);
            var start_index = colIndex - Math.floor(local_width / 2);
            var value = this.getString(row, start_index, local_width);
            rval[value] = (rval[value] ? rval[value] + 1 : 1);
        }
        return rval;
    };
    Hw3Controllerv2.prototype.getString = function (data, start, length) {
        var rval = "";
        for (var i = start; i < (start + length); ++i) {
            rval += this.toHexString(data[this.realMod(i, data.length)]);
        }
        return rval;
    };
    Hw3Controllerv2.prototype.printStats = function (row, col, width, stats) {
        //this.statsBox.selectAll("p").remove();
        //var info_p = this.statsBox.append("p");
        //var statstr: string = "row " + row + ", col " + col + " (length " + width + ") with a=" + this.a.toString() + " and b=" + this.b.toString();
        //info_p.text(statstr);
        //var count_p = this.statsBox.append("p");
        ////count_p.text("count: " + JSON.stringify(stats, null, 2));
        //var count_array = [];
        //for (var c in stats) {
        //    count_array.push([c, stats[c]]);
        //}
        //count_array.sort(function (a, b) {
        //    return a[1] - b[1];
        //});
        //count_array.reverse();
        //statstr = "count: { ";
        //for (var i = 0; i < count_array.length; ++i) {
        //    statstr += '"' + count_array[i][0].toString() + '": ' + count_array[i][1].toString();
        //    if (i < count_array.length - 1) {
        //        statstr += ", "
        //    }
        //}
        //statstr += " }"
        //count_p.text(statstr);
        //var total_count: number = 0;
        //var weights: { [color: string]: number } = {};
        //var entropy: number = 0;
        //var valid_strings = Object.keys(stats);
        //for (var i: number = 0; i < valid_strings.length; ++i) {
        //    var count = stats[valid_strings[i]];
        //    var weight = count / row;
        //    weights[valid_strings[i]] = weight;
        //    entropy += weight * (Math.log(weight) / Math.log(2));
        //    total_count += count;
        //}
        //if (total_count != row) {
        //    this.statsBox.append("p").text("total count != row:  " + total_count.toString() + " != " + row.toString());
        //    alert("totalcount != row");
        //}
        //var fract_p = this.statsBox.append("p");
        //statstr = "weights: [";
        //valid_strings = Object.keys(weights);
        //for (var i: number = 0; i < valid_strings.length; ++i) {
        //    var weight = weights[valid_strings[i]];
        //    statstr += weight.toFixed(3);
        //    if (i < valid_strings.length - 1) {
        //        statstr += ",";
        //    }
        //}
        //statstr += "]";
        ////fract_p.text(statstr);
        //fract_p.text("weights: " + JSON.stringify(weights, function (key, value) {
        //    if (key) {
        //        return value.toFixed(3);
        //    }
        //    return value;
        //}, 2));
        //var entropy_p = this.statsBox.append("p");
        //entropy_p.text("shannon's entropy: " + (0 - entropy));
        //return;
    };
    return Hw3Controllerv2;
})(BaseTimer);
//# sourceMappingURL=Hw3ControllerPart2.js.map