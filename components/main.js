import { useEffect, useRef, useCallback } from 'react'
import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Group } from '@carbonplan/components'
import { sx, colors } from './styles'
import Target from './target'
import Results from './results'
import Header from './header'
import useStore from './store'

const Main = () => {
  const data = useStore((state) => state.data)
  const searchId = useStore((state) => state.searchId)
  const searchBy = useStore((state) => state.searchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const reportingPeriods = useStore((state) => state.reportingPeriods)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)
  const setReportingPeriods = useStore((state) => state.setReportingPeriods)

  return (
    <>
      <Box>
        {data && searchId && (
          <Box>
            <Row columns={[6, 8, 10, 10]}>
              <Column
                start={[1, 1, 1, 1]}
                width={[3, 3, 3, 3]}
                sx={{ position: 'sticky', top: 84, height: 300 }}
              >
                <Group spacing='md'>
                  <Box>
                    <Divider sx={{ mb: [3] }} />
                    <Target />
                    <Divider sx={{ mt: [3] }} />
                  </Box>
                  <Box>
                    <Box sx={sx.label}>Show results by</Box>
                    {data.user_id_to_name[searchId] && (
                      <Filter
                        values={showResultsBy}
                        setValues={setShowResultsBy}
                        colors={colors}
                      />
                    )}
                    {!data.user_id_to_name[searchId] && (
                      <Filter
                        values={{ user: true }}
                        setValues={() => {}}
                        colors={colors}
                      />
                    )}
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
              <Column id='right' start={[5, 4, 5, 5]} width={[5, 5, 5, 5]}>
                <Divider sx={{ mb: [3] }} />
                <Results />
                <Divider sx={{ mt: [3] }} />
              </Column>
            </Row>
          </Box>
        )}
      </Box>
      {!data && <Box sx={sx.label}>Loading data...</Box>}
    </>
  )
}

export default Main
