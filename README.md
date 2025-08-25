# **Global Hunger and Food Security Analysis** 🌍

This project, encapsulated in a Jupyter Notebook, presents an in-depth, data-driven analysis of global hunger and food security. By integrating and analyzing datasets from reputable sources, this project aims to uncover critical trends, correlations, and insights that contribute to a deeper understanding of food insecurity worldwide.

The repository serves as a practical demonstration of a complete data science workflow: from automated data acquisition and meticulous cleaning to sophisticated exploratory analysis and compelling visualization.

---

### **Project Overview**

The primary goal of this project is to uncover trends and relationships between various indicators of food insecurity using open-source data. The workflow is structured into the following key phases:

1.  **Data Acquisition:** Automated scraping of over 10 different datasets from **Our World in Data (OWID)** and a relevant table on the Global Hunger Index from **Wikipedia**.
2.  **Data Cleaning & Integration:** Merging disparate datasets into a single, comprehensive DataFrame. This includes renaming columns for readability and handling missing values with a mix of simple imputation (median, mean) and more advanced techniques.
3.  **Advanced Data Imputation:** Strategic use of a **K-Nearest Neighbors (KNN) imputer** to fill in missing data points for critical features like GDP per capita, ensuring the analysis is accurate and robust.
4.  **Exploratory Data Analysis (EDA) & Visualization:** Creating a series of insightful plots to visualize trends and correlations, such as the relationship between economic prosperity and rates of undernourishment and stunting.

---

### **Methodology & Key Concepts**

#### **Global Hunger Index (GHI)**

The GHI, a central metric in this analysis, is a powerful tool that measures hunger across four key dimensions:

* **Undernourishment:** The proportion of the population with insufficient caloric intake.
* **Child Wasting:** Children under five with low weight for their height (acute undernutrition).
* **Child Stunting:** Children under five with low height for their age (chronic undernutrition).
* **Child Mortality:** The death rate of children under five, largely due to undernutrition.

By combining these indicators, the GHI provides a holistic and accurate picture of a country's hunger situation, minimizing potential measurement errors.

#### **Data Sourcing**

The datasets from Our World in Data (OWID) are curated from respected international bodies such as the **Food and Agriculture Organization (FAO)** of the United Nations, the World Bank, and the World Health Organization (WHO). This ensures the reliability and integrity of the data used throughout the analysis.

#### **KNN Imputation**

This project uses KNN imputation for handling missing data, a superior method to simple mean or median imputation. For any data point with a missing value, the algorithm finds the `k` most similar data points ("neighbors") based on the available features and uses their values to make an educated guess. This method leverages relationships within the dataset to provide more realistic and accurate imputations.

---

### **Technical Stack** 💻

* **Python**: The core programming language.
* **`pandas`**: The fundamental library for data manipulation and analysis.
* **`requests` & `BeautifulSoup`**: Used for automated data fetching and web scraping.
* **`matplotlib` & `seaborn`**: Libraries for creating static and high-quality data visualizations.
* **`scikit-learn`**: Utilized for its machine learning capabilities, specifically for the KNN imputation model.

---

### **How to Use** ▶️

1.  **Clone the Repository:** Get a copy of the Jupyter Notebook file.
2.  **Install Dependencies:** Ensure all required libraries are installed by running `pip install pandas numpy requests beautifulsoup4 matplotlib seaborn scikit-learn` in your terminal.
3.  **Run the Notebook:** Open the `.ipynb` file in a Jupyter environment (e.g., JupyterLab or Google Colab) and execute the cells in sequence. The output will include the cleaned datasets and a series of informative visualizations.

Feel free to explore the code, modify parameters, and adapt the analysis to new datasets or research questions. Contributions and feedback are welcome!
