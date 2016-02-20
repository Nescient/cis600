var length = 400;

function gRealMod(n: number, m: number): number {
    // javascript mod doesnt work with negative numbers
    //http://stackoverflow.com/a/17323608
    return ((n % m) + m) % m;
}

function gToHexString(val: number): string {
    var hexstring: string = Math.round(val * 0xFFFFFF).toString(16);
    hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
    return hexstring;
}

class ColumnCount {
    private column: number = 0;
    private counts: { color: string, number }[] = [];

    constructor(column: number) {
        this.column = column;
        return;
    }

    public addCount(str: string) {
        this.counts[str] = (this.counts[str] ? this.counts[str] + 1 : 1);
        return;
    }

    public getEntropy(rowCount: number): number {
        var entropy: number = 0;
        var valid_strings = Object.keys(this.counts);
        var total_count: number = 0;
        for (var i: number = 0; i < valid_strings.length; ++i) {
            var count = this.counts[valid_strings[i]];
            var weight = count / rowCount;
            entropy += weight * (Math.log(weight) / Math.log(2));
            total_count += count;
        }
        return 0 - entropy;
    }
}

class CellularAutomaton {
    private a: number = 0;
    private b: number = 0;
    private counts: ColumnCount[] = [];
    private currentRow: number[] = [];
    private rowCount: number = 0;

    constructor(a: number, b: number, row: number[]) {
        this.a = a;
        this.b = b;
        this.currentRow = row;
        if (this.currentRow) {
            this.rowCount = 1;
            this.counts = Array(this.currentRow.length);
            for (var i: number = 0; i < this.counts.length; ++i) {
                this.counts[i] = new ColumnCount(i);
            }
            this.updateCounts();
        }
        return;
    }

    public getA(): number {
        return this.a;
    }

    public getB(): number {
        return this.a;
    }

    public makeNewRow() {
        var len: number = this.currentRow.length;
        var new_row: number[] = Array(len);
        for (var i: number = 0; i < len; ++i) {
            var previous: number = this.currentRow[gRealMod(i - 1, len)];
            var current: number = this.currentRow[gRealMod(i, len)];
            var next: number = this.currentRow[gRealMod(i + 1, len)];
            new_row[i] = this.poly(this.a, this.b, previous, current, next);
            if (new_row[i] > 1) { alert(new_row[i]); }
            else if (new_row[i] < 0) { alert(new_row[i]); }
        }
        return this.setNextRow(new_row);
    }

    // taken from Blair's ALife1Dim Java program
    private poly(a: number, b: number, u: number, x: number, v: number): number {
        return (0.5 - 0.5 * Math.cos(Math.PI * (a + (a - b) * v + b * u * v - 2 * u * x * v)));
    }

    private setNextRow(row: number[]) {
        this.currentRow = row;
        ++this.rowCount;
        this.updateCounts();
        return;
    }

    private updateCounts() {
        for (var i: number = 0; i < this.currentRow.length; ++i) {
            var value: string =
                gToHexString(this.currentRow[gRealMod(i, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 1, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 2, this.currentRow.length)]);
            this.counts[i].addCount(value);
        }
    }

    public getEntropy(): number {
        var entropy: number = this.counts[0].getEntropy(this.rowCount);
        for (var i: number = 1; i < this.counts.length; ++i) {
            var new_entropy: number = this.counts[i].getEntropy(this.rowCount);
            if (new_entropy < entropy) {
                entropy = new_entropy;
            }
        }
        return entropy;
    }
}

class Hw3Controllerv2 extends BaseTimer {
    svg: any;
    statsBox: any;
    data: CellularAutomaton[] = [];
    increment: number = 0.01;

    constructor(elementId: string) {
        super(elementId);
        var a: number = 0;
        var b: number = 0;
        var data: number[] = [];
        for (var i: number = 0; i < length; ++i) {
            data.push(Math.random());
        }
        for (var b: number = 0; b <= 1; b += this.increment) {
            for (var a: number = 0; a <= 1; a += this.increment) {
                var ca: CellularAutomaton = new CellularAutomaton(a, b, data);
                this.data.push(ca);
            }
        }

        var svg = d3.select("main").append("svg");
        svg.attr("width", length * 3).attr("height", length * 3);
        svg.on("mousemove", () => this.onMouse());

        this.svg = svg;
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
            //var width = 3;

            //if (row_number < this.data.length) {
            //    var stats = this.getStats(this.data, row_number, col_number, width);
            //    this.printStats(row_number, col_number, width, stats);
            //}
        }
        return;
    }

    dostuff() {
        const width: number = parseInt(this.svg.style("width"));
        const height: number = parseInt(this.svg.style("height"));
        const num_boxes = (1 / this.increment) + 1;
        var heat_data: { value: number, x: number, y: number, color: string }[] = [];
        for (var i: number = 0; i < this.data.length; ++i) {
            var ca: CellularAutomaton = this.data[i];
            ca.makeNewRow();
            var entropy: number = ca.getEntropy();
            heat_data.push({
                value: entropy,
                x: ca.getA() / this.increment,
                y: ca.getB() / this.increment,
                color: "#" + gToHexString(entropy)
            });
        }
        this.graphHeatMap(heat_data);
        return;
    }

    graphHeatMap(data: { value: number, x: number, y: number, color: string }[]) {
        const total_width: number = parseInt(this.svg.style("width"));
        const total_height: number = parseInt(this.svg.style("height"));
        const num_boxes = (1 / this.increment) + 1;
        const size: number = total_width / num_boxes;

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
    }
}
