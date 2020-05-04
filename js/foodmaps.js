// MAIN SOURCE: This vis is basically sourced from here:
//https://www.d3-graph-gallery.com/graph/connectionmap_csv.html
//http://bl.ocks.org/Andrew-Reid/35d89fbcfbcfe9e819908ea77fc5bef6

var oldWidth = 0;

function render() {

 // Set size of map visualisation
    if (oldWidth === innerWidth) {
        return oldWidth = innerWidth}

    var width = height = d3
        .select("#graph")
        .node().offsetWidth


    if (innerWidth <= 400) {
        width = innerWidth
        height = innerHeight * .7
    }

    // Create lines instead of the usual path
    // On creating lines source:
    // https://stackoverflow.com/questions/56562231/line-on-d3-map-not-forming-a-curve
    const curve = function(context) {
        var custom = d3.curveLinear(context);
        custom._context = context;
        custom.point = function(x,y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0: this._point = 2; 
                this._line ? this._context.lineTo(x, y): this._context.moveTo(x, y);
                this.x0 = x; this.y0 = y;        
                break;
            case 1: this._point = function(d) {
                return scaleWidth(d[0][3]) || scaleWidth2(p[0][3]);
            };
            default: 
                var x1 = this.x0 * 0.5 + x * 0.5;
                var y1 = this.y0 * 0.5 + y * 0.5;
                var m = 1/(y1 - y1)/(x1 - x1);
                var r = -100; // offset of mid point.
                var k = r / Math.sqrt(1 + (m*m) );
                if (m == Infinity) {
                  y1 += r;
                }
                else {
                  y1 += k;
                  x1 += m*k;
                }     
                this._context.quadraticCurveTo(x1,y1,x,y); 
                this.x0 = x; this.y0 = y;        
                break;
            }
        }
        return custom;
    }

    // Format numbers source: http://bl.ocks.org/mstanaland/6106487
    //var formatComma = d3.format(",")
        //formatDecimal = d3.format(".1f") 
        //formatDecimalComma = d3.format(",.2f")
        //formatSuffix = d3.format("s")
        //formatSuffixDecimal1 = d3.format(".1s")
        //formatPercent = d3.format(",.2%");

        //source https://stackoverflow.com/questions/40774677/d3-formatting-tick-value-to-show-b-billion-instead-of-g-giga
        formatSuffixDecimal2 = function (val) {
            if ( val > 1e6 ) {
                // Replace default “G” (for giga) suffix with “B” (for billions)
                return d3.format(".2s")(val).replace("G", "B");
            } else {
            	return val
            }
        }
        formatMoney = function(val) { return "£" + d3.format(",")(val); }
 
    // Get details for tooltip: name of country
    function getCountryName(d){
        return d[0][2];
    }

    function getCountryName2(p){
        return p[0][2];
    }

    // Get details for tooltip: import value
    function getImportValue(d){
        return "£" + d3.format(".2s")(d[0][5]).replace("G", "B");
    }

    function getImportValue2(p){
        return "£" + d3.format(".2s")(p[0][5]).replace("G", "B");
    }

    // Get details for tooltip: import volume
    function getImportVolume(d){

        if ((d[0][6]) !== 0) {
            return d3.format(".2s")(d[0][6]) + " tonnes";
        } else {
            return "<1 tonne";
        }
        
    }

    function getImportVolume2(p){

        if ((p[0][6]) !== 0) {
            return d3.format(".2s")(p[0][6]) + " tonnes";
        } else {
            return "<1 tonne";
        }
        
    }


    // Get details for tooltip: import volume
    function getImportCount(d){

        if ((d[0][7]) == 1) {
            return (d[0][7]) + " head";
        } else if ((d[0][7]) > 1) {
        	return d3.format(",")(d[0][7]) + " heads";
        } else {
            return "None";
        }
    }

    // Get details for tooltip: year
    function getYear(d){
        return d[0][4];
    }

    function getYear2(p){
        return p[0][4];
    }

    // Get details for tooltip: top products
    function getProducts(d){
        return d[0][8];
    }

    // Get details for tooltip: item name
    function getItemName(p){
        return p[0][9];
    }

    // Create div for tooltips source: https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73
    var tooltipTextDiv = d3.select("#graph")
        .append("div")
        .attr("class", "tooltip-text-div")
        .style("opacity", 0);

    // Create div for caption
    var titleTextDiv = d3.select("#graph")
        .append("div")
        .attr("class", "title-text-div")
        .style("opacity", 0);

    // Create svg
    var svg1 = d3
        .select(".container-1 #graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        //.attr("viewBox", "0 0 1000 1000")
        .attr("preserveAspectRatio", "none")

    // Activate for second graph
    /* var svg2 = d3
        .select(".container-2 #graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height); */

    // Set map projection
    var projection = d3.geoRobinson()
        .scale(2.2 *(width + 1) / 14)
        // Center the map in view
        .translate([width / 2.3, height / 4.2])
        // Rotate the map
        .rotate([-10, -5, 0])
        // Check meaning of precision https://github.com/d3/d3-geo
        .precision(10);

    // Generate paths based on projection
    var path = d3.geoPath()
        .projection(projection);

    var path2 = d3.geoPath()
        .projection(projection);

    // Create div for tooltips
    // source: https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73
    var tooltipTextDiv = d3.select("#graph")
        .append("div")
        .attr("class", "tooltip-text-div")
        .style("opacity", 0);

    // Load world shape and list of importing countries
    d3.queue()
        // Load geojson file
        .defer(d3.json, "data/world.json")
        // Load import data file
        // On reading CSV files source: http://learnjsdata.com/v3/read_data.html
        .defer(d3.csv, "data/reduced_foodimport04142020.csv")
        .defer(d3.csv, "data/reduced_foodimport_items_04222020.csv") 
        //.defer(d3.csv, "data/food.csv") 
        .await(createMap);

    function createMap(error, countries, data, data2) {
        if (error) throw error;

        // Create global values
        var countryData = []
            importValue = []
            importYear =[]
        // Values for timeslide
        var inputValue = null;
        var uniqueYears = d3
            .map(data, function(d){
                return(d.year)})
            .keys();
        console.log(uniqueYears);

        // Format data
        data.forEach(function(d) {
            /*importData = {source: [+d.longpc, +d.latpc, +d.quantity, d.country, d.ISO3, +d.converted_value_thous, +d.products, +d.year], destination: [+d.longrc, +d.latrc]} */


            importData = {source: [+d.longpc, +d.latpc, d.country, d.ISO3, +d.year, +d.converted_value_thous, +d.quantity_tonnes, +d.quantity_head, d.top_product, +d.quantity_tonnes2, +d.item_code, +d.year2], destination: [+d.longrc, +d.latrc]} 
            d.quantity = +d.quantity
            d.value = +d.converted_value_thous
            d.year = +d.year

            countryData.push(importData)
            importValue.push(d.value)
            importYear.push(d.year);
        })

        // Create global values
        var productData = []

        data2.forEach(function(p) {
            /*importData = {source: [+d.longpc, +d.latpc, +d.quantity, d.country, d.ISO3, +d.converted_value_thous, +d.products, +d.year], destination: [+d.longrc, +d.latrc]} */


            productDetails = {source: [+p.longpc, +p.latpc, p.country, p.ISO3, +p.year, +p.converted_value_dthous, +p.quantity_tonnes, +p.quantity_head, +p.item_number, p.item], destination: [+p.longrc, +p.latrc]}

            productData.push(productDetails)
        })

        //console.log(productData);

        //console.log(countryData);


    // Create lines instead of the usual path
    // On creating lines source: https://stackoverflow.com/questions/56562231/line-on-d3-map-not-forming-a-curve
        var line = d3.line()
            .x(function(d) {
                return projection([d[0],d[1]])[0];
            })
            .y(function(d) {
                return projection([d[0],d[1]])[1];
            })
            .curve(curve);

        // Determine the min/max value in import value
        var max_value = d3.max(importValue);
        var min_value = d3.min(importValue);

        console.log(min_value);
        console.log(max_value);

        var max_year = d3.max(importYear);
        var min_year = d3.min(importYear);

        console.log(min_year);
        console.log(max_year);

       
        // Scale the width of lines based on import value
        // On scaling functions source: https://www.d3indepth.com/scales/
        var scaleWidth = d3
            .scaleLinear()
            .domain([1000, max_value])
            .range([0,15]);

        var scaleWidth0 = d3
            .scaleLinear()
            .domain([0, 600000])
            .range([0,15]);

        var scaleWidth1 = d3
            .scaleLinear()
            .domain([0, 19000])
            .range([0,15]);

        var scaleWidth2 = d3
            .scaleLinear()
            .domain([0, 5000])
            .range([0,15]);

        // also 8
        var scaleWidth3 = d3
            .scaleLinear()
            .domain([0, 220000])
            .range([0,15]);

        var scaleWidth4 = d3
            .scaleLinear()
            .domain([0, 4000])
            .range([0,15]);

        var scaleWidth5 = d3
            .scaleLinear()
            .domain([0, 2500])
            .range([0,15]);

          var scaleWidth6 = d3
            .scaleLinear()
            .domain([0, 400000])
            .range([0,15]);

        var scaleWidth8 = d3
            .scaleLinear()
            .domain([0, 80000])
            .range([0,15]);

        // Scale radius of circles based on import quantity/value
        // On scaling functions source: https://www.d3indepth.com/scales/#scales-with-continuous-input-and-continuous-output
        // https://bost.ocks.org/mike/bubble-map/
        var scaleRadius = d3.scaleSqrt()
                .domain([1, 80000, 160000, 240000, 400000])
                .range([0,30]);

        // Color scale
        var colorScale = d3
            .scaleQuantize()
            .domain([10000, max_value])
            .range(d3.schemeBuGn[5]);

        function createSlider() {
               // Create slider
            var uniqueYearsLength = uniqueYears.length - 1
            console.log(uniqueYearsLength);
            var yearSlider = d3.select("#graph")
                .append("div")
                .attr("id", "sliderContainer")
                .attr("class", "choropleth-map-slider");
                yearSlider.html("<input id='timeSlide' type='range' value=" + max_year + " step='1' min='0' max='" + uniqueYearsLength + "'>" + "<br/>" + "<span id='range' class='graph-texts'>" + max_year + "</span>");
        }

        // Mouse over and mouse out
        var mouseOver1 = function(d){
            if (d3.select(this).attr("class") === "path-line") {
                // All other lines disappear
                d3.selectAll(".path-line")
                    .transition()
                    .duration(300)
                    .style("opacity", 0)
                // All points disappear
                d3.selectAll(".dots")
                    .transition()
                    .duration(300)
                    .style("opacity", 0)
                // Only selected line shows up
                d3.select(this)
                    .transition()
                    .duration(300)
                    .style("fill", "none")
                    .style("opacity", 1)
                    .style("stroke-dasharray", ("6, 6"))
                    .attr("marker-start", function (d) {
                        return "url(#circle)";
                    })
                    .attr("markerWidth", 1)
                    .attr("markerHeight", 1)
                    .attr("markerUnits","userSpaceOnUse");
            } else {
                d3.selectAll(".path-line")
                    .transition()
                    .duration(300)
                    .style("opacity", 0);
                d3.selectAll(".dots")
                    .transition()
                    .duration(300)
                    .style("opacity", 0);
                d3.select(this)
                    .transition()
                    .duration(300)
                    .style("opacity", 1)
                    .attr("r", 8);
            }
                tooltipTextDiv.transition()
                    .duration(300)
                    .style("opacity", 1)
                tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName(d) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear(d) + "<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue(d) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume(d) + "<br/>" + "<span class = 'tooltip-text-label'> Live animals: </span>" + getImportCount(d) + "<br/>" + "<span class = 'tooltip-text-label'> Top import: </span>" + getProducts(d))
                    //.style("left", (d3.event.pageX - 70) + "px")
                    //.style("top", (d3.event.pageY - 28) + "px");
        }

        var mouseOut1 = function(d) {
            if (d3.select(this).attr("class") === "path-line") {
                d3.selectAll(".path-line")
                    .transition()
                    .duration(300)
                    .style("opacity", 1);
                d3.selectAll(".dots")
                    .transition()
                    .duration(300)
                    .style("opacity", 1);
                d3.select(this)
                    .style("fill", "none")
                    .style("stroke-dasharray", ("0, 0"))
                    .style("opacity", 1);
            } else {
                d3.selectAll(".path-line")
                    .transition()
                    .duration(300)
                    .style("opacity", 1);
                d3.selectAll(".dots")
                    .transition()
                    .duration(300)
                    .style("opacity", 1);
                d3.select(this)
                    .style("fill", "#27b500")
                    .attr("r", 6);
            }
            tooltipTextDiv.transition()
                .duration(300)
                .style("opacity", 0);

        }

        var mouseOver2 = function(d) {
            d3.selectAll(".country")
                .transition()
                .duration(300)
                .style("opacity", 0.5);
            d3.select(this)
                .transition()
                .duration(300)
                .style("opacity", 1);
            tooltipTextDiv.transition()
                    .duration(300)
                    .style("opacity", 1)
            tooltipTextDiv.html("<span class = 'bold-text black-font'>" +  d.properties.ADMIN + "</span>" + " imports cost " + " £" + d3.format(".2s")(d.total).replace("G", "B"))
                //.style("left", (d3.event.pageX - 70) + "px")
                //.style("top", (d3.event.pageY - 350) + "px");
            }

        var mouseOut2 = function(d) {
            d3.selectAll(".country")
                .transition()
                .duration(300)
                .style("opacity", 1);
            d3.select(this)
                .transition()
                .duration(300);
            tooltipTextDiv.transition()
                .duration(300)
                .style("opacity", 0);
        }

        // Update the fill of each svg with value
        function update(value) {
            document.getElementById("range").innerHTML=uniqueYears[value];
            inputValue = uniqueYears[value];
            d3.selectAll(".country")
                .data(countries.features)
                .attr("fill", yearMatch);
        }

        function yearMatch(d, value) {
            var selected_year =  document.getElementById("range").innerText;

            var year_filter = data.filter(function(c) { 
                return c.year == selected_year;
            });

            var country_data = year_filter.filter(function(e) {
                return e.ISO3 === d.properties.ISO_A3_EH;
            })[0];

            if (country_data) {
                d.total = country_data.converted_value_thous;
            } else {
                d.total = 0;
            }
            return colorScale(d.total);;
        }


        // When the map loads, set the intial map state to latest year
        function initialYear(d){
            var year_filter = data.filter(function(c) { 
                return c.year == max_year;
            });
        
            var country_data = year_filter.filter(function(e) {
                return e.ISO3 === d.properties.ISO_A3_EH;
            })[0];
            
            if (country_data) {
                d.total = country_data.converted_value_thous;
            } else {
                d.total = 0;
            }
            return colorScale(d.total);;
        }


        // When the map loads, set the intial map state to latest year
        function initialYear(d){
            var year_filter = data.filter(function(c) { 
                return c.year == max_year;
            });
        
            var country_data = year_filter.filter(function(e) {
                return e.ISO3 === d.properties.ISO_A3_EH;
            })[0];

            if (country_data) {
                d.total = country_data.converted_value_thous;
            } else {
                d.total = 0;
            }
            return colorScale(d.total);;
        }

        var legpos = window.scrollY

        

        // source: http://using-d3js.com/04_08_legends.html
        // source: https://d3-legend.susielu.com/
        function legendLineWidthFood1() {
            var f = d3.format("0.2s")

            var legendLineWidth1 = d3.legendSize()
                    .scale(scaleWidth)
                    .shape("path")
                    .orient("vertical")
                    .orient("bottom")
                    .title("Value in £")
                    .labelFormat(d3.format("0.2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(20)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood1 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth1)
                    .attr("x", "20")
                    .attr("y", "20")
                    
        }

        /*function legendLineWidthFood2() {
            // source: http://using-d3js.com/04_08_legends.html
            // source: https://d3-legend.susielu.com/
            

            var legendLineWidth2 = d3.legendSize()
                .scale(scaleWidth3)
                .shape("path")
                .orient("vertical")
                .title("Value in tonnes")
                .labelFormat(d3.format(".2s")

                    /*function(val) {
                    if ( val > 1e6 ) {
                        return formatSuffixDecimal2(val)
                    } else {
                        return val
                    }
                })
                .shapePadding(10)
                .shapeWidth(10)
                .labelAlign("center")
                .cells(5)
                .labelOffset(15);

            g1.append("g")
                .attr("class","lineWidth-legendfood2 graph-texts")
                .attr("transform", "translate(0,180)")
                .call(legendLineWidth2)
        }*/

        // Draw the map first to make it appear above another element
        var g1 = svg1.append("g");

        g1.selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("fill", "white")
            .attr("d", path)
            .attr("vector-effect", "non-scaling-stroke")
            .style("stroke", "#333333")
            .style("stroke-width", .9)
            .style("stroke-opacity", .7)

        // Create connection map
        function createArc() {
            // Add paths for connection map
            g1.selectAll("importPath")
                .data(countryData)
                .enter()
                .append("path")
                .datum(function(d) {
                    return [d.source, d.destination]
                })
                .attr("class", "path-line")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(d) {
                    if (d[0][4] == max_year) {
                        return scaleWidth(d[0][5])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", mouseOver1)
                .on("mouseout", mouseOut1);

            // Add markers for connection lines
            // Source: http://bl.ocks.org/dustinlarimer/5888271
            var markers = g1.append("defs")
                .append("marker")
                .attr("id", "circle")
                .attr("viewBox", "-6 -6 12 12")
                //.attr('refX', 0)
                //.attr('refY', 0)
                .attr("markerWidth", 2)
                .attr("markerHeight", 2)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0")
                .style("fill", "#27b500");

            // Add points with tooltips
            // On adding points on the map source: https://www.d3-graph-gallery.com/graph/bubblemap_basic.html
            // On adding tooltips source: https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73
            g1.selectAll("importPath")
                .data(countryData)
                .enter()
                .append("circle")
                .attr("class", "dots dots_world")
                .datum(function(d) {
                    if ([d.source][0][4] == max_year) {
                        return [d.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                //.attr("r", function(d) {return scaleRadius(d[0][2]);})
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(d) {
                    if (d != 0) {
                        return "translate(" + projection([d[0][0], d[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", mouseOver1)
                .on("mouseout", mouseOut1);

            legendLineWidthFood1()


            //g1.selectAll(".path-line").remove()
            //g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            legendLineWidthFood1()
            //g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()

        }

        // Create connection map for all items
        function createArcAllSelectedItems() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_all_items")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "0") {
                        return scaleWidth0(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_all_items") {
                        // All other lines disappear
                        d3.selectAll(".line_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + [p[0][9]] +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_all_items") {
                        d3.selectAll(".line_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_all_items")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_all_items")
                .datum(function(p) {
                        return [p.source]
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_all_items")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_all_items")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + [p[0][9]] +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_all_items")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_all_items")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth0)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }
            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            //g1.selectAll(".line_all_items").remove()
            //g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()
            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }

        // Create connection map for meat
        function createArcMeat() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_meat")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "7") {
                        return scaleWidth3(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_meat") {
                        // All other lines disappear
                        d3.selectAll(".line_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_meat") {
                        d3.selectAll(".line_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_meat")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_meat")
                .datum(function(p) {
                    if ([p.source][0][8] == "7") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_meat")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_meat")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_meat")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_meat")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth3)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }

            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            //g1.selectAll(".line_meat").remove()
            //g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()
            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }




        // Create connection map for potatoes only
        function createArcPotatoes() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_potatoes")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "6") {
                        return scaleWidth6(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_potatoes") {
                        // All other lines disappear
                        d3.selectAll(".line_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_potatoes") {
                        d3.selectAll(".line_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_potatoes")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_potatoes")
                .datum(function(p) {
                    if ([p.source][0][8] == "6") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_potatoes")
                        .transition()
                        .duration(300)
                        .style("opacity", 0)
                    d3.selectAll(".dots_potatoes")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })

                .on("mouseout", function(p) {
                    d3.selectAll(".line_potatoes")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_potatoes")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth6)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }

            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            //g1.selectAll(".line_potatoes").remove()
            //g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()

            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }

        // Create connection map for leeks
        function createArcLeeks() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_leeks")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "4") {
                        return scaleWidth4(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_leeks") {
                        // All other lines disappear
                        d3.selectAll(".line_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_leeks") {
                        d3.selectAll(".line_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_leeks")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_leeks")
                .datum(function(p) {
                    if ([p.source][0][8] == "4") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_leeks")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_leeks")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_leeks")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_leeks")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth4)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }
            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            //g1.selectAll(".line_leeks").remove()
            //g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()

            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }



        // Create connection map for carrots
        function createArcCarrots() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_carrots")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "2") {
                        return scaleWidth2(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_carrots") {
                        // All other lines disappear
                        d3.selectAll(".line_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_carrots") {
                        d3.selectAll(".line_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_carrots")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_carrots")
                .datum(function(p) {
                    if ([p.source][0][8] == "2") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_carrots")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_carrots")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_carrots")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_carrots")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth2)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }
            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            //g1.selectAll(".line_carrots").remove()
            //g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()

            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }

        // Create connection map for cabbages
        function createArcCabbages() {

            // Add paths for connection map
            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_cabbages")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "1") {
                        return scaleWidth1(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_cabbages") {
                        // All other lines disappear
                        d3.selectAll(".line_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_cabbages") {
                        d3.selectAll(".line_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_cabbages")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_cabbages")
                .datum(function(p) {
                    if ([p.source][0][8] == "1") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_cabbages")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_cabbages")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_cabbages")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_cabbages")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth1)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }
            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            //g1.selectAll(".line_cabbages").remove()
            //g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()
            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }


        // Create connection map for onions
        function createArcOnions() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_onions")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "5") {
                        return scaleWidth5(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_onions") {
                        // All other lines disappear
                        d3.selectAll(".line_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_onions") {
                        d3.selectAll(".line_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_onions")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_onions")
                .datum(function(p) {
                    if ([p.source][0][8] == "5") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_onions")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_onions")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_onions")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_onions")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth5)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }

            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            //g1.selectAll(".line_onions").remove()
            //g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()
            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }

        // Create connection map for vegetables
        function createArcVeg() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_veg")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "8") {
                        return scaleWidth8(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_veg") {
                        // All other lines disappear
                        d3.selectAll(".line_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_veg") {
                        d3.selectAll(".line_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_veg")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_veg")
                .datum(function(p) {
                    if ([p.source][0][8] == "8") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_veg")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_veg")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_veg")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_veg")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth8)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }

            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            //g1.selectAll(".line_veg").remove()
            //g1.selectAll(".dots_veg").remove()

            g1.selectAll(".line_food").remove()
            g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()
            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }

        // Create connection map for "food, nes"
        function createArcFood() {

            // Add paths for connection map
            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("path")
                .datum(function(p) {
                    return [p.source, p.destination]
                })
                .attr("class", "line_food")
                .attr("d",line)
                // This makes a straight line; without it, paths look like half moon
                .style("fill", "none")
                .style("stroke", "#27b500")
                .style("stroke-linecap", "round")
                .style("stroke-width", function(p) {
                    if (p[0][8] == "3") {
                        return scaleWidth3(p[0][6])
                    } else {
                        return 0
                    }
                })
                .style("stroke-opacity", 1)
                .on("mouseover", function(p) {
                    if (d3.select(this).attr("class") === "line_food") {
                        // All other lines disappear
                        d3.selectAll(".line_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // All points disappear
                        d3.selectAll(".dots_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                        // Only selected line shows up
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "none")
                            .style("opacity", 1)
                            .style("stroke-dasharray", ("6, 6"))
                            .attr("marker-start", function (p) {
                                return "url(#circle)";
                            })
                            .attr("markerWidth", 1)
                            .attr("markerHeight", 1)
                            .attr("markerUnits","userSpaceOnUse");
                    } else {
                        d3.selectAll(".line_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.selectAll(".dots_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 0);
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("opacity", 0)
                            .attr("r", 8);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");
                    })
                .on("mouseout", function() {
                    if (d3.select(this).attr("class") === "line_food") {
                        d3.selectAll(".line_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "none")
                            .style("stroke-dasharray", ("0, 0"))
                            .style("opacity", 1);
                    } else {
                        d3.selectAll(".line_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.selectAll(".dots_food")
                            .transition()
                            .duration(300)
                            .style("opacity", 1);
                        d3.select(this)
                            .style("fill", "#27b500")
                            .attr("r", 6);
                    }
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                    });

            g1.selectAll("importPath2")
                .data(productData)
                .enter()
                .append("circle")
                .attr("class", "dots_food")
                .datum(function(p) {
                    if ([p.source][0][8] == "3") {
                        return [p.source]
                    } else {
                        return 0;
                    }
                })
                .style("fill", "#27b500")
                // Enable bubble map
                /*.attr("r", function(p) {
                    console.log(p)
                    return scaleRadius(p[0][6]);
                })*/
                // Enable points
                .attr("r", 6)
                // On transforming coordinates source: http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6
                .attr("transform", function(p) {
                    if (p != 0) {
                        return "translate(" + projection([p[0][0], p[0][1]]) + ")";
                    } else {
                        return "translate(-999,0)";
                    }

                })
                .on("mouseover", function(p) {
                    d3.selectAll(".line_food")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.selectAll(".dots_food")
                        .transition()
                        .duration(300)
                        .style("opacity", 0);
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    tooltipTextDiv.transition()
                            .duration(300)
                            .style("opacity", 1)
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 1)
                    tooltipTextDiv.html("<span class = 'bold-text black-font country-name-tooltip'>" + getCountryName2(p) + "</span>" + "<br/>" + "<span class = 'tooltip-text-label'> Year: </span>" + getYear2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Item: </span>" + getItemName(p) +"<br/>" + "<span class = 'tooltip-text-label'> Value: </span>" + getImportValue2(p) + "<br/>" + "<span class = 'tooltip-text-label'> Volume: </span>" + getImportVolume2(p))
                    //.style("left", (d3.event.pageX - 100) + "px")
                    //.style("top", (d3.event.pageY - 590) + "px");

                })
                .on("mouseout", function(p) {
                    d3.selectAll(".line_food")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.selectAll(".dots_food")
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                    d3.select(this)
                        .transition()
                        .duration(300);
                    tooltipTextDiv.transition()
                        .duration(300)
                        .style("opacity", 0);
                });

            function legendLineWidthFood2() {
                // source: http://using-d3js.com/04_08_legends.html
                // source: https://d3-legend.susielu.com/
                var legendLineWidth2 = d3.legendSize()
                    .scale(scaleWidth3)
                    .shape("path")
                    .orient("vertical")
                    .title("Value in tonnes")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(10)
                    .labelAlign("center")
                    .cells(5)
                    .labelOffset(15);

                g1.append("g")
                    .attr("class","lineWidth-legendfood2 graph-texts")
                    .attr("transform", "translate(0,180)")
                    .call(legendLineWidth2)
            }

            
            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots_world").remove()

            g1.selectAll(".line_all_items").remove()
            g1.selectAll(".dots_all_items").remove()
            
            g1.selectAll(".line_meat").remove()
            g1.selectAll(".dots_meat").remove()

            g1.selectAll(".line_potatoes").remove()
            g1.selectAll(".dots_potatoes").remove()

            g1.selectAll(".line_leeks").remove()
            g1.selectAll(".dots_leeks").remove()

            g1.selectAll(".line_carrots").remove()
            g1.selectAll(".dots_carrots").remove()

            g1.selectAll(".line_cabbages").remove()
            g1.selectAll(".dots_cabbages").remove()

            g1.selectAll(".line_onions").remove()
            g1.selectAll(".dots_onions").remove()

            g1.selectAll(".line_veg").remove()
            g1.selectAll(".dots_veg").remove()

            //g1.selectAll(".line_food").remove()
            //g1.selectAll(".dots_food").remove()

            g1.selectAll(".lineWidth-legendfood2").remove()
            legendLineWidthFood2()

            //g1.selectAll(".country").remove()

            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".country").remove()

            d3.selectAll(".choropleth-map-slider").remove()
            g1.selectAll(".color-legend").remove()
        }

        // Draw choropleth    
        function createChoropleth() {

            g1.selectAll("importPath")
                .data(countries.features)
                .enter()
                .append("path")
                // draw each country
                .attr("d", path)
                // set initial vis to latest year
                .attr("fill", initialYear)
                .style("stroke", "#333333")
                .style("stroke-width", .9)
                .style("stroke-opacity", .7)
                .attr("class", "country")
                .style("opacity", 1)
                .on("mouseover", mouseOver2)
                .on("mouseleave", mouseOut2);

            g1.selectAll(".path-line")
                .transition()
                .duration(1000)
                .style("opacity", 0);
            g1.selectAll(".dots")
                .transition()
                .duration(1000)
                .style("opacity", 0);

            createSlider()
            // When the input range changes, update the year
            // Soure: https://bl.ocks.org/duspviz-mit/57c15198c563f7f82f77eed0536eb78c
            d3.select("#timeSlide").on("input", function() {
                    update(+this.value);
                });

            g1.selectAll(".path-line").remove()
            g1.selectAll(".dots").remove()
            g1.selectAll(".markers").remove()
            g1.selectAll(".lineWidth-legendfood1").remove()
            g1.selectAll(".lineWidth-legendfood2").remove()

            // source: http://using-d3js.com/04_08_legends.html
            // source: https://d3-legend.susielu.com/
            var legendColor = d3.legendColor()
                    .scale(colorScale)
                    .orient("vertical")
                    .title("Value in £")
                    .labelFormat(d3.format(".2s")

                        /*function(val) {
                        if ( val > 1e6 ) {
                            return formatSuffixDecimal2(val)
                        } else {
                            return val
                        }
                    }*/)
                    .shapePadding(10)
                    .shapeWidth(15)
                    .labelOffset(5);

                g1.append("g")
                    .attr("class","color-legend graph-texts")
                    .attr("transform","translate(0,355)")
                    .call(legendColor)
        }



        var pos = [createArc, createArcAllSelectedItems, createArcAllSelectedItems, createArcAllSelectedItems, createArcMeat, createArcMeat, createArcLeeks, createArcPotatoes, createArcCarrots, createArcCabbages, createArcOnions]


        var gs = d3.graphScroll()
            .graph(d3.select(".container-1 #graph"))
            .container(d3.select("#container.container-1"))
            .eventId("uniqueId1")// namespace for scroll and resize events
            .sections(d3.selectAll(".container-1 #sections > div"))
            //.offset(innerWidth < 900 ? innerHeight - 30 : 200)
            .on("active", function(i) {
                g1.selectAll(pos[i])
            })
            //.offset(300)
    }
}

render()
d3.select(window).on("resize", render)