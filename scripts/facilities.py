from collections import defaultdict

import pandas as pd

mrr_file_year = {
    "2013": "2019",
    "2014": "2019",
    "2015": "2019",
    "2016": "2020",
    "2017": "2020",
    "2018": "2020",
    "2019": "2020",
    "2020": "2021",
}
reporting_periods = {
    "2013": "2013-2014",
    "2014": "2013-2014",
    "2015": "2015-2017",
    "2016": "2015-2017",
    "2017": "2015-2017",
    "2018": "2018-2020",
    "2019": "2018-2020",
    "2020": "2018-2020",
}


def read_facility_data(data_path, mrr_data_years):
    facility_df = pd.DataFrame()
    for r in mrr_data_years:
        df = pd.read_excel(
            data_path + r + "-ghg-emissions-" + mrr_file_year[r] + "-11-04.xlsx",
            sheet_name=r + " GHG Data",
            skiprows=8,
        )

        # clean up dataframe
        rename_d = {
            "ARB ID": "facility_id",
            "Facility Name": "facility_name",
            "City": "city",
            "State": "state",
            "Industry Sector": "sector",
        }
        df.rename(
            columns=rename_d,
            inplace=True,
        )
        df = df[rename_d.values()]
        df["reporting_period"] = reporting_periods[r]
        facility_df = facility_df.append(df)

    facility_df["facility_id"] = facility_df["facility_id"].astype(str).str.strip()
    facility_df["facility_name"] = facility_df["facility_name"].str.strip()
    facility_df["city"] = facility_df["city"].str.title().str.strip()
    facility_df["state"] = facility_df["state"].str.upper().str.strip()

    # keep most recent info associated with a fid in each reporting period
    facility_df = facility_df.drop_duplicates(
        ["facility_id", "reporting_period"], keep="last"
    )
    return facility_df


def make_facility_info(facility_df, user_facility_df):

    facility_name_to_id = facility_df.set_index('facility_name')['facility_id'].to_dict()

    facility_id_to_info = defaultdict(dict)
    for i, row in facility_df.iterrows():
        facility_id_to_info[row["facility_id"]][row["reporting_period"]] = {
            "facility_name": row["facility_name"],
            "city": row["city"],
            "state": row["state"],
            "sector": row["sector"],
        }

    # There are a handful of cases where a facility listed in in a certain compliance report
    # (e.g. appearing in the user_facility_df in reporting period 2018-2020) doesn't correspond
    # with a facility listed with covered emissions in the MRR data for the same time period
    # (e.g. 2018, 2019, 2020). In these cases, we treat the compliance data as the "ground truth"
    # for which facilities are associated with a user in a given compliance period, and reference
    # the facility's information from previous compliance periods. We mark these cases by
    # prepending ** to the beginning a facility's name for the non-contemporary compliance periods.
    print("Facilities that appear in compliance data but not contemporary MRR data:")
    for fid, info in facility_id_to_info.items():
        compliance_listings = user_facility_df[user_facility_df["facility_id"] == fid][
            "reporting_period"
        ].values
        for r in compliance_listings:
            if r not in info:
                print("-----> " + fid + ", " + r)
                facility_id_to_info[fid][r] = info[list(info.keys())[0]].copy()
                facility_id_to_info[fid][r]["facility_name"] = (
                    "**" + facility_id_to_info[fid][r]["facility_name"]
                )

    return facility_name_to_id, dict(facility_id_to_info)
