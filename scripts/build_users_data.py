import json

import facilities
import pandas as pd
import projects
import users_and_facilities
import users_and_projects

# Todo: address pandas warning w/out silencing
pd.options.mode.chained_assignment = None

# Define years over which compliance data will be considered and where to find it
compliance_reports = ['2013-2014', '2015-2017', '2018-2020']
mrr_data_years = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']

compliance_report_path = 'data/compliance-reports/'
mrr_data_path = 'data/mrr-data/'
issuance_table_path = 'data/'


def prune_user_facility_data(user_project_df, user_facility_df):
    """Prunes user_facility data to include only entities who have
    have used offsets to meet their compliance obligations
    """
    uids_1 = user_project_df['user_id'].unique()
    uids_2 = user_facility_df['user_id'].unique()
    blacklist = list(set(uids_2) - set(uids_1))
    uf_df = user_facility_df[~user_facility_df['user_id'].isin(blacklist)]
    return uf_df


def prune_mismatched_facility_ids(user_facility_df, facility_df):
    """Prunes user_facility and facility data to exclude facility ids
    that only appear in dataset one or the other.

    As of 10/22/21, four facility IDs appear in compliance reports associated
    with users, but nowhere in the MRR facility data. Two of these have been
    confirmed as non-relavent facility IDs by CARB ('5043'- a legacy ID used
    for fee purposes, not relavent to GHG reporting; '57555'- a typo waiting
    to be corrected.)

    There are also four facility IDs with non-zero covered emissions that appear in the
    MRR data, but are not associated with any compliance entities in the
    compliance reports. These are unresolved mismatches.
    """
    fids1 = user_facility_df['facility_id'].unique()
    fids2 = facility_df['facility_id'].unique()
    blacklist = list(set(fids1) ^ set(fids2))
    uf_df = user_facility_df[~user_facility_df['facility_id'].isin(blacklist)]
    f_df = facility_df[~facility_df['facility_id'].isin(blacklist)]
    return uf_df, f_df


def write_json(collection, output):
    with open(output, "w") as f:
        f.write(json.dumps(collection))


def main():
    # Read and process offset project data from CARB's issuance table
    project_df = projects.read_project_data(issuance_table_path)
    opr_to_arbs, combined_arbs = projects.make_opr_to_arbs(project_df)
    arb_to_oprs = projects.make_arb_to_oprs(project_df)
    project_name_to_opr, opr_to_project_info = projects.make_project_info(project_df)

    # Read and process offset use data from compliance reports
    user_project_df = users_and_projects.read_user_project_data(
        compliance_report_path, compliance_reports
    )
    user_to_arbs = users_and_projects.make_user_to_arbs(user_project_df)
    arb_to_users = users_and_projects.make_arb_to_users(user_project_df, combined_arbs)

    # Read and process user data from the compliance reports, including associated facility ids
    user_facility_df = users_and_facilities.read_user_facility_data(
        compliance_report_path, compliance_reports
    )
    user_facility_df = prune_user_facility_data(user_project_df, user_facility_df)
    user_to_facilities = users_and_facilities.make_user_to_facilities(user_facility_df)
    facility_to_user = users_and_facilities.make_facility_to_users(user_facility_df)

    # Read and process facility data from the mrr emissions data
    facility_df = facilities.read_facility_data(mrr_data_path, mrr_data_years)
    user_facility_df, facility_df = prune_mismatched_facility_ids(user_facility_df, facility_df)
    user_name_to_id = users_and_facilities.make_user_name_to_id(user_facility_df)
    user_id_to_name = users_and_facilities.make_user_id_to_name(user_facility_df)

    facility_name_to_id, facility_id_to_info = facilities.make_facility_info(facility_df)

    # Create collection and write to json
    collection = {
        'opr_to_arbs': opr_to_arbs,
        'arb_to_oprs': arb_to_oprs,
        'opr_to_project_info': opr_to_project_info,
        'project_name_to_opr': project_name_to_opr,
        'opr_to_project_info': opr_to_project_info,
        'user_to_arbs': user_to_arbs,
        'arb_to_users': arb_to_users,
        'user_to_facilities': user_to_facilities,
        'facility_to_user': facility_to_user,
        'user_name_to_id': user_name_to_id,
        'user_id_to_name': user_id_to_name,
        'facility_name_to_id': facility_name_to_id,
        'facility_id_to_info': facility_id_to_info,
    }

    output_suffix = mrr_data_years[0] + '_' + mrr_data_years[-1]
    write_json(collection, 'data/outputs/user_data_' + output_suffix + '.json')


if __name__ == "__main__":
    main()
