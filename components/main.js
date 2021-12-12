import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Group, Input } from '@carbonplan/components'
import { sx, colors } from './styles'
import Results from './results'
import Search from './search'
import useStore from './store'

const Main = ({ data, searchId }) => {
  const [search, setSearch] = useState('')

  const {
    searchBy,
    showResultsBy,
    reportingPeriods,
    setSearchBy,
    setShowResultsBy,
    setReportingPeriods,
  } = useStore()

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
