# The World Inside Our Home

This is a project built as a part of our coursework for MSc in Computational and Data Journalism at Cardiff University. It’s a work in progress.

It offers analyses and visualisations of the symbiotic relation, borne of commodities, between the UK and other countries. We focus on the things we commonly have at home from three industries: food, textile, and wood. Our analyses and visualisations were based on 10-year data, if available and whenever necessary to the analysis. At the time this project was created, the latest available data was as of 2017.

## Navigate this site

Click either of the three main headings “Food,” “Textile,” or “Wood” on the homepage, and things we commonly have at home from the selected industry will be highlighted in the home image.

To see the countries that import these things into the UK on the world map, click the “Explore” link on the right. The world map shows all importing countries in 2017 for the selected industry. The lines on the map are scaled according to either import value in pounds or import volume. On the map, click any country to view a list of the import statistics from that location. Other visualisations are shown in the text.

Go back to “Home” to explore other industries.

## Data sources

For the food industry:
Export and Import (Detailed Trade Matrix) and Production (Live Animals, Livestock Primary, Crops), 2007–2017: [Food and Agriculture Organization (FAO) of the United Nations](http://www.fao.org/faostat/en/#data/TM)
Detailed Household Expenditure By Countries and Regions: Table A35: [Office for National Statistics (ONS)](https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/detailedhouseholdexpenditurebycountriesandregionsuktablea35)
Expenditure on Food and Non-Alcoholic Drinks By Place of Purchase: Table A2: [Office for National Statistics (ONS)]( https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/expenditureonfoodandnonalcoholicdrinksbyplaceofpurchaseukfinancialyearending2016tablea2)
Average Sterling Exchange Rate: US Dollar: [Office for National Statistics (ONS)](https://www.ons.gov.uk/economy/nationalaccounts/balanceofpayments/timeseries/auss/mret/previous)
GDP Deflators at Market Prices, and Money GDP March 2020 (Budget): [HM Treasury](https://www.gov.uk/government/statistics/gdp-deflators-at-market-prices-and-money-gdp-march-2020-budget)
ISO 3166 country codes: [International Organization for Standardization(ISO)](https://www.iso.org/iso-3166-country-codes.html)

For the textile industry:
Import/Export by Country: [ONS)](https://www.ons.gov.uk/datasets/trade/editions/time-series/versions/19)
[Global Apparel Facilities](https://openapparel.org/) & company websites. 
CPI Data: [ONS)](https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7bw/mm23?referrer=search&searchTerm=d7bw)
Consumer Trends: [ONS)](https://www.ons.gov.uk/economy/nationalaccounts/satelliteaccounts/datasets/consumertrends)
National Household Waste Composition: [WRAP](https://wrap.org.uk/sites/files/wrap/National%20household%20waste%20composition%202017.pdf)

For the wood industry:
Export/Import of Raw wood statistics (Forestry Production and Trade): [Food and Agriculture Organization (FAO) of the United Nations](http://www.fao.org/faostat/en/#data/TM)
Import/Export of raw types of wood (Industrial roundwood, plywoon, sawnwood etc): [UN Comtrade Database](https://comtrade.un.org/data)
UK Population: [Worldometer](https://www.worldometers.info/world-population/uk-population/)


## Data processing

Trade values were converted into thousands, whenever applicable, and from dollars to pounds, using the appropriate exchange rate for a given year. Trade values adjusted for inflation in 2017 pounds were used in the analysis of over a 10-year period.

The list of ISO 3166 country codes was used as a reference for the total number of countries and territories because it is comprehensive.

## Technologies used

We used a combination of technologies for data cleaning, manipulation, and analysis: Microsoft Excel, Python, and Tableau Prep.

We used the basic front-end development technologies: HTML5, CSS, and JavaScript. For visualisations, we used d3.js, Flourish, Tableau, and Adobe Illustrator. For implementing scrollytelling, we used graph-scroll.js and ScrollMagic.

## Collaborators

Rowena Caronan – website design and development; map visualisation; research, writing, and graphics (food)  

Naimish Keswani – website design and development; research, writing, and visualisations (textile)  
Maria Laar – website design and development; research, writing, and visualisations (textile)  


## Acknowledgement

This project was supported by our course coordinators Dr Aidan O’Donnell, from the School of Journalism, Media and Culture, and Dr Martin Chorley, from the School of Computer Science & Informatics.

## Publication

This project is published in May 2020. After the date of publication, the development of the project will probably be stopped completely.
