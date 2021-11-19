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
          width: '200px',
          color: 'secondary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          display: 'inline-block',
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
          display: 'inline-block',
          fontSize: [1],
        }}
      >
        {children}
      </Box>
    </Column>
  )
}

const Entry = ({ data, d, showResultsBy }) => {
  return (
    <Box>
      <Divider sx={{ mb: ['12px'], mt: [3] }} />
      {showResultsBy.user && (
        <>
          <Group>
            <Label>User:</Label>
            <Value>{data.user_id_to_name[d.user_id]}</Value>
          </Group>
          <Group>
            <Label>ID:</Label>
            <Value>{d.user_id}</Value>
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
      {showResultsBy.project && (
        <>
          <Group>
            <Label>Project:</Label>
            <Value>
              {
                data.opr_to_project_info[data.arb_to_oprs[d.arb_id][0]]
                  .project_name
              }
            </Value>
          </Group>
          <Group>
            <Label>ID:</Label>
            <Value>{d.arb_id}</Value>
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
    </Box>
  )
}

export default Entry
