// Reading JSON file
d3.json("././data.json").then(importedData => {
  console.log(importedData);
  var data = importedData;

  // Adding Partcipant IDs to choose from dropdown menu
  var idList = data.names;
  for (var i = 0; i < idList.length; i++) {
    selectOption = d3.select("#selDataset");
    selectOption.append("option").text(idList[i]);
  };

  // Setting up default plot
  updatePlots(0);

  // Function for updating plots which takes index number as an argument
  function updatePlots(index) {

    // Setting arrays for horizontal bar chart and bubble chart
    var sampleSubjectOTUs = data.samples[index].otu_ids;
    console.log(sampleSubjectOTUs);
    var sampleSubjectFreq = data.samples[index].sample_values;
    console.log(sampleSubjectFreq);
    var otuLabels = data.samples[index].otu_labels;

    // Setting array for gauge chart
    var washFrequency = data.metadata[index].wfreq;
    console.log(washFrequency);

    // Setting up data to populate Demographic Data card
    var demoKeys = Object.keys(data.metadata[index]);
    var demoValues = Object.values(data.metadata[index])
    var demographicData = d3.select('#sample-metadata');

    // Clearing previous demographic data
    demographicData.html("");

    // Populating demographic data for selected sample
    for (var i = 0; i < demoKeys.length; i++) {

      demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
    };

    // Slice and reverse data for horizontal bar chart
    var topTenOTUs = sampleSubjectOTUs.slice(0, 10).reverse();
    console.log(topTenOTUs);
    var topTenFreq = sampleSubjectFreq.slice(0, 10).reverse();
    console.log(topTenFreq);
    var topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
    console.log(topTenToolTips);
    var topTenLabels = topTenOTUs.map(otu => ("OTU " + otu));
    var reversedLabels = topTenLabels.reverse();
    console.log(reversedLabels);

    // Set up trace for horizontal bar chart
    var trace1 = {
      x: topTenFreq,
      y: reversedLabels,
      text: topTenToolTips,
      type: "bar",
      orientation: "h"
    };

    var barData = [trace1];

    // Applying layout for horizontal bar chart
    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 75,
        r: 75,
        t: 75,
        b: 50
      }
    };

    // Rendering the horizontal bar chart to the div tag with id "bar"
    Plotly.newPlot("bar", barData, layout);

    // Setting up trace for bubble chart
    trace2 = {
      x: sampleSubjectOTUs,
      y: sampleSubjectFreq,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: sampleSubjectOTUs,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleSubjectFreq
      }
    };

    var bubbleData = [trace2];

    // Layout for bubble chart
    var layout = {
      title: 'OTU Frequency',
      showlegend: false,
      height: 600,
      width: 930
    };

    // Rendering the bubble chart to the div tag with id "bubble"
    Plotly.newPlot("bubble", bubbleData, layout);

    // Trace for Gauge chart
    var trace3 = [{
      domain: {x: [0, 1], y: [0, 1]},
      type: "indicator",
      mode: "gauge+number",
      value: washFrequency,
      title: { text: "Belly Button Washes Per Week" },
      text: ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
      textinfo: "text",
      textposition: "inside",
      gauge: {
        axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
        bar: { color: "#669999" },
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "black",
        steps: [
          { range: [0, 1], color: "#f8f8f8" },
          { range: [1, 2], color: "#f8f8ba" },
          { range: [2, 3], color: "#f8f87c" },
          { range: [3, 4], color: "#ccce0f" },
          { range: [4, 5], color: "#abd216" },
          { range: [5, 6], color: "#77c71a" },
          { range: [6, 7], color: "#54c73a" },
          { range: [7, 8], color: "#008330" },
          { range: [8, 9], color: "#006f02" }

        ]
      }
    }];

    var gaugeData = trace3;
    
    // Layout for gauge chart
    var layout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 }
    };

    // Rendering the gauge chart to the div tag with id "gauge"
    Plotly.newPlot("gauge", gaugeData, layout);

  }

  // On button click, call optionChanged()
  d3.selectAll("#selDataset").on("change", optionChanged);



  function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var selectedID = dropdownMenu.property("value");
    console.log(selectedID);

    for (var i = 0; i < data.names.length; i++) {
      if (selectedID === data.names[i]) {
        updatePlots(i);
        return;
      }
    }
  }

});
