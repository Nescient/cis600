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






//angular.module('includeExample', ['ngAnimate'])
//.controller('ExampleController', ['$scope', function ($scope) {
//    $scope.templates =
//      [{ name: 'template1.html', url: 'hw1.html' },
//        { name: 'template2.html', url: 'hw1.html' }];
//    $scope.template = $scope.templates[0];
//}]);



//var templateSelect = element(by.model('template'));
//var includeElem = element(by.css('[ng-include]'));

//it('should load template1.html', function () {
//    expect(includeElem.getText()).toMatch(/Content of template1.html/);
//});

//it('should load template2.html', function () {
//    if (browser.params.browser == 'firefox') {
//        // Firefox can't handle using selects
//        // See https://github.com/angular/protractor/issues/480
//        return;
//    }
//    templateSelect.click();
//    templateSelect.all(by.css('option')).get(2).click();
//    expect(includeElem.getText()).toMatch(/Content of template2.html/);
//});

//it('should change to blank', function () {
//    if (browser.params.browser == 'firefox') {
//        // Firefox can't handle using selects
//        return;
//    }
//    templateSelect.click();
//    templateSelect.all(by.css('option')).get(0).click();
//    expect(includeElem.isPresent()).toBe(false);
//});

