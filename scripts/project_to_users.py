import pandas as pd


def make_project_collection(entity_project_df): 
    #entity_project_df = read_entity_project_data()
    opr_ids = entity_project_df['opr_id'].unique().tolist()
    project_collection = {}
    for opr_id in opr_ids:
        users = []
        u = entity_project_df[entity_project_df['opr_id']==opr_id]
        for i, row in u.iterrows(): 
            user = {'entity_id': row['entity_id'],
                    'entity_name': row['entity_name'],
                    'reporting_period': row['reporting_period'],
                    'quantity': row['quantity'],
                    'arb_id': row['arb_id']
                }
            users.append(user)
        project_collection[opr_id] = users
    return project_collection
