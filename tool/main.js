import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Group, Input } from '@carbonplan/components'
import Results from './results'

const url =
  'https://raw.githubusercontent.com/carbonplan/compliance-users/main/data/outputs/user_data_2013_2019.json'

// const url = 'http://localhost:8080/user_data_2013_2019.json'

const sx = {
  heading: {
    fontSize: [5],
    fontFamily: 'heading',
    letterSpacing: 'heading',
    mb: [3],
  },
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    fontSize: [1],
    mb: [1],
    color: 'secondary',
    textTransform: 'uppercase',
  },
}

const init = {
  searchBy: {
    project: true,
    user: false,
    facility: false,
  },
  showResultsBy: {
    user: true,
    facility: false,
  },
  reportingPeriods: {
    '2013-2014': true,
    '2015-2017': true,
    2018: false,
    2019: false,
  },
}

const colors = {
  project: 'green',
  user: 'blue',
  facility: 'pink',
}

const Main = () => {
  const [data, setData] = useState()
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState([])
  const [searchBy, setSearchBy] = useState(init.searchBy)
  const [showResultsBy, setShowResultsBy] = useState(init.showResultsBy)
  const [reportingPeriods, setReportingPeriods] = useState(
    init.reportingPeriods
  )

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data)
      })
  }, [])

  useEffect(() => {
    if (searchBy.project) {
      setShowResultsBy({
        user: showResultsBy.facility ? false : true,
        facility: showResultsBy.facility ? true : false,
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
        user: showResultsBy.project ? false : true,
        project: showResultsBy.project ? true : false,
      })
    }
  }, [searchBy])

  useEffect(() => {
    if (!data) return
    if (searchBy.project) {
      if (search !== '') {
        let matches = Object.keys(data.opr_to_arbs)
          .concat(Object.keys(data.arb_to_oprs))
          .filter((d) => d.toLowerCase().includes(search.toLowerCase()))
        if (matches.length > 1) {
          setPreview(matches)
        } else if (matches.length === 1) {
          setPreview([])
        } else {
          setPreview(['no matching projects'])
        }
      } else {
        setPreview([])
      }
    }
  }, [data, search, searchBy])

  console.log(data)

  return (
    <Box>
      <Row columns={[6, 8, 10, 10]}>
        <Column
          start={1}
          width={3}
          sx={{ position: 'sticky', top: 100, height: 400 }}
        >
          <Box sx={sx.heading}>Search</Box>
          <Divider />
          <Input
            placeholder={'enter search term'}
            onChange={(e) => {
              setSearch(e.currentTarget.value)
            }}
            value={search}
            sx={{
              borderStyle: 'none',
              fontFamily: 'mono',
              fontSize: [1],
              width: '100%',
              py: [2],
              letterSpacing: 'mono',
            }}
          />
          {preview.length > 0 && (
            <Box sx={{ mb: [3] }}>
              {preview.slice(0, 5).map((d) => {
                return (
                  <Box
                    sx={{
                      color: 'secondary',
                      fontSize: [1],
                      fontFamily: 'mono',
                      letterSpacing: 'mono',
                    }}
                  >
                    {d}
                  </Box>
                )
              })}
              {preview.length > 5 && (
                <Box
                  sx={{
                    color: 'secondary',
                    fontSize: [1],
                    fontFamily: 'mono',
                    letterSpacing: 'mono',
                  }}
                >
                  <br />+{preview.length - 5} more
                </Box>
              )}
            </Box>
          )}
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
        <Column start={5} width={5}>
          <Box sx={sx.heading}>Results</Box>
          <Results
            data={data}
            search={search}
            searchBy={searchBy}
            showResultsBy={showResultsBy}
            reportingPeriods={reportingPeriods}
          />
        </Column>
      </Row>
    </Box>
  )
}

export default Main
