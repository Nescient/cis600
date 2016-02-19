var length = 400;

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

        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 2).attr("height", length * 20);
        //svg.on("mousemove", () => this.onMouse());

        this.svg = svg;
        this.graphRow(this.currentRow, 0);

        //this.statsBox = d3.select("main").append("div");
        //this.statsBox.attr("id", "hw2stats");
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

    graphRow(row: number[], yIndex: number) {
        var total_width = parseInt(this.svg.style("width"));
        var rec_width = total_width / row.length;
        var y_index = yIndex * rec_width;
        var context = this.svg.node().getContext("2d");

        row.forEach(function (d, i) {
            var hexstring: string = Math.round(row[i] * 0xFFFFFF).toString(16);
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
    }
}
