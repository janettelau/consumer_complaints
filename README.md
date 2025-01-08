# Cosumer Complaints

This project aims to build an interactive dashboard for analyzing and visualizing customer complaint data collected by the Consumer Financial Protection Bureau. The program is created using HTML, JavaScript, D3.js, and Plotly and provides insights into the kind and distribution of complaints across the United States from a sample size of 5,000 in 2024.

## Getting Started
1. Install Python on your computer
```
https://www.python.org/downloads/
```
2. Create a new environment
```
conda create -n dev python=3.10 anaconda -y
```
3. Activate the environment
```
conda activate dev
```
4. Install all the required dependencies.
```
pip install -r requirements.txt
```
5. Clone this repository to your local computer using `git clone`.
6. Download the consumer complaints dataset from the Consumer Financial Protection Bureau using the link below.
```
https://files.consumerfinance.gov/ccdb/complaints.csv.zip
```
7. Unzip the folder and add it to the cloned repository.
8. Open Visual Studio Code and download "Live Server" by navigating to "Extensions" (Ctrl + Shift + X).

## Cleaning the Data:
1. Filtered the dataset to include complaints received between 2024-01-01 to 2024-12-31.
2. Handled missing values by dropping them.
3. Took a random sample of 5,000 records.
4. Changed the data format for select columns.
5. Merged the `state_names.csv` with our sample Dataframe on the "state" column to get the "state_name" column.
6. Saved the cleaned and aggregated data as a JSON file used for the dashboard.
7. Plotted the number of complaints per month as a line graph with the average and upper control limit (UCL).

## Building the Complaints Dashboard:
- **HTML**:
  1. Built the structure and the layout of the dashboard.
  2. Imported the necessary libraries, such as Leaflet.js, Plotly.js, Bootstrap, and Google Fonts.
  3. Created different sections for the state filter dropdown menu and visualizations.

- **Javascript**:
  1. Loaded the data from the `sample_complaints.json` using D3.js.
  2. Built a function to populate the state name dropdown.
  3. Created the choropleth map and bar charts, which would change based on the state selected.
  4. Implemented interactive map clicking that filters the dashboard.
 
## Dashboard:
- **State Filter Dropdown Menu**:
  - The default option is set to "All".
  - Users can filter the data by state.

- **Complaints Summary**:
  1. Total Complaints: Displays the total number of complaints for all states or the selected state.
  2. Timely Response: Shows the total number of complaints that received timely responses for all states or the selected state.

- **US Map**:
  - Visually displays the state selected
  - Users can hover over each state to see the number of complaints and the state abbreviation.
  - Allows users to click on a state to filter the entire dashboard.
  - A colour gradient is shown based on the number of complaints each state receives when all states are selected.

- **Bar Charts**:
  1. Complaints by Product: Shows the number of complaints by product for all states or the selected state.
  2. Complaints by Issue: Displays the top 10 complaints by issue for all states or the selected state.

## Ethical Considerations:
We ensured the dataset was publicly available and provided by the United States government. Any sensitive information in the dataset is anonymized, and the study does not reinforce regional or demographic biases. Visualizations and insights are given honestly to ensure fairness and openness. Data is presented without bias or manipulation to alter outcomes.

## Datasets:
- complaints.csv
- state_names.csv
- logo.png

## Outputs:
- sample_complaints.csv
- sample_complaints.json
- index.html

## How to Run it 
1. Open the cloned file in the Visual Studio Code:
   1. Go to file > Open Folder and navigate to the folder where you cloned the repository.
   2. Select the folder to open in VS code.
2. Run the Jupyter Notebook:
     1. Open the notebook file (complaints_notebook.ipynb) in VS code or Jupyter.
     2. Run the cells to perform the Analysis.
3. Run the HTML file:
    1. Right-click on the HTML file (index.html) and click "Open with Live Server".
    2. Alternatively, open the HTML file (index.html) and press Alt + L followed by Alt + O.

## Group Members:
- Jana Khamis
- Paul Schaefer
- King Yuet Lau (Janette)

## References:
- “Consumer Complaint Database.” Consumer Financial Protection Bureau, www.consumerfinance.gov/data-research/consumer-complaints/. Accessed 7 Jan. 2025.
- Pettini, Francesco. “US State Names Codes and Abbreviations.” Kaggle, 15 Feb. 2022, www.kaggle.com/datasets/francescopettini/us-state-names-codes-and-abbreviations.
