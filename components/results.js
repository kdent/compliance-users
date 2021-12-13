import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Badge, FadeIn } from '@carbonplan/components'
import { Left, Down } from '@carbonplan/icons'
import { sx } from './styles'
import { Entry, Group, Label, Value } from './entry'
import useStore from './store'

const addType = (data, type) => {
  return data.map((d) => Object.assign({}, d, { type: type }))
}

const Results = () => {
  const data = useStore((state) => state.data)
  const filtered = useStore((state) => state.filtered)
  const setFiltered = useStore((state) => state.setFiltered)
  const search = useStore((state) => state.search)
  const searchId = useStore((state) => state.searchId)
  const searchBy = useStore((state) => state.searchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const reportingPeriods = useStore((state) => state.reportingPeriods)

  useEffect(() => {
    if (!data) return

    if (!searchId) {
      setFiltered([])
      return
    }

    const reportingPeriodsActive = Object.keys(reportingPeriods).filter(
      (d) => reportingPeriods[d]
    )

    if (searchBy.project) {
      if (!data.arb_to_users[searchId]) {
        return
      }
      if (showResultsBy.user) {
        setFiltered(
          addType(
            data.arb_to_users[searchId].filter((d) =>
              reportingPeriodsActive.includes(d.reporting_period)
            ),
            'user'
          )
        )
      } else if (showResultsBy.facility) {
        const users = data.arb_to_users[searchId]
          .filter((d) => reportingPeriodsActive.includes(d.reporting_period))
          .map((d) => d.user_id)
        let facilities = []
        reportingPeriodsActive.forEach((d) => {
          facilities.push(
            users.map((u) => {
              if (data.user_to_facilities[u][d])
                return {
                  user_id: u,
                  reporting_period: d,
                  facility_ids: data.user_to_facilities[u][d],
                }
            })
          )
        })
        facilities = facilities.flat().filter((d) => d)
        facilities = facilities.map((d) => {
          return d.facility_ids.map((id) => {
            if (data.facility_id_to_info[id]) {
              return Object.assign(
                {},
                {
                  user_id: d.user_id,
                  reporting_period: d.reporting_period,
                  facility_id: id,
                },
                data.facility_id_to_info[id][d.reporting_period]
              )
            }
          })
        })
        facilities = facilities.flat().filter((d) => d)
        setFiltered(addType(facilities, 'facility'))
      }
    } else if (searchBy.user) {
      if (!data.user_to_arbs[searchId]) {
        return
      }
      if (showResultsBy.project) {
        setFiltered(
          addType(
            data.user_to_arbs[searchId].filter((d) =>
              reportingPeriodsActive.includes(d.reporting_period)
            ),
            'project'
          )
        )
      } else if (showResultsBy.facility) {
        let facilities = []
        reportingPeriodsActive.forEach((d) => {
          if (data.user_to_facilities[searchId][d]) {
            data.user_to_facilities[searchId][d].map((id) => {
              facilities.push(
                Object.assign(
                  {},
                  {
                    user_id: searchId,
                    reporting_period: d,
                    facility_id: id,
                  },
                  data.facility_id_to_info[id][d]
                )
              )
            })
          }
        })
        setFiltered(addType(facilities, 'facility'))
      }
    } else if (searchBy.facility) {
      if (!data.facility_to_user[searchId]) {
        return
      }
      if (showResultsBy.user) {
        let users = []
        reportingPeriodsActive.forEach((d) => {
          if (data.facility_to_user[searchId][d]) {
            data.facility_to_user[searchId][d].map((id) => {
              users.push(
                Object.assign(
                  {},
                  {
                    user_id: id,
                    reporting_period: d,
                  }
                )
              )
            })
          }
        })
        setFiltered(addType(users, 'user'))
      } else if (showResultsBy.project) {
        let users = []
        reportingPeriodsActive.forEach((d) => {
          if (data.facility_to_user[searchId][d]) {
            data.facility_to_user[searchId][d].map((id) => {
              users.push(
                Object.assign(
                  {},
                  {
                    user_id: id,
                    reporting_period: d,
                  }
                )
              )
            })
          }
        })
        let projects = []
        users.forEach((d) => {
          if (data.user_to_arbs[d.user_id]) {
            projects.push(data.user_to_arbs[d.user_id])
          }
        })
        projects = projects
          .flat()
          .filter((d) => reportingPeriodsActive.includes(d.reporting_period))
        setFiltered(addType(projects, 'project'))
      } else {
        setFiltered([])
      }
    } else {
      setFiltered([])
    }
  }, [searchId, searchBy, showResultsBy, reportingPeriods, data])

  return (
    <>
      <Box sx={sx.heading}>
        Results<Badge sx={{ float: 'right', mt: [3] }}>{filtered.length}</Badge>
      </Box>
      <Box>
        <Divider sx={{ mb: ['12px'], mt: [3], pt: '3px' }} />
        {searchId && filtered.length > 0 && (
          <>
            {searchBy.project && data.arb_to_oprs[searchId] && (
              <Box>
                <Group>
                  <Label>Project ID:</Label>
                  <Value color='green'>
                    {searchId} / {data.arb_to_oprs[searchId]}
                  </Value>
                </Group>
                <Group>
                  <Label>Project Name:</Label>
                  <Value>
                    {
                      data.opr_to_project_info[data.arb_to_oprs[searchId]]
                        .project_name
                    }
                  </Value>
                </Group>
                <Group>
                  <Label>Type:</Label>
                  <Value>
                    {
                      data.opr_to_project_info[data.arb_to_oprs[searchId]]
                        .project_type
                    }
                  </Value>
                </Group>
              </Box>
            )}
            {searchBy.user && data.user_id_to_name[searchId] && (
              <>
                <Group>
                  <Label>User ID:</Label>
                  <Value color='blue'>{searchId}</Value>
                </Group>
                <Group>
                  <Label>User Name:</Label>
                  <Value>{data.user_id_to_name[searchId]}</Value>
                </Group>
              </>
            )}
            {searchBy.facility && data.facility_id_to_info[searchId] && (
              <>
                <Group>
                  <Label>Facility ID:</Label>
                  <Value color='pink'>{searchId}</Value>
                </Group>
                <Group>
                  <Label>Facility Name:</Label>
                  <Value>
                    {
                      data.facility_id_to_info[searchId][
                        Object.keys(data.facility_id_to_info[searchId])[0]
                      ].facility_name
                    }
                  </Value>
                </Group>
                <Group>
                  <Label>Sector:</Label>
                  <Value>
                    {
                      data.facility_id_to_info[searchId][
                        Object.keys(data.facility_id_to_info[searchId])[0]
                      ].sector
                    }
                  </Value>
                </Group>
              </>
            )}
            {filtered.map((d, i) => {
              return (
                <Entry
                  key={i}
                  d={d}
                  data={data}
                  last={i === filtered.length - 1}
                />
              )
            })}
          </>
        )}
        {data && search === '' && filtered.length === 0 && (
          <>
            <Box>
              <Left sx={{ mt: ['-4px'], color: 'secondary', width: 14 }} />
            </Box>
            <Box sx={{ mt: [1], fontSize: [2], width: '75%' }}>
              Please enter a search term on the left.
            </Box>
            <Divider sx={{ mt: ['18px'] }} />
          </>
        )}
        {data && search !== '' && filtered.length === 0 && (
          <>
            <Box>
              <Left sx={{ mt: ['-4px'], color: 'secondary', width: 14 }} />
            </Box>
            <Box sx={{ mt: [1], fontSize: [2], width: '75%' }}>
              Please finish entering a unique search term or try changing the
              search settings.
            </Box>
            <Divider sx={{ mt: ['18px'] }} />
          </>
        )}
        {!data && (
          <>
            <Box>
              <Down sx={{ mt: ['-4px'], color: 'secondary', width: 14 }} />
            </Box>
            <Box sx={{ mt: [1], fontSize: [2], width: '75%' }}>
              Loading data...
            </Box>
            <Divider sx={{ mt: ['18px'] }} />
          </>
        )}
      </Box>
    </>
  )
}

export default Results
