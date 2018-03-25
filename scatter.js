$(document).ready(function(){
    const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

    let margin = {top: 60, left:60, bottom: 60, right:90};
    let height = 480, width = 780;

    let format = d3.time.format("%M:%S");

    var y = d3.scale.linear().range([0,height]);
    var x = d3.time.scale.range([0,width]);
});