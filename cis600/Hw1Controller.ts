

//declare var d3: any;

var y_scale, x_scale;

//init_svg = function () {
//    var svg = d3.select("#graph");
//    svg.attr("width", 1000).attr("height", 1000);
//    x_scale = d3.scale.linear()
//        .domain([-10, 10])
//        .range([0, 1000]);
//    y_scale = d3.scale.linear()
//        .domain([-10, 10])
//        .range([1000, 0]);
//}

//plot = function (x, y) {
//    var svg = d3.select("#graph");
//    svg.append("circle")
//        .attr("cx", x_scale(x))
//        .attr("cy", y_scale(y))
//        .attr("r", 2)
//        .style("fill", "purple");
//    //alert("plot " + String(x) + " " + String(y));
//}

class Hw1Controller extends BaseTimer {
    svg: any;
    x: number;
    y: number;
    a: number;
    b: number;

    constructor(elementId: string) {
        super(elementId);
        this.x = this.y = 0;
        this.a = 1.4;
        this.b = 0.3;
        var svg = d3.select("main").append("svg");
        svg.attr("width", 1000).attr("height", 1000);
        this.svg = svg;
        x_scale = d3.scale.linear()
            .domain([-10, 10])
            .range([0, 1000]);
        y_scale = d3.scale.linear()
            .domain([-10, 10])
            .range([1000, 0]);
    }

    dostuff() {
        this.plot(this.x, this.y);

        var x = 1 - this.a * (this.x * this.x) + this.y;
        var y = this.b * this.x;
        this.x = x;
        this.y = y;

        return;
    }

    plot(x : number, y : number) {
       // var svg = d3.select("#graph");
        this.svg.append("circle")
            .attr("cx", x_scale(x))
            .attr("cy", y_scale(y))
            .attr("r", 2)
            .style("fill", "purple");
        //alert("plot " + String(x) + " " + String(y));
    }

}