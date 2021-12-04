import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Group, Input } from '@carbonplan/components'
import { sx, colors } from './styles'
import Results from './results'
import Search from './search'

const url =
  'https://raw.githubusercontent.com/carbonplan/compliance-users/main/data/outputs/user_data_2013_2020v3.json'

//const url = 'http://localhost:8080/user_data_2013_2020.json'

const init = {
  searchBy: {
    project: true,
    user: false,
    facility: false,
  },
  showResultsBy: {
    user: true,
  },
  reportingPeriods: {
    '2013-2014': true,
    '2015-2017': true,
    '2018-2020': true,
  },
}

const Main = () => {
  const [data, setData] = useState()
  const [search, setSearch] = useState('')
  const [searchId, setSearchId] = useState(null)
  const [searchBy, setSearchBy] = useState(init.searchBy)
  const [showResultsBy, setShowResultsBy] = useState(init.showResultsBy)
  const [reportingPeriods, setReportingPeriods] = useState(
    init.reportingPeriods
  )

  useEffect(() => {
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
        setData(data)
      })
  }, [])

  useEffect(() => {
    if (searchBy.project) {
      setShowResultsBy({
        user: true,
      })
    }
    if (searchBy.user) {
      setShowResultsBy({
        project: showResultsBy.facility ? false : true,
        facility: showResultsBy.facility ? true : false,
      })
    }
    if (searchBy.facility) {
      setShowResultsBy({
        user: true,
      })
    }
  }, [searchBy])

  return (
    <Box>
      <Row columns={[6, 8, 10, 10]}>
        <Column
          start={[1, 1, 1, 1]}
          width={[3, 3, 3, 3]}
          sx={{ position: 'sticky', top: 100, height: 500 }}
        >
          <Search
            data={data}
            search={search}
            searchBy={searchBy}
            setSearch={setSearch}
            setSearchId={setSearchId}
          />
          <Divider sx={{ mb: [5] }} />
          <Group spacing='md'>
            <Box>
              <Box sx={sx.label}>Search by</Box>
              <Filter
                values={searchBy}
                setValues={setSearchBy}
                colors={colors}
              />
            </Box>
            <Box>
              <Box sx={sx.label}>Show results by</Box>
              <Filter
                values={showResultsBy}
                setValues={setShowResultsBy}
                colors={colors}
              />
            </Box>
            <Box>
              <Box sx={sx.label}>Reporting periods</Box>
              <Filter
                values={reportingPeriods}
                setValues={setReportingPeriods}
                multiSelect
              />
            </Box>
          </Group>
        </Column>
        <Column start={[5, 4, 5, 5]} width={[5, 5, 5, 5]}>
          <Results
            data={data}
            search={search}
            searchId={searchId}
            searchBy={searchBy}
            showResultsBy={showResultsBy}
            reportingPeriods={reportingPeriods}
            setSearch={setSearch}
            setSearchBy={setSearchBy}
          />
        </Column>
      </Row>
    </Box>
  )
}

export default Main
