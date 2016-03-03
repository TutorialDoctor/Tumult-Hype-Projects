// margins om assen goed te positioneren
var margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 40
  },
  width = 1100 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// x schaal definiëren
var x = d3.scale.ordinal()
  .domain(data.map(function(d) {
    return d.Datum;
  }))
  .rangeRoundBands([0, width], 0.2);

// y schaal definiëren 
var y = d3.scale.linear()
  .domain([0, d3.max(data, function(d) {
    return d.Slaapuren;
  })])
  .range([height, 0]);

// y schaal definiëren 
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var svg = d3.select(".graph").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Rectangles groupen in een bar en data toevoegen + class toevoegen op basis van slaapefficiëntie + hoogte en breedte bepalen op basis van de x en y schaal
svg.selectAll("rect")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "bar")
  .append("rect")
  .attr("class", function(d) {
    
    if (d.Slaapeffi > 0.9) {
      return "sleep-good";
    } else if (d.Slaapeffi <= 0.8) {
      return "sleep-bad";
    } else if (d.Slaapeffi <= 0.9) {
      return "sleep-medium";
    }
  })
  .attr("x", function(d) {
    return x(d.Datum);
  })
  .attr("y", function(d) {
    return y(d.Slaapuren);
  })
  .attr("height", function(d) {
    return height - y(d.Slaapuren);
  })
  .attr("width", x.rangeBand())

// oproepen X en Y assen
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("class", "x-axis-title")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 4)
  .attr("y", -margin.bottom)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Aantal uren slaap");
// labels van de X as
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)

// Begintijd toevoegen op de bars
svg.selectAll('.bar')
  .append("text")
  .attr("x", function(d) {
    return x(d.Datum);
  })
  .attr("y", function(d) {
    return y(d.Slaapuren);
  })
  .attr("transform", "translate(10 ,20)")
  .attr("fill", 'white')
  .attr("class", "start-time")
  .text(function(d) {
    return d.Beginslapen
  });

// Eindtijd toevoegen op de bars
svg.selectAll('.bar')
  .append("text")
  .attr("x", function(d) {
    return x(d.Datum)
  })
  .attr("y", height)
  .attr("fill", 'white')
  .attr("class", "end-time")
  .attr("transform", "translate(10,-12)")
  .text(function(d) {
    return d.Eindslapen
  });

// Greensock animatie
var tl = new TimelineMax;

tl.staggerFrom(('.bar'), 0.25, {
    scale: 0.9,
    opacity: 0,
    y: -100,
    transformOrigin: "50%, 50%",
    ease: Expo.easeInOut
  }, 0.15)
  .staggerFrom(('.start-time'), 0.25, {
    opacity: 0,
    ease: Expo.easeInOut
  }, 0.1)
  .staggerFrom(('.end-time'), 0.25, {
    opacity: 0,
    ease: Expo.easeInOut
  }, 0.1)