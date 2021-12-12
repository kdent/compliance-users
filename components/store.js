import create from 'zustand'

const url =
  'https://raw.githubusercontent.com/carbonplan/compliance-users/main/data/outputs/user_data_2013_2020v4.json'

const useStore = create((set) => ({
  searchBy: {
    project: true,
    user: false,
    facility: false,
  },
  showResultsBy: { user: true },
  reportingPeriods: {
    '2013-2014': true,
    '2015-2017': true,
    '2018-2020': true,
  },
  data: null,
  setSearchBy: (searchBy) => {
    set({ searchBy: searchBy })
  },
  setShowResultsBy: (showResultsBy) => {
    set({ showResultsBy: showResultsBy })
  },
  setReportingPeriods: (reportingPeriods) => {
    set({ reportingPeriods: reportingPeriods })
  },
  fetch: async () => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.project_targets = Object.keys(data.arb_to_users)
          .concat(Object.keys(data.opr_to_arbs))
          .concat(Object.keys(data.project_name_to_opr))
          .filter((d) => !data.combined_arbs.includes(d))
        data.user_targets = Object.keys(data.user_to_arbs).concat(
          Object.keys(data.user_name_to_id)
        )
        data.facility_targets = Object.keys(data.facility_to_user).concat(
          Object.keys(data.facility_name_to_id)
        )
        console.log(data)
        set({ data: data })
      })
  },
}))

export default useStore
