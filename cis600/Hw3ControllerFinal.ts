// Copyright © Sam Savage 2016


class ColumnCountv2 {
    private column: number = 0;
    private counts: { color: string, number }[] = [];
    private entropy: number[] = [];

    constructor(column: number) {
        this.column = column;
        return;
    }

    public addCount(str: string) {
        this.counts[str] = (this.counts[str] ? this.counts[str] + 1 : 1);
        return;
    }

    public updateEntropy(rowCount: number) {
        this.entropy[rowCount - 1] = this.getEntropy(rowCount);
    }

    public getAvgEntropy(): number {
        if (this.entropy.length > 0) {
            var mean: number = 0;
            for (var i: number = 0; i < this.entropy.length; ++i) {
                mean += this.entropy[i];
            }
            return mean / this.entropy.length;
        }
        return 0;
    }

    public getEntropyVariance(): number {
        const offset: number = 0; // throw away everything under 50 timesteps
        if (this.entropy.length <= offset) { return 0; }
        var mean: number = 0;
        for (var i: number = offset; i < this.entropy.length; ++i) {
            // mean += this.entropy[i] ? this.entropy[i] : 0;
            mean += this.entropy[i];
        }
        mean /= (this.entropy.length - offset);
        var variance: number = 0;
        for (var i: number = offset; i < this.entropy.length; ++i) {
            var delta: number = this.entropy[i] - mean;
            variance += (delta * delta);
        }
        return variance / (this.entropy.length - offset);
    }

    private getEntropy(rowCount: number): number {
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

class CellularAutomatonv2 {
    private a: number = 0;
    private b: number = 0;
    private counts: ColumnCountv2[] = [];
    private currentRow: number[] = [];
    rowCount: number = 0;
    ignoreCount: number = 0;

    constructor(a: number, b: number, row: number[]) {
        this.a = a;
        this.b = b;
        this.currentRow = row;
        if (this.currentRow) {
            //  this.rowCount = 1;
            for (var i: number = 0; i < this.currentRow.length; ++i) {
                // this.counts.push(new ColumnCount(i));
                this.counts[this.counts.length] = new ColumnCountv2(i);
            }
            //   this.updateCountsAndEntropy();
        }
        return;
    }

    public getA(): number {
        return this.a;
    }

    public getB(): number {
        return this.b;
    }

    public makeNewRow(): boolean {
        if (this.rowCount < gMaxTimeStep) {
            var len: number = this.currentRow.length;
            if ((this.rowCount > (gMaxTimeStep / 4)) && (this.getEntropySigma() == 0)) {
                return false;
            }
            var new_row: number[] = [];
            for (var i: number = 0; i < len; ++i) {
                var previous: number = this.currentRow[gRealMod(i - 1, len)];
                var current: number = this.currentRow[gRealMod(i, len)];
                var next: number = this.currentRow[gRealMod(i + 1, len)];
                new_row.push(this.poly(this.a, this.b, previous, current, next));
                if (new_row[i] > 1) { alert(new_row[i]); }
                else if (new_row[i] < 0) { alert(new_row[i]); }
            }
            this.setNextRow(new_row);
            return true;
        }
        return false;
    }

    // taken from Blair's ALife1Dim Java program
    private poly(a: number, b: number, u: number, x: number, v: number): number {
        return (0.5 - 0.5 * Math.cos(Math.PI * (a + (a - b) * v + b * u * v - 2 * u * x * v)));
    }

    private setNextRow(row: number[]) {
        this.currentRow = row;
        if (this.ignoreCount <= 100) {
            ++this.ignoreCount;
        }
        if (this.ignoreCount > 100) {
            ++this.rowCount;
            this.updateCountsAndEntropy();
        }
        return;
    }

    private updateCountsAndEntropy() {
        for (var i: number = 0; i < this.currentRow.length; ++i) {
            var value: string =
                gToHexString(this.currentRow[gRealMod(i, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 1, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 2, this.currentRow.length)]);
            this.counts[i].addCount(value);
            this.counts[i].updateEntropy(this.rowCount);
        }
    }

    public getEntropySigma(): number {
        var avg_variance: number = 0;
        for (var i: number = 0; i < this.counts.length; ++i) {
            // avg_variance += this.counts[i].getEntropyVariance();
            avg_variance += this.counts[i].getAvgEntropy();
        }
        return avg_variance / this.counts.length;
        //avg_variance /= this.counts.length;
        //return Math.sqrt(avg_variance);
    }
}

class Hw3Controllerv3 extends BaseTimer {
    private svg: any;
    private statsBox: any;
    //private data: CellularAutomaton[] = [];
    private increment: number = 0.05;
    private maxEntropy: number = 10;
    private minEntropy: number = 0;
    private timeStepIndex: number = 0;
    private boxCount: number = 0;
    private boxSize: number = 0;
    //private caView: CaViewer = null;
    //private caSelected: CellularAutomaton = null;
    ca: CellularAutomatonv2 = null;
    a: number = 0;
    b: number = 0;
    caIC: number[] = [];
    doneCAs: { a: number, b: number, e: number }[] = [];

    constructor(elementId: string) {
        super(elementId);
        console.log("constructor");
        //this.initializeCa();
        const svg_size: number = length * 3;
        var svg: any = d3.select("main").append("canvas");
        svg.attr("width", svg_size).attr("height", svg_size);
        var ctx = svg.node().getContext('2d');
        ctx.translate(0, svg.node().height);
        ctx.scale(1, -1);
        this.boxCount = (1 / this.increment) + 1;
        this.boxSize = svg_size / this.boxCount;

        svg.on("click", () => this.onMouse());

        this.svg = svg;
        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw3v3stats");
        this.statsBox.attr("class", "hwstats");

        for (var i: number = 0; i < length; ++i) {
            this.caIC.push(Math.random());
        }
        this.ca = this.nextCA();
        return;
    }

    private onMouse() {
        const width: number = parseInt(this.svg.style("width"));
        const height: number = parseInt(this.svg.style("height"));
        const num_boxes: number = (1 / this.increment) + 1;
        const box_size: number = width / num_boxes;
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var col_number: number = Math.floor((mouse_pos[0] / width) * this.boxCount);
            var row_number: number = Math.floor(((height - mouse_pos[1]) / height) * this.boxCount);
            this.printStats(row_number, col_number);
        }
        return;
    }

    dostuff() {
        if (this.ca.makeNewRow()) {
            var entropy: number = this.ca.getEntropySigma();
            if (entropy > this.maxEntropy) {
                this.maxEntropy = entropy
            }
            if (entropy < this.minEntropy) {
                this.minEntropy = entropy
            }
            if (this.maxEntropy != this.minEntropy) {
                entropy = (entropy - this.minEntropy) / (this.maxEntropy - this.minEntropy);
            }
            this.graphHeatMap(
                entropy,
                this.ca.getA() / this.increment,
                this.ca.getB() / this.increment,
                "#0000" + gToBlueHexString(entropy)
            );
        }
        else {
            this.doneCAs.push({
                a: this.ca.getA(),
                b: this.ca.getB(),
                e: this.ca.getEntropySigma()
            });
            delete this.ca;
            this.ca = this.nextCA();
        }
        if (this.ca == null) {
            this.stop();
        }
        return;
    }

    private graphHeatMap(value: number, x: number, y: number, color: string) {
        var context = this.svg.node().getContext("2d");
        context.beginPath();
        context.rect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
        context.fillStyle = color;
        context.fill();
        context.closePath();
        return;
    }

    private nextCA(): CellularAutomatonv2 {
        var ca: CellularAutomatonv2 = null;
        if (this.b < 1) {
            ca = new CellularAutomatonv2(this.a, this.b, this.caIC);
            if (this.a < 1) {
                this.a = parseFloat((this.a + this.increment).toFixed(3));
            }
            else {
                this.a = 0;
                this.b = parseFloat((this.b + this.increment).toFixed(3));
            }
        }
        return ca;
    }

    printStats(row: number, col: number) {
        const index: number = (row * this.boxCount) + col;
        var cainfo: { a: number, b: number, e: number } = (this.ca) ?
            { a: this.ca.getA(), b: this.ca.getB(), e: this.ca.getEntropySigma() } :
            { a: -1, b: -1, e: -1 };
        if (row >= 0 && col >= 0 && (index < this.doneCAs.length)) {
            cainfo = this.doneCAs[index];
        }
        this.statsBox.selectAll("p").remove();
        var info_p = this.statsBox.append("p");
        var entropy_p = this.statsBox.append("p");
        var stats_p = this.statsBox.append("p");

        var statstr: string = "row " + row + ", col " + col + " where a=" + cainfo.a + " and b=" + cainfo.b;
        info_p.text(statstr);

        entropy_p.text("entropy standard deviation: " + cainfo.e);

        if (this.ca) {
            stats_p.text("row count:" + this.ca.rowCount);
        }

        return;
    }

}