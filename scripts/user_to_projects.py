import pandas as pd


def make_users_collection(entity_project_df): 
    #entity_project_df = read_entity_project_data()
    entity_ids = entity_project_df['entity_id'].unique().tolist()
    users_collection = {}
    for entity_id in entity_ids:
        projects = []
        p = entity_project_df[entity_project_df['entity_id']==entity_id]
        for i, row in p.iterrows(): 
            project = {'entity_name': row['entity_name'],
                    'opr_id': row['opr_id'],
                    'arb_id': row['arb_id'],
                    'project_name': row['project_name'],
                    'project_type': row['project_type'],
                    'reporting_period': row['reporting_period'],
                    'quantity': row['quantity'],
                }
            projects.append(project)
        users_collection[entity_id] = projects
    return users_collection
