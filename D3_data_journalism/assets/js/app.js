// @TODO: YOUR CODE HERE!

var svgWidth=960;
var svgHeight=700;
var margin={
    top: 20,
    right: 40,
    bottom: 80,
    left:100
};

var width = svgWidth-margin.left-margin.right;
var height = svgHeight-margin.top-margin.right;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter").append("svg").attr("width",svgWidth).attr("height",svgHeight);
var chartGroup= svg.append("g").attr("transform",`translate(${margin.left},${margin.right})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(povertyData){
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    povertyData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        
    });
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale= d3.scaleLinear().domain([8, d3.max(povertyData, d=>d.poverty)]).range([0,width]);
    var yLinearScale= d3.scaleLinear().domain([0, d3.max(povertyData, d=>d.healthcare)]).range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis=d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g").attr("transform",`translate(0,${height})`).call(bottomAxis);

    chartGroup.append("g").call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "cyan")
    
    .attr("opacity", ".5");

    chartGroup.selectAll("lable").data(povertyData).enter().append("text").text(d=>d.abbr).attr("dx", d => xLinearScale(d.poverty)).attr("dy", d => yLinearScale(d.healthcare)).attr("text-anchor","middle");
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 0])
      .html(function(d) {
        return (`${d.abbr}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Helthcare(%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top +10})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    }).catch(function(error) {
    console.log(error);
    });
