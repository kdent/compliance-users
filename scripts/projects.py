import pandas as pd
import re

project_types = {
    'Forest': 'U.S. Forest Project',
    'ODS': 'Ozone Depleting Substance Project',
    'Livestock': 'Livestock Project',
    'MMC': 'Mine Methane Capture Project',
    'Rice': 'Rice Cultivation Project', 
    'Urban': 'Urban Forest Project'
}

def read_project_data(data_path):
    issuance = pd.read_excel(data_path + 'arboc_issuance.xlsx','ARB Offset Credit Issuance')
    # drop projects that have not been used for CA compliance purposes
    issuance['used'] = issuance[['Retired 1st Compliance Period (CA)',
                                 'Retired 2nd Compliance Period (CA)',
                                 'Retired 3rd Compliance Period (CA)']].sum(axis=1)
    issuance = issuance[issuance['used']>0]
    # subset and rename columns of interest
    issuance_df = issuance[['CARB Issuance ID','OPR Project ID', 'Offset Project Name', 
                               'Project Type', 'State','Project Documentation']]
    issuance_df.rename(columns = {'CARB Issuance ID': 'arb_id',
                            'OPR Project ID': 'opr_id', 
                            'Offset Project Name': 'project_name',
                            'Project Type': 'project_type',
                            'State': 'state',
                            'Project Documentation': 'documentation'}, 
                            inplace = True)
    # standardizing ids, table cleanup
    issuance_df['arb_id'] = issuance_df['arb_id'].str.strip()
    issuance_df['opr_id'] = issuance_df['opr_id'].astype(str).str.strip()
    for i,row in issuance_df.iterrows(): 
        row['project_type'] = project_types[row['project_type']]
        row['arb_id'] = re.search('.*(?=-)', row['arb_id']).group(0)
    # keep most recent project information associated with an arb/opr id pair
    issuance_df = issuance_df.drop_duplicates(['arb_id','opr_id'], keep='last')
    return issuance_df

def make_opr_to_arbs(issuance_df):
    opr_ids = issuance_df['opr_id'].unique().tolist()
    opr_to_arbs = {}
    for opr_id in opr_ids: 
        arbs = []
        o = issuance_df[issuance_df['opr_id']==opr_id]
        for i, row in o.iterrows():
            arbs.append(row['arb_id'])
        opr_to_arbs[opr_id] = arbs
    return opr_to_arbs


def make_arb_to_oprs(issuance_df):
    arb_ids = issuance_df['arb_id'].unique().tolist()
    arb_to_oprs = {}
    for arb_id in arb_ids: 
        oprs = []
        a = issuance_df[issuance_df['arb_id']==arb_id]
        for i, row in a.iterrows():
            oprs.append(row['opr_id'])
        arb_to_oprs[arb_id] = oprs
    return arb_to_oprs 


def make_project_info(issuance_df):
    # drop duplicates from many arb_ids mapping to one opr_id
    opr_rows = issuance_df.drop_duplicates(['opr_id','project_name', 'project_type', 'state', 'documentation'])    
    
    project_name_to_opr = {}
    opr_to_project_info = {}
    
    for i, row in opr_rows.iterrows():
        opr_id = row['opr_id']
        # skip row if opr_id has already been entered into dictionary
        # functionally, arbitrarily choosing the first-seen set of project info
        if opr_id in opr_to_project_info.keys(): continue 
        opr_to_project_info[opr_id] = {'project_name': row['project_name'],
                                             'project_type': row['project_type'],
                                             'state': row['state'],
                                             'documentation': row['documentation']}
        project_name_to_opr[row['project_name']] = opr_id
    
    return project_name_to_opr, opr_to_project_info

        
