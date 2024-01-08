## Steps for annual data updates 

- Get new data
	- Download new data files (issuance table, compliance report, emissions data)
	- Rename previous issuance table to match the tool version is was associated with

- In 'build_users_data.py':
	- Add new data years 
	- Change issuance table path to latest issuance table name 
	- Change json output file name to the next file version 

- In 'facilities.py': 
	- Update file name dictionaries


If CARB doesn't change the format of their spreadsheets, you should just be able to run 'build_users_data.py' from here! However, they often make changes like adding or delete rows in the spreadsheet, which require special handling where we read in the excel files. 

- Handle "special cases" in excel sheet formating in wherever we use the function 'pd.read_excel' to capture year-by-year variations


Once all the data is successfully read in, it's time to do a series of spot checks on the data. (I usually do this in a jupyter notebook.) 

- Check that the data at head and tail of each new data file is part of the new database. This is easiest to do by examining the intermediary dataframes (user_project_df, project_df, user_facility_df, facility_df) created in the main function of 'build_users_data.py'.

- Choose a handful of compliance users and manually check the related data in the new raw data files + the live compliance tool. 

- Choose a handful of offst projects and manually check that we've correctly capture who has used their offsets using the new raw data files + the live compliance tool. 


Update documentation: 

- Indicate new version in 'README.md'

- Update the "last updated" date and list of years included in 'methods.md', 'layout.js', and '.zenodo.json'. 


Update and test front-end: 

- Add new year to the filters. 

- Change pointer in 'components/use-store.js' to access the new data. 
