import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Group, Input, Tag } from '@carbonplan/components'
import { sx, colors } from './styles'
import Results from './results'
import Search from './search'
import useStore from './store'

const Main = ({ children }) => {
  const { push } = useRouter()

  const searchBy = useStore((state) => state.searchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const reportingPeriods = useStore((state) => state.reportingPeriods)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)
  const setReportingPeriods = useStore((state) => state.setReportingPeriods)

  return (
    <Box>
      <Row columns={[6, 8, 10, 10]}>
        <Column
          start={[1, 1, 1, 1]}
          width={[3, 3, 3, 3]}
          sx={{ position: 'sticky', top: 100, height: 500 }}
        >
          <Search />
          <Divider sx={{ mb: [5] }} />
          <Group spacing='md'>
            <Box>
              <Box sx={sx.label}>Search by</Box>
              <Tag
                value={searchBy.project}
                sx={{ ...sx.tag, color: colors['project'] }}
                onClick={() => {
                  push('/project', null, { scroll: false })
                }}
              >
                Project
              </Tag>
              <Tag
                value={searchBy.user}
                sx={{ ...sx.tag, color: colors['user'] }}
                onClick={() => {
                  push('/user', null, { scroll: false })
                }}
              >
                User
              </Tag>
              <Tag
                value={searchBy.facility}
                sx={{ ...sx.tag, color: colors['facility'] }}
                onClick={() => {
                  push('/facility', null, { scroll: false })
                }}
              >
                Facility
              </Tag>
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
          {children}
        </Column>
      </Row>
    </Box>
  )
}

export default Main
