// Copyright © Sam Savage 2016

class CaViewer {
    svg: any;
    statsBox: any;
    currentRow: number[] = [];
    data: number[][] = [];
    a: number = Math.random();
    b: number = Math.random();
    boxSize: number = 0;
    height: number = 0;
    timerToken: number = 0;
    timerTimeout: number = 10;

    constructor(svg: any, rowLength: number, a: number, b: number) {
        for (var i: number = 0; i < rowLength; ++i) {
            this.currentRow.push(Math.random());
        }
        this.a = a;
        this.b = b;
        this.svg = svg;
        this.height = parseInt(this.svg.style("height"));
        this.boxSize = parseInt(this.svg.style("width")) / rowLength;
        this.graphRow(this.currentRow, 0);
        return;
    }

    public start() {
        this.timerToken = setInterval(() => this.timeStep(), this.timerTimeout);
        return;
    }

    public stop() {
        clearInterval(this.timerToken);
        return;
    }

    public timeStep() {
        if (this.data.length < gMaxTimeStep) {
            var next_row: number[] = this.nextRow(this.currentRow);
            this.data.push(this.currentRow);
            this.graphRow(next_row, this.data.length);
            this.currentRow = next_row;
        }
        else {
            this.stop();
        }
        return;
    }

    private nextRow(row: number[]): number[] {
        var rval: number[] = Array(row.length);
        for (var i: number = 0; i < row.length; ++i) {
            var previous: number = row[gRealMod(i - 1, row.length)];
            var current: number = row[gRealMod(i, row.length)];
            var next: number = row[gRealMod(i + 1, row.length)];
            rval[i] = this.poly(previous, current, next);
            if (rval[i] > 1) { alert(rval[i]); }
            else if (rval[i] < 0) { alert(rval[i]); }
        }
        return rval;
    }

    // taken from Blair's ALife1Dim Java program
    private poly(u: number, x: number, v: number): number {
        return (0.5 - 0.5 * Math.cos(Math.PI * (this.a + (this.a - this.b) * v + this.b * u * v - 2 * u * x * v)));
    }

    //public addNewRow(row: number[]) {
    //    this.data.push(this.currentRow);
    //    this.graphRow(row, this.data.length);
    //    this.currentRow = row;
    //    return;
    //}

    private graphRow(row: number[], yIndex: number) {
        const box_size: number = this.boxSize;
        var y_index: number = yIndex * this.boxSize;
        var context = this.svg.node().getContext("2d");
        if (y_index >= this.height) {  
//http://stackoverflow.com/a/8394985
            var shiftContext = function (ctx, w, h, dx, dy) {
                var clamp = function (high, value) { return Math.max(0, Math.min(high, value)); };
                var imageData = ctx.getImageData(clamp(w, -dx), clamp(h, -dy), clamp(w, w - dx), clamp(h, h - dy));
                ctx.clearRect(0, 0, w, h);
                ctx.putImageData(imageData, 0, 0);
            }


            shiftContext(context, 400, this.height, 0, -1);
            y_index = this.height - 1;

            //context.clearRect(0, 0, 600, 200);
            //context.save();
            //context.translate(-100, -100);

          

            //context.restore();
            
        }
        row.forEach(function (d, i) {
            context.beginPath();
            context.rect(i * box_size, y_index, box_size, box_size);
            context.fillStyle = "#" + gToHexString(row[i]);
            context.fill();
            context.closePath();
        });

        //var destCtx = destinationCanvas.getContext('2d');

        //call its drawImage() function passing it the source canvas directly
        //destCtx.drawImage(sourceCanvas, 0, 0);
        return;
    }
}