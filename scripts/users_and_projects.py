import pandas as pd
import re

def read_user_project_data(data_path, compliance_reports):
    user_project_df = pd.DataFrame()
    for r in compliance_reports:
        df = pd.read_excel(data_path + r + 'compliancereport.xlsx', r +' '+ 'Offset Detail')
        df.columns = df.iloc[3]
        df = df[4:].reset_index(drop="true")
        df = df[~pd.isnull(df).any(axis=1)]
        df['reporting_period'] = r
        user_project_df = user_project_df.append(df)
    user_project_df.rename(columns = {'Entity ID': 'user_id',
                                    'Quantity': 'quantity',
                                    'ARB Project ID #': 'arb_id'}, 
                                    inplace = True)
    user_project_df = user_project_df[['user_id', 'arb_id', 'quantity', 'reporting_period']]
    user_project_df['user_id'] = user_project_df['user_id'].str.strip()
    user_project_df['arb_id'] = user_project_df['arb_id'].str.strip()
    
    # ignoring offset vintage lets us simplify arb_id and collapse
    # rows that had the same entity and project but different vintages
    for i,row in user_project_df.iterrows(): 
        row['arb_id'] = re.search('.*(?=-)', row['arb_id']).group(0)
    user_project_df = user_project_df.groupby(['user_id', 'arb_id', 'reporting_period'])['quantity'].sum().reset_index()
    return user_project_df


def make_user_to_arbs(user_project_df): 
    user_ids = user_project_df['user_id'].unique().tolist()
    user_to_arbs = {}
    for user_id in user_ids:
        projects = []
        p = user_project_df[user_project_df['user_id']==user_id]
        for i, row in p.iterrows(): 
            project = {'arb_id': row['arb_id'],
                    'reporting_period': row['reporting_period'],
                    'quantity': row['quantity']
                    }
            projects.append(project)
        user_to_arbs[user_id] = projects
    return user_to_arbs

def make_arb_to_users(user_project_df): 
    arb_ids = user_project_df['arb_id'].unique().tolist()
    arb_to_user = {}
    for arb_id in arb_ids:
        users = []
        u = user_project_df[user_project_df['arb_id']==arb_id]
        for i, row in u.iterrows(): 
            user = {'user_id': row['user_id'],
                    'reporting_period': row['reporting_period'],
                    'quantity': row['quantity']
                    }
            users.append(user)
        arb_to_user[arb_id] = users
    return arb_to_user