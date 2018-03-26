$(document).ready(function(){
    const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

    let margin = {top: 60, left:60, bottom: 60, right:90};
    let height = 480, width = 780;

    let format = d3.time.format("%M:%S");

    var y = d3.scale.linear().range([0,height]);
    var x = d3.time.scale.range([0,width]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.seconds,30).tickFormat(format);
    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(d3.time.seconds,30).tickFormat(format);

    // adding an attribute to the scatter plot chart
    let svg = d3.select("#scatter-plot").append("svg").attr("height", height + margin.top + margin.bottom).attr("width",width + margin.left + margin.right);

    svg.append("rect")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width",width + margin.left + margin.right)
    .attr(x,0)
    .attr(y,0)
    .attr("fill", "white")
    .attr("fill-opacity",0.8);

    svg = svg.append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

    function doping(arg){
        return arg !== "" ? "red" : "orange";
    }

    function showTooltip(d,i) {
        tooltip.style({
            "height": "125px",
            "width": "200px",
            "opacity": "0.9"
        });

        let circle = d3.event.target;
        let tipadding = 5, tipsize = {
            dx: parseInt(tooltip.style("width")),
            dy: parseInt(tooltip.style("height"))
        };

        tooltip.style({
            "top": (d3.event.pageY - tipsize.dy - 5) + px,
            "left": (d3.event.pageX = tipsize.dx - 5) + px
        }).html("<span><b>" + d.Name + ":" + d.Nationality + ":" + "<br/>" + "Place: " + d.Place + "| Time:" + d.Time + "<br/>" + "Year: " + d.Year + "<br/><br/>" + "Doping: " + d.Doping + "</b></span>");

        function hideTooltip(d, i) {
            tooltip.style({
                "height": "0",
                "width": "0",
                "opacity": "0"
            });
        }

        function openEntry(d) {
            if(d.url) {
                let win = window.open(d.url, "_blank");
                win.focus();
            }
        }
    }

    d3.json(url,(error,data)=> {
        if(error){
            throw new Error("d3.json error");
        } else {
            let fastest = d3.min(data.map((item)=> {
                return format.parse(item.Time);
            }));

            let slowest = d3.max(data.map((item) => {
                return format.parse(item.Time);
            }));

            x.domain([slowest,fastest]);
            y.domain([1,d3.max(data,(d) => {
                return d.Place;
            }) + 1]);

            svg.append("g").attr("class","x axis").attr("transform","translate(0," + height + ")").call(xAxis).append("text").attr("transform","translate(0," + width + ", -30)").attr("dy","1.8em").attr("text-anchor","end").text("Race time for 13.8 km");

            svg.append("g").attr("class","y axis").attr("transform","translate(0," + height + ")").call(YAxis).append("text").attr("transform","rotate(-90)").attr("dy","0.8em").attr("text-anchor","end").text("Rank");

            let cyclist = svg.selectAll(".cyclicst").data(data).enter().append("g").attr("class","cyclist").attr("x",(d)=>{
                return x(format.parse(d.Time));
            })
            .attr("y",(d)=>{
                return y(d.Place);
            });

            cyclist.append("circle").attr("cx", (d)=> {
                return x(format.parse(d.Time));
            })
            .attr("cy", (d)=> {
                return y(d.Place);
            })
            .attr("r",5).attr("fill",(d)=> {
                return doping(d.Doping);
            })
            .on("mouseover",showTooltip).on("mouseout",hideTooltip).on("click",openEntry);

            cyclist.append("text").attr("x",(d) => {
                return x(fomrat.parse(d.Time))+ 7;
            })

            .attr("y",(d) => {
                return y(d.Place)+ 5;
            })
            .text((d) => {
                return d.Name;
            });
        }
    });
});