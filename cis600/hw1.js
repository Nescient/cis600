var y_scale, x_scale;

init_svg = function () {
    var svg = d3.select("#graph");
    svg.attr("width", 1000).attr("height", 1000);
    x_scale = d3.scale.linear()
        .domain([-10, 10])
        .range([0, 1000]);
    y_scale = d3.scale.linear()
        .domain([-10, 10])
        .range([1000, 0]);
}

plot = function (x, y) {
    var svg = d3.select("#graph");
    svg.append("circle")
        .attr("cx", x_scale(x))
        .attr("cy", y_scale(y))
        .attr("r", 2)
        .style("fill", "purple");
    //alert("plot " + String(x) + " " + String(y));
}