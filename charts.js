function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var returnArray = metadata.filter(sampleObj => sampleObj.id == sample);
      
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);

    // 2. Create a variable that holds the first sample in the metadata array.
    var returns = returnArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;

    var otuLabels = result.otu_labels;

    var sampleValues = result.sample_values;

    console.log(otuIds);
    console.log(otuLabels);
    console.log(sampleValues);
    
    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = returns.wfreq;
    console.log(washingFrequency);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var sortedIds = otuIds.sort((a,b) =>
    // a.sample_values - b.sample_values).reverse(); 

    // var toptenIds = sortedIds.slice(0,10);

    // var topTenOtuIds = toptenIds.map(Ids => parseInt(Ids.otu_ids));
    // var topTenOtuLabels = toptenIds.map(Labels => Labels.otu_labels);
    // var topTenSampleValues = toptenIds.map(Values => parseInt(Values.sample_values));
    // console.log(topTenOtuIds);
    // console.log(topTenOtuLabels);
    // console.log(topTenSampleValues);
    // var yticks = topTenOtuIds

    var topTenOtuIds = otuIds.slice(0, 10).reverse()
    var topTenOtuLabels = otuLabels.slice(0, 10).reverse()
    var topTenSampleValues = sampleValues.slice(0, 10).reverse()
    console.log(topTenOtuIds);
    console.log(topTenOtuLabels);
    console.log(topTenSampleValues);

    var yticks = topTenOtuIds.map(otuID => `OTU ${otuID}`);

    // 8. Create the trace for the bar chart. 
    var trace = {
      type: 'bar',
      x: topTenSampleValues,
      y: yticks,
      mode: 'markers',
      marker: {size:16},
      text: topTenOtuLabels,
      orientation: "h"
    };
    
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: ""},
      yaxis: { title: ""}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

     // 1. Create the trace for the bubble chart.
     var traces = {
      x: topTenOtuIds,
      y: topTenSampleValues,
      mode: 'markers',
      marker: {
        size: topTenSampleValues,
        color: topTenOtuIds
      },
      text: topTenOtuLabels,
    };
     
     var bubbleData = [traces];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    // 4. Create the trace for the gauge chart.
    var tracer = {
      type: "indicator",
      mode: "gauge+number+delta",
      value: washingFrequency,
      title: { text: "Scrubs per Week" },
      gauge: { 
        axis: { range: [null, 10] }, 
        bar: { color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "limegreen"},
          {range: [8, 10], color: "forestgreen"}
        ],

    }};
    
    var gaugeData = [tracer];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "<b>Belly Button Washing Frequency<b>",
      autosize: false
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}
