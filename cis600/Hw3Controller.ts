﻿var length = 400;

class Hw3Controller extends BaseTimer {
    svg: any;
    statsBox: any;
    currentRow: number[] = [];
    data: number[][] = [];
    a: number = Math.random();
    b: number = Math.random();

    constructor(elementId: string) {
        super(elementId);
        // http://stackoverflow.com/a/20066663
        //this.currentRow = Array.apply(null, { length: length }).map(Function.call, Math.random);
        for (var i: number = 0; i < length; ++i) {
            this.currentRow.push(Math.random());
            //this.currentRow.push((i == (length / 2)));
            //this.currentRow.push((i % 2) == 0);
            //this.currentRow.push(true);
            //this.currentRow.push((i % 4) == 0);
        }

        console.log("a is " + this.a.toString() + ", b is " + this.b.toString());
        console.log(this.currentRow);

        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 2).attr("height", length * 20);
        svg.on("mousemove", () => this.onMouse());

        this.svg = svg;
        this.graphRow(this.currentRow, 0);

        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw3stats");
        return;
    }

    onMouse() {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var col_number = Math.floor(mouse_pos[0] / 2);
            var row_number = Math.floor(mouse_pos[1] / 2);
            var width = 3;

            if (row_number < this.data.length) {
                var stats = this.getStats(this.data, row_number, col_number, width);
                this.printStats(row_number, col_number, width, stats);
            }
        }
        return;
    }

    dostuff() {
        var next_row: number[] = this.nextRow(this.currentRow);
        this.data.push(this.currentRow);
        this.graphRow(next_row, this.data.length);
        this.currentRow = next_row;
        return;
    }

    realMod(n: number, m: number): number {
        // javascript mod doesnt work with negative numbers
        //http://stackoverflow.com/a/17323608
        return ((n % m) + m) % m;
    }

    nextRow(row: number[]): number[] {
        var rval: number[] = Array(row.length);
        for (var i: number = 0; i < row.length; ++i) {
            var previous: number = row[this.realMod(i - 1, row.length)];
            var current: number = row[this.realMod(i, row.length)];
            var next: number = row[this.realMod(i + 1, row.length)];
            rval[i] = this.poly(previous, current, next);
            if (rval[i] > 1) {
                alert(rval[i]);
            }
            else if (rval[i] < 0) {
                alert(rval[i]);
            }
        }
        return rval;
    }

    // taken from Blair's ALife1Dim Java program
    poly(u: number, x: number, v: number): number {
        return (0.5 - 0.5 * Math.cos(Math.PI * (this.a + (this.a - this.b) * v + this.b * u * v - 2 * u * x * v)));
    }

    toHexString(val: number): string {
        var hexstring: string = Math.round(val * 0xFFFFFF).toString(16);
        hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
        return hexstring;
    }

    graphRow(row: number[], yIndex: number) {
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
    }

    getStats(data: number[][], rowIndex: number, colIndex: number, width: number): { [color: string]: number } {
        var rval: { [color: string]: number } = {};
        for (var i: number = 0; i < rowIndex; ++i) {
            var row = data[i];
            var local_width = Math.min(Math.floor(width), row.length);
            var start_index = colIndex - Math.floor(local_width / 2);
            var value = this.getString(row, start_index, local_width);
            rval[value] = (rval[value] ? rval[value] + 1 : 1);
        }
        return rval;
    }

    getString(data: number[], start: number, length: number): string {
        var rval: string = "";
        for (var i = start; i < (start + length); ++i) {
            rval += this.toHexString(data[this.realMod(i, data.length)]);
        }
        return rval;
    }

    printStats(row: number, col: number, width: number, stats: { [color: string]: number }) {
        this.statsBox.selectAll("p").remove();

        var info_p = this.statsBox.append("p");
        var statstr: string = "row " + row + ", col " + col + " (length " + width + ") with a=" + this.a.toString() + " and b=" + this.b.toString();
        info_p.text(statstr);

        var count_p = this.statsBox.append("p");
        count_p.attr("height", 200);
        count_p.style("overflow-y", "scroll");
        count_p.text("count: " + JSON.stringify(stats, null, 2));

        var total_count: number = 0;
        var weights: { [color: string]: number } = {};
        var entropy: number = 0;

        var valid_strings = Object.keys(stats);
        for (var i: number = 0; i < valid_strings.length; ++i) {
            var count = stats[valid_strings[i]];
            weights[i] = count / row;
            entropy += weights[i] * (Math.log(weights[i]) / Math.log(2));
            total_count += count;
        }
        if (total_count != row) {
            this.statsBox.append("p").text("total count != row:  " + total_count.toString() + " != " + row.toString());
            alert("totalcount != row");
        }

        var fract_p = this.statsBox.append("p");
        statstr = "weights: [";
        valid_strings = Object.keys(weights);
        for (var i: number = 0; i < valid_strings.length; ++i) {
            var weight = weights[valid_strings[i]];
            statstr += weight.toFixed(3);
            if (i < valid_strings.length - 1) {
                statstr += ",";
            }
        }
        statstr += "]";
        fract_p.text(statstr);

        var entropy_p = this.statsBox.append("p");
        entropy_p.text("shannon's entropy: " + (0 - entropy));

        return;
    }
}
