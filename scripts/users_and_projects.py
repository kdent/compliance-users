import pandas as pd


def read_user_project_data(data_path, reporting_periods):
    user_project_df = pd.DataFrame()
    for reporting_period in reporting_periods:
        if reporting_period == '2022':
            df = pd.read_excel(
                data_path + 'nc-' + reporting_period + 'compliancereport.xlsx',
                sheet_name=reporting_period + ' ' + 'Offset Detail',
                skiprows=4,
                usecols='A:E'
            )
        else: 
            df = pd.read_excel(
                data_path + reporting_period + 'compliancereport.xlsx',
                sheet_name=reporting_period + ' ' + 'Offset Detail',
                skiprows=4,
                usecols='A:E'
            )
        df = df[~pd.isnull(df).any(axis=1)]
        df['reporting_period'] = reporting_period
        user_project_df = user_project_df.append(df)
    rename_d = {
        'Entity ID': 'user_id',
        'Quantity': 'quantity',
        'ARB Project ID #': 'arb_id',
    }
    user_project_df.rename(
        columns=rename_d,
        inplace=True,
    )
    user_project_df = user_project_df[['user_id', 'arb_id', 'quantity', 'reporting_period']]
    user_project_df['user_id'] = user_project_df['user_id'].str.strip()
    user_project_df['arb_id'] = user_project_df['arb_id'].str.strip()

    # ignoring offset vintage lets us simplify arb_id and collapse
    # rows that had the same entity and project but different vintages
    user_project_df['arb_id'] = user_project_df['arb_id'].str.replace('CAFR-', 'CAFR') # typo in 2022 data for CAFR-6339
    user_project_df['arb_id'] = user_project_df['arb_id'].str.split('-').apply(lambda x: x[0])

    user_project_df = (
        user_project_df.groupby(['user_id', 'arb_id', 'reporting_period'])['quantity']
        .sum()
        .astype(int)
        .reset_index()
    )
    return user_project_df


def make_user_to_arbs(user_project_df):
    user_to_arbs = (
        user_project_df.groupby('user_id')
        .apply(lambda x: x.set_index('user_id').to_dict(orient='records'))
        .to_dict()
    )

    return user_to_arbs


def make_arb_to_users(user_project_df, combined_arbs):
    arb_ids = user_project_df['arb_id'].unique().tolist()
    arb_to_user = {}
    for arb_id in arb_ids:
        users = []
        u = user_project_df[user_project_df['arb_id'] == arb_id]
        for i, row in u.iterrows():
            user = {
                'user_id': row['user_id'],
                'reporting_period': row['reporting_period'],
                'quantity': row['quantity'],
            }
            users.append(user)
        arb_to_user[arb_id] = users
    # Add an extra entry to be able to easily look up the users for
    # 'combined arb ids'. In other words, if multiple arb_ids have
    # used to represent the same underlying project (i.e. the same)
    # opr id), this allows for a seach by the opr id that returns all
    # the users associated with the multiple arb ids.
    for combined_arb in combined_arbs:
        users = []
        for arb_id in combined_arb.split('-'):
            users = users + arb_to_user[arb_id]
        arb_to_user[combined_arb] = users
    return arb_to_user
