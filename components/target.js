import { Box } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'
import { sx } from './styles'
import useStore from './store'

export const Group = ({ children }) => {
  return <Row columns={3}>{children}</Row>
}

export const Label = ({ children, color }) => {
  return (
    <Column start={1} width={1} dr={1}>
      <Box sx={sx.label}>{children}</Box>
    </Column>
  )
}

export const Value = ({ children, color }) => {
  return (
    <Column start={2} width={2}>
      <Box sx={{ ...sx.value, color: color }}>{children}</Box>
    </Column>
  )
}

const Target = () => {
  const data = useStore((state) => state.data)
  const searchId = useStore((state) => state.searchId)

  return (
    <Box>
      {searchId && data.arb_to_oprs[searchId] && (
        <Box>
          <Group>
            <Label>ID:</Label>
            <Value color='green'>
              {searchId} / {data.arb_to_oprs[searchId]}
            </Value>
          </Group>
          <Group>
            <Label>Name:</Label>
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
      {searchId && data.user_id_to_name[searchId] && (
        <>
          <Group>
            <Label>ID:</Label>
            <Value color='blue'>{searchId}</Value>
          </Group>
          <Group>
            <Label>Name:</Label>
            <Value>{data.user_id_to_name[searchId]}</Value>
          </Group>
        </>
      )}
      {searchId && data.facility_id_to_info[searchId] && (
        <>
          <Group>
            <Label>ID:</Label>
            <Value color='pink'>{searchId}</Value>
          </Group>
          <Group>
            <Label>Name:</Label>
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
    </Box>
  )
}

export default Target
