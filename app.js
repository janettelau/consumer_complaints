// Initialize the currentState to "All" by default, which will show data for all states
let currentState = "All";

// Function to initialize the dashboard
function init() {
    // Use D3 to load the JSON file containing complaint data
    d3.json('./Resources/sample_complaints.json').then(function(data) {

        // Populate the state dropdown
        stateDropdown(data);

        // Set the initial state to "All" before the user selects any state
        let defaultState = "All";

        // Call functions to build the summary and charts for the "All" state
        buildSummary(defaultState, data);
        buildCharts(defaultState, data);

        // Add an event listener for when the user changes the state in the dropdown
        d3.select("#state-select").on("change", function() {
            // Get the newly selected state from the dropdown
            let selectedState = d3.select(this).property("value");

            // Update the currentState variable to reflect the selected state
            currentState = selectedState; 

            // Rebuild the summary and charts for the selected state
            buildSummary(selectedState, data);
            buildCharts(selectedState, data);
        });
    })
}

// Function to populate the state dropdown
function stateDropdown(data) {

    // Get unique, sorted state names from the data
    let states = data.map(item => item.state_name).filter((value, index, self) => self.indexOf(value) === index).sort();

    // Select the dropdown element
    let dropdown = d3.select("#state-select");

    // Add each state as an option in the dropdown
    states.forEach(state => {
        dropdown.append("option").text(state).property("value", state);
    });
}


// Function to build the summary panel using forEach
function buildSummary(state, data) {

    // Filter data based on the selected state if "All" is selected, use all data; otherwise, filter by state
    let filteredData = state === "All" ? data : data.filter(item => item.state_name === state);

    // Initialize variables to track total complaints and timely responses
    let totalComplaints = 0;
    let timelyResponses = 0;

    // Loop through the filtered data to count total complaints and timely responses
    filteredData.forEach(item => {
        // Increment total complaints count
        totalComplaints += 1;

        // Check if response was timely
        if (item["timely response?"]) {
            // Increment timely responses count
            timelyResponses += 1;
        }
    });

    // Update the summary panel with the counts of total complaints and timely responses
    d3.select("#total-complaints").text(totalComplaints);
    d3.select("#timely-responses").text(timelyResponses);
}


// Function to wrap text using regex
function wrapText(labels, maxLength = 20) {
    return labels.map(label => {
        // Check if the label's length exceeds the specified maximum length
        if (label.length > maxLength) {

            // Create a regex to match substrings up to maxLength, ensuring not to cut words in half
            let regex = new RegExp(`.{1,${maxLength}}(?:\\s|$)`, 'g');

            // Apply the regex to split the label at word boundaries
            let wrappedText = label.match(regex);

            // Join the lines with <br> for line breaks
            return wrappedText.join('<br>'); 
        }
        // Return label as is if no wrapping needed
        return label; 
    });
}


// Function to build the choropleth map showing complaints by state using a basic for loop
function buildMap(state, data) {

    // Filter the data based on the selected state
    let filteredData = state === "All" ? data : data.filter(item => item.state_name === state);

    // Prepare the complaints count by state using a basic for loop
    let stateCounts = {};

    // Manually count complaints per state using a for loop
    for (let i = 0; i < filteredData.length; i++) {

        // Get the state abbreviation from each item
        let stateAbbr = filteredData[i].state;  

        // If the state already exists in the stateCounts object, increment the count
        if (stateCounts[stateAbbr]) {
            stateCounts[stateAbbr] += 1;
        } else {
            // If the state is not in the object, initialize the count to 1
            stateCounts[stateAbbr] = 1;
        }
    }

    // List of states (abbreviations) and their complaint counts
    let states = Object.keys(stateCounts);        
    let complaints = Object.values(stateCounts); 

    // Create a choropleth map
    let mapTrace = {
        type: 'choropleth',
        locations: states,
        locationmode: 'USA-states', // Use USA state codes
        z: complaints, // Complaint counts used for coloring
        hoverinfo: 'location+z', // Display state abbreviation and complaint count on hover
        colorbar: {
            title: 'Number of Complaints', // Label for the color bar
        },
        colorscale: [
            [0, 'lightgreen'], // Start of the scale
            [1, 'darkgreen']   // End of the scale
        ]
    };

    // Data for the choropleth map
    let mapData = [mapTrace];

    // Layout for the map
    let mapLayout = {
        geo: {
            scope: 'usa',  // The map will focus on the United States
            bgcolor: 'rgba(0, 0, 0, 0)' // Transparent background
        },
        title: {
            text: "Complaints by State", // Title of the map
            font: {
                family: 'Roboto, sans-serif', // Font for the title
                size: 20,                     // Font size for the title
                color: '#000',                // Font color for the title
            }
        },
        font: { family: 'Roboto, sans-serif' },
        height: 400,  // Set the height of the map
        width: 750,   // Set the width of the map
        margin: { t: 40, l: 40, r: 40, b: 40 },
        paper_bgcolor: 'rgba(0, 0, 0, 0)', // Transparent outer background
        plot_bgcolor: 'rgba(0, 0, 0, 0)'   // Transparent plot background
    };

    // Plot the choropleth map using Plotly
    Plotly.newPlot('complaints-map', mapData, mapLayout);

    // Add the plotly_click event to the map
    let mapDiv = document.getElementById('complaints-map');
    mapDiv.on('plotly_click', function(eventData) {

        // Debugging: Log the entire eventData object
        console.log("Event Data: ", eventData); 
        
        // Check if 'location' exists in the eventData
        if (eventData.points && eventData.points[0]) {

            // Get the clicked state abbreviation
            let clickedStateAbbr = eventData.points[0].location;

            // Debugging: Log the state abbreviation
            console.log("Clicked state abbreviation: ", clickedStateAbbr);  // Debugging: Log the state abbreviation

            // Look up the full state name using the abbreviation from the clicked state
            let clickedStateFullName = getStateNameByAbbr(clickedStateAbbr, data);
            if (clickedStateFullName) {
                console.log("Mapped state name: ", clickedStateFullName);

                // If the clicked state is the same as the current state, reset the state filter
                if (clickedStateFullName === currentState) {

                    // Reset to "All"
                    currentState = "All";  

                    // Reset the dropdown selection
                    d3.select("#state-select").property("value", "All"); 
                } 
                else {
                    // Update the state
                    currentState = clickedStateFullName; 

                    // Update the dropdown selection
                    d3.select("#state-select").property("value", clickedStateFullName); 
                }

                // Rebuild summary and charts based on the updated or reset state
                buildSummary(currentState, data);
                buildCharts(currentState, data);
            }
        }
    });
}


// Helper function to map abbreviation to full state name
function getStateNameByAbbr(stateAbbr, data) {
    // Find the state name corresponding to the abbreviation
    let stateData = data.find(item => item.state === stateAbbr);

    // Return the full state name
    return stateData.state_name;
}

// Function to build the charts
function buildCharts(state, data) {

    // Filter the data based on the selected state, default to "All" if no state selected
    let filteredData = state === "All" ? data : data.filter(item => item.state_name === state);

    // Initialize objects for counting complaints by issue and product
    let issueCounts = {};
    let productCounts = {};

    // Iterate over the filtered data to count complaints by issue and product
    filteredData.forEach(item => {

        // Count complaints by issue
        if (issueCounts[item.issue]) {
            issueCounts[item.issue] += 1;
        } else {
            issueCounts[item.issue] = 1;
        }

        // Count complaints by product
        if (productCounts[item.product]) {
            productCounts[item.product] += 1;
        } else {
            productCounts[item.product] = 1;
        }
    });

    // Convert issueCounts object to an array and sort by count in descending order
    let sortedIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Separate issue labels and values from sortedIssues
    let issueLabels = sortedIssues.map(d => d[0]);
    let issueValues = sortedIssues.map(d => d[1]);

    // Convert productCounts object to an array and sort by count in descending order
    let sortedProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);

    // Separate product labels and values from sortedProducts
    let productLabels = sortedProducts.map(d => d[0]);
    let productValues = sortedProducts.map(d => d[1]);

    // Wrap text for product labels
    productLabels = wrapText(productLabels, 30);

    // Build the choropleth map showing complaints by state
    buildMap(state, data);

    // Building a Bar Chart for complaints by issues
    let trace1 = {
        x: issueValues.reverse(),  // Reverse the values for descending order
        y: issueLabels.reverse(), // Reverse the labels to match the sorted order
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#228B22' // Set the bar color to green
        }
    };

    let barData = [trace1];

    // Layout for the complaints by issue bar chart
    let barLayout = {
        title: {
            text: "Complaints by Issue",
            font: {
                family: 'Roboto, sans-serif', // Font for the title
                size: 20,                     // Font size for the title
                color: '#000',                // Title color
            }
        },
        font: { family: 'Roboto, sans-serif' },
        margin: { t: 30, l: 350 },
        paper_bgcolor: 'rgba(0, 0, 0, 0)', // Transparent outer background
        plot_bgcolor: 'rgba(0, 0, 0, 0)'   // Transparent plot area background
    };

    // Plot the bar chart using Plotly
    Plotly.newPlot('bar-chart-issue', barData, barLayout);

    // Create a bar chart for complaints by product
    let trace2 = {
        x: productValues.reverse(),  // Reverse the values for descending order
        y: productLabels.reverse(),  // Reverse the labels to match the sorted order
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#228B22', // Set the bar color to green
        }
    };

    let barProductData = [trace2];

    // Layout for the complaints by product bar chart
    let barProductLayout = {
        title: {
            text: "Complaints by Product",
            font: {
                family: 'Roboto, sans-serif', // Font for the title
                size: 20,                     // Font size for the title
                color: '#000',                // Title color
            }
        },
        font: { family: 'Roboto, sans-serif' },
        margin: { t: 30, l: 200 },
        paper_bgcolor: 'rgba(0, 0, 0, 0)', // Transparent outer background
        plot_bgcolor: 'rgba(0, 0, 0, 0)'   // Transparent plot area background
    };

    // Plot the bar chart using Plotly
    Plotly.newPlot('bar-chart-product', barProductData, barProductLayout);
}

// Initialize the dashboard
init();
