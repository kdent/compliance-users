from collections import defaultdict

import pandas as pd


def read_user_facility_data(data_path, compliance_reports):
    entity_facility_df = pd.DataFrame()
    for r in compliance_reports:
        df = pd.read_excel(data_path + r + 'compliancereport.xlsx', r + ' ' + 'Compliance Summary')

        # clean up dataframe
        df.columns = df.iloc[3]
        df.rename(
            columns={
                'Entity ID': 'user_id',
                'Legal Name': 'user_name',
                'ARB GHG ID': 'facility_ids',
            },
            inplace=True,
        )
        df = df[['user_id', 'user_name', 'facility_ids']]
        df['reporting_period'] = r

        # drop CAISO, which does not have an user ID nor facility ids
        df = df[df['facility_ids'].notna()]

        # make a row for each facility id connected to a user and compliance period
        df['facility_ids'] = df['facility_ids'].apply(lambda x: str(x).replace(' ', '').split(','))
        df = df.explode('facility_ids')
        df = df.rename(columns={'facility_ids': 'facility_id'})

        df = df[1:].reset_index(drop=True)
        entity_facility_df = entity_facility_df.append(df)

    entity_facility_df['user_id'] = entity_facility_df['user_id'].str.strip()
    entity_facility_df['user_name'] = entity_facility_df['user_name'].str.strip()
    return entity_facility_df


def make_user_to_facilities(user_facility_df):
    user_ids = user_facility_df['user_id'].unique().tolist()
    user_to_facilities = {}
    for user_id in user_ids:
        facilities = defaultdict(list)
        f = user_facility_df[user_facility_df['user_id'] == user_id]
        for i, row in f.iterrows():
            facilities[row['reporting_period']].append(row['facility_id'])
        user_to_facilities[user_id] = dict(facilities)
    return user_to_facilities


def make_facility_to_users(user_facility_df):
    facility_ids = user_facility_df['facility_id'].unique().tolist()
    facility_to_users = {}
    for fid in facility_ids:
        users = defaultdict(list)
        u = user_facility_df[user_facility_df['facility_id'] == fid]
        for i, row in u.iterrows():
            users[row['reporting_period']].append(row['user_id'])
        facility_to_users[fid] = dict(users)
    return facility_to_users


def make_user_name_to_id(user_facility_df):
    u = user_facility_df[['user_id', 'user_name']].drop_duplicates('user_id')
    user_name_to_id = {}
    for i, row in u.iterrows():
        user_name_to_id[row['user_name'].strip()] = row['user_id']
    return user_name_to_id


def make_user_id_to_name(user_facility_df):
    u = user_facility_df[['user_id', 'user_name']].drop_duplicates('user_id')
    user_id_to_name = {}
    for i, row in u.iterrows():
        user_id_to_name[row['user_id'].strip()] = row['user_name']
    return user_id_to_name
