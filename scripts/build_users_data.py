import json

import pandas as pd
import numpy as np

import project_to_users
import user_to_projects

compliance_reports =['2013-2014', '2015-2017', '2018', '2019']
compliance_report_path = 'data/compliance-reports/'
issuance_table_path = 'data/'

project_types = {
    'Forest': 'U.S. Forest Project',
    'ODS': 'Ozone Depleting Substance Project',
    'Livestock': 'Livestock Project',
    'MMC': 'Mine Methane Capture Project',
    'Rice': 'Rice Cultivation Project', 
    'Urban': 'Urban Forest Project'
}

def read_project_id_map(): 
    issuance = pd.read_excel(issuance_table_path + 'arboc_issuance.xlsx','ARB Offset Credit Issuance')
    project_id_map = issuance[['CARB Issuance ID','OPR Project ID', 'Offset Project Name', 'Project Type']].drop_duplicates()
    project_id_map.rename(columns = {'CARB Issuance ID': 'arb_id',
                            'OPR Project ID': 'opr_id', 
                            'Offset Project Name': 'project_name',
                            'Project Type': 'project_type'}, 
                            inplace = True)
    project_id_map['arb_id'] = project_id_map['arb_id'].str.strip()
    project_id_map['opr_id'] = project_id_map['opr_id'].astype(str).str.strip()
    for i,row in project_id_map.iterrows(): 
        row['project_type'] = project_types[row['project_type']]
    return project_id_map


def read_entity_project_data():
    entity_project_df = pd.DataFrame()
    for r in compliance_reports:
        df = pd.read_excel(compliance_report_path + r + 'compliancereport.xlsx', r +' '+ 'Offset Detail')
        df.columns = df.iloc[3]
        df = df[~np.any(df.isna(), axis=1)]
        df = df[4:].reset_index(drop="true")
        df['reporting_period'] = r
        entity_project_df = entity_project_df.append(df)
    entity_project_df.rename(columns = {'Entity ID': 'entity_id',
                                    'Legal Name': 'entity_name',
                                    'Vintage': 'vintage',
                                    'Quantity': 'quantity',
                                    'ARB Project ID #': 'arb_id'}, 
                                    inplace = True)
    entity_project_df['entity_id'] = entity_project_df['entity_id'].str.strip()
    entity_project_df['arb_id'] = entity_project_df['arb_id'].str.strip()
    project_id_map = read_project_id_map()
    entity_project_df = entity_project_df.merge(project_id_map, how='left', on='arb_id')
    return entity_project_df


def write_json(collection, output):
    with open(output, "w") as f:
        f.write(json.dumps(collection))


def main():
    entity_project_df = read_entity_project_data()
    project_collection = project_to_users.make_project_collection(entity_project_df)
    user_collection = user_to_projects.make_users_collection(entity_project_df)
    output_suffix = compliance_reports[0]+'_'+compliance_reports[-1]
    write_json(project_collection, 'data/outputs/project_users_' + output_suffix + '.json')
    write_json(user_collection, 'data/outputs/user_projects_' + output_suffix + '.json')


if __name__ == "__main__":
    main()
