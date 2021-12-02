import { Box, Divider } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'

const Group = ({ children }) => {
  return <Row columns={5}>{children}</Row>
}

const Label = ({ children }) => {
  return (
    <Column start={1} width={2}>
      <Box
        sx={{
          color: 'secondary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          fontSize: [1],
        }}
      >
        {children}
      </Box>
    </Column>
  )
}

const Value = ({ children }) => {
  return (
    <Column start={3} width={3}>
      <Box
        sx={{
          color: 'primary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          fontSize: [1],
        }}
      >
        {children}
      </Box>
    </Column>
  )
}

const Entry = ({ data, d, last }) => {
  return (
    <Box>
      <Divider sx={{ mb: ['12px'], mt: [3], pt: ['2px'] }} />
      {d.type === 'user' && (
        <>
          <Group>
            <Label>User ID:</Label>
            <Value>{d.user_id}</Value>
          </Group>
          <Group>
            <Label>User Name:</Label>
            <Value>{data.user_id_to_name[d.user_id]}</Value>
          </Group>
          <Group>
            <Label>Reporting period:</Label>
            <Value>{d.reporting_period}</Value>
          </Group>
          {d.quantity && (
            <Group>
              <Label>Quantity:</Label>
              <Value>{d.quantity}</Value>
            </Group>
          )}
        </>
      )}
      {d.type === 'project' && (
        <>
          <Group>
            <Label>Project Name:</Label>
            <Value>
              {data.arb_to_oprs[d.arb_id] &&
                data.opr_to_project_info[data.arb_to_oprs[d.arb_id][0]]
                  .project_name}
            </Value>
          </Group>
          <Group>
            <Label>Project ID:</Label>
            <Value>
              {d.arb_id} / {data.arb_to_oprs[d.arb_id][0]}
            </Value>
          </Group>
          <Group>
            <Label>Reporting period:</Label>
            <Value>{d.reporting_period}</Value>
          </Group>
          <Group>
            <Label>Quantity:</Label>
            <Value>{d.quantity}</Value>
          </Group>
        </>
      )}
      {d.type === 'facility' && (
        <>
          <Group>
            <Label>Facility ID:</Label>
            <Value>{d.facility_id}</Value>
          </Group>
          <Group>
            <Label>Facility Name:</Label>
            <Value>{d.facility_name}</Value>
          </Group>
          <Group>
            <Label>Location:</Label>
            <Value>
              {d.city}, {d.state}
            </Value>
          </Group>
          <Group>
            <Label>Reporting period:</Label>
            <Value>{d.reporting_period}</Value>
          </Group>
          <Group>
            <Label>User ID:</Label>
            <Value>{d.user_id}</Value>
          </Group>
          <Group>
            <Label>User Name:</Label>
            <Value>{data.user_id_to_name[d.user_id]}</Value>
          </Group>
        </>
      )}
      {last && <Divider sx={{ mt: [3] }} />}
    </Box>
  )
}

export default Entry
