var length = 400;

class Hw2Controller extends BaseTimer {
    svg: any;
    statsBox: any;
    currentRow: boolean[] = [];
    data: boolean[][] = [];

    constructor(elementId: string) {
        super(elementId);
        // http://stackoverflow.com/a/20066663
        //this.currentRow = Array.apply(null, { length: length }).map(Function.call, Math.random);
        for (var i: number = 0; i < length; ++i) {
            //this.currentRow.push(Math.random() < 0.5);
            this.currentRow.push((i == (length / 2)));
            //this.currentRow.push((i % 2) == 0);
            //this.currentRow.push(true);
            //this.currentRow.push((i % 4) == 0);
        }

        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 2).attr("height", length * 20);
        svg.on("mousemove", () => this.onMouse());

        this.svg = svg;
        this.graphRow(this.currentRow, 0);

        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw2stats");
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
        var next_row: boolean[] = this.nextRow(this.currentRow);
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

    nextRow(row: boolean[]): boolean[] {
        var rval: boolean[] = Array(row.length);
        for (var i: number = 0; i < row.length; ++i) {
            var previous: boolean = row[this.realMod(i - 1, row.length)];
            var current: boolean = row[this.realMod(i, row.length)];
            var next: boolean = row[this.realMod(i + 1, row.length)];
            rval[i] = this.lookupRule(previous, current, next);
        }
        return rval;
    }

    lookupRule(p: boolean, c: boolean, n: boolean): boolean {
        // https://en.wikipedia.org/wiki/Rule_110
        // current state: 111 	110 	101 	100 	011 	010 	001 	000
        // new state:      0     1       1       0       1       1       1       0
        var states: boolean[] = [false, true, true, true, false, true, true, false];
        var index: number = (p ? 4 : 0) + (c ? 2 : 0) + (n ? 1 : 0);
        return (index < states.length ? states[index] : false);
    }

    graphRow(row: boolean[], yIndex: number) {
        var total_width = parseInt(this.svg.style("width"));
        var rec_width = total_width / row.length;
        var y_index = yIndex * rec_width;
        var context = this.svg.node().getContext("2d");

        row.forEach(function (d, i) {
            context.beginPath();
            context.rect(i * rec_width, y_index, rec_width, rec_width);
            if (row[i]) {
                context.fillStyle = "#000";
                context.fill();
            }
            context.closePath();
        });
    }

    getStats(data: boolean[][], rowIndex: number, colIndex: number, width: number): number[] {
        var rval: number[] = Array(Math.pow(2, width));
        for (var i: number = 0; i < rowIndex; ++i) {
            var row = data[i];
            var local_width = Math.min(Math.floor(width), row.length);
            var start_index = colIndex - Math.floor(local_width / 2);
            var value = this.getNumber(row, start_index, local_width);
            rval[value] = (rval[value] ? rval[value] + 1 : 1);
        }
        return rval;
    }

    getNumber(data: boolean[], start: number, length: number): number {
        var rval: number = 0;
        for (var i = start; i < (start + length); ++i) {
            rval += (data[this.realMod(i, data.length)] ? (1 << (i - start)) : 0);
        }
        return rval;
    }

    printStats(row: number, col: number, width: number, stats: number[]) {
        this.statsBox.selectAll("p").remove();
        var count_p = this.statsBox.append("p");

        var statstr: string = "count for row " + row + ", col " + col + " (length " + width + "): ";
        count_p.text(statstr + stats.toString());

        var total_count: number = 0;
        var weights: number[] = Array(stats.length);
        var entropy: number = 0;
        for (var i: number = 0; i < stats.length; ++i) {
            if (stats[i]) {
                weights[i] = stats[i] / row;
                entropy += weights[i] * (Math.log(weights[i]) / Math.log(2));
            }
            total_count += (stats[i] ? stats[i] : 0);
        }
        if (total_count != row) {
            this.statsBox.append("p").text("total count != row:  " + total_count.toString() + " != " + row.toString());
            alert("totalcount != row");
        }

        var fract_p = this.statsBox.append("p");
        statstr = "weights: [";
        for (var i: number = 0; i < weights.length; ++i) {
            if (weights[i]) {
                statstr += weights[i].toFixed(3);
            }
            if (i < weights.length - 1) {
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
