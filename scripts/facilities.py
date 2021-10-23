import pandas as pd
from collections import defaultdict


mrr_file_year = {'2013':'2019', '2014':'2019', '2015':'2019', 
                 '2016':'2020', '2017':'2020', '2018':'2020', '2019':'2020'}
reporting_periods = {'2013':'2013-2014', 
                     '2014':'2013-2014', 
                     '2015':'2015-2017', 
                     '2016':'2015-2017',
                     '2017':'2015-2017',
                     '2018': '2018',
                     '2019': '2019'}


def read_facility_data(data_path, mrr_data_years):
    facility_df = pd.DataFrame()
    for r in mrr_data_years:
        df = pd.read_excel(data_path+r+'-ghg-emissions-'+mrr_file_year[r]+'-11-04.xlsx', r+' GHG Data')
    
        # clean up dataframe
        df.columns = df.iloc[7]
        df = df[8:].reset_index(drop="true")
        
        # drop facilities w/ no covered emissions, which shouldn't
        # be represented in the compliance reports
        df = df[df['Total Covered Emissions']>0]

        df.rename(columns = {'ARB ID': 'facility_id',
                            'Facility Name': 'facility_name',
                            'City': 'city',
                            'State': 'state',
                            'Industry Sector': 'sector'}, 
                inplace = True)
        df = df[['facility_id','facility_name','city','state','sector']]
        df['reporting_period'] = reporting_periods[r]
        facility_df = facility_df.append(df)

    facility_df['facility_id'] = facility_df['facility_id'].astype(str)
    facility_df['facility_id'] = facility_df['facility_id'].str.strip()
    facility_df['facility_name'] = facility_df['facility_name'].str.strip()
    facility_df['city'] = facility_df['city'].str.title()
    facility_df['city'] = facility_df['city'].str.strip()
    facility_df['state'] = facility_df['state'].str.upper()
    facility_df['state'] = facility_df['state'].str.strip()
    
    # keep most recent info associated with a fid in each reporting period  
    facility_df = facility_df.drop_duplicates(['facility_id', 'reporting_period'], keep='last')
    return facility_df


def make_facility_info(facility_df):
    facility_name_to_id = {}
    facility_id_to_info = defaultdict(dict)
    for i,row in facility_df.iterrows():
        facility_name_to_id[row['facility_name']] = row['facility_id']
        facility_id_to_info[row['facility_id']][row['reporting_period']] = {'facility_name': row['facility_name'],
                                                                            'city': row['city'],
                                                                            'state': row['state'],
                                                                            'sector': row['sector']}
    return facility_name_to_id, dict(facility_id_to_info)