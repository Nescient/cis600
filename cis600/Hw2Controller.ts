var length = 400;

class Hw2Controller extends BaseTimer {
    svg: any;
    currentRow: boolean[] = [];
    data: boolean[][] = [];
    xScale: any;
    yScale: any;
    count: number = 0;

    constructor(elementId: string) {
        super(elementId);
        // http://stackoverflow.com/a/20066663
        //this.currentRow = Array.apply(null, { length: length }).map(Function.call, Math.random);
        for (var i: number = 0; i < length; ++i) {
            this.currentRow.push(Math.random() < 0.5);
        }

        var svg = d3.select("main").append("canvas");
        svg.attr("width", 1000).attr("height", 1000);
        this.svg = svg;
        this.xScale = d3.scale.linear()
            .domain([-10, 10])
            .range([0, 1000]);
        this.yScale = d3.scale.linear()
            .domain([-10, 10])
            .range([1000, 0]);

        this.graphRow(this.currentRow, this.count++);

        d3.timer(() => {
            var next_row: boolean[] = this.nextRow(this.currentRow);
            this.graphRow(next_row, this.count++/*this.data.length*/);
            this.currentRow = next_row; }, this.timerTimeout);
        return;
    }

    dostuff() {
        return;
        var next_row: boolean[] = this.nextRow(this.currentRow);
       // this.data.push(this.currentRow);
        this.graphRow(next_row, this.count++/*this.data.length*/);
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
            var current:  boolean = row[this.realMod(i,     row.length)];
            var next:     boolean = row[this.realMod(i + 1, row.length)];
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

        for (var i: number = 0; i < row.length; ++i) {
            this.svg.append("rect").attr({
                x: i * rec_width,
                y: y_index,
                width: rec_width,
                height: rec_width,
                "fill": "#000",
                "fill-opacity": row[i] ? 1 : 0
            });
        }
    }

}
