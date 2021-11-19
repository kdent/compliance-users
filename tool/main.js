import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Group, Input } from '@carbonplan/components'
import Results from './results'

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
  timePeriods: {
    '2013-2014': true,
    '2015-2017': false,
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
  const [search, setSearch] = useState('')
  const [searchBy, setSearchBy] = useState(init.searchBy)
  const [showResultsBy, setShowResultsBy] = useState(init.showResultsBy)
  const [timePeriods, setTimePeriods] = useState(init.timePeriods)

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
              <Box sx={sx.label}>Time periods</Box>
              <Filter values={timePeriods} setValues={setTimePeriods} />
            </Box>
          </Group>
        </Column>
        <Column start={5} width={5}>
          <Box sx={sx.heading}>Results</Box>
          <Results
            search={search}
            searchBy={searchBy}
            showResultsBy={showResultsBy}
            timePeriods={timePeriods}
          />
        </Column>
      </Row>
    </Box>
  )
}

export default Main
