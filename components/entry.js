import { useRouter } from 'next/router'
import { Box, Divider } from 'theme-ui'
import { Button, Row, Column } from '@carbonplan/components'
import { RotatingArrow } from '@carbonplan/icons'
import useStore from './store'

export const Group = ({ children }) => {
  return <Row columns={5}>{children}</Row>
}

export const Label = ({ children, color }) => {
  return (
    <Column start={1} width={2}>
      <Box
        sx={{
          color: color || 'secondary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          fontSize: [1, 1, 1, 2],
        }}
      >
        {children}
      </Box>
    </Column>
  )
}

export const Value = ({ children, color }) => {
  return (
    <Column start={3} width={3}>
      <Box
        sx={{
          color: color || 'primary',
          fontFamily: 'mono',
          letterSpacing: 'mono',
          textTransform: 'uppercase',
          fontSize: [1, 1, 1, 2],
        }}
      >
        {children}
      </Box>
    </Column>
  )
}

const CrossLink = ({ href, color, children }) => {
  return (
    <Button
      href={href}
      suffix={
        <RotatingArrow
          sx={{
            width: ['14px', '14px', '14px', '16px'],
            cursor: 'pointer',
            top: ['-1px'],
            position: 'relative',
          }}
        />
      }
      sx={{
        color: color || 'primary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        textTransform: 'uppercase',
        fontSize: [1, 1, 1, 2],
        position: 'relative',
        bottom: ['-1px'],
        cursor: 'pointer',
      }}
    >
      {children}
    </Button>
  )
}

export const Entry = ({ data, d, last }) => {
  const { push } = useRouter()

  return (
    <Box>
      <Divider sx={{ mb: ['12px'], mt: [3], pt: ['2px'] }} />
      {d.type === 'user' && (
        <>
          <Group>
            <Label>User ID:</Label>
            <Value color='blue'>
              <CrossLink color='blue' href={`/user/${d.user_id}`}>
                {d.user_id}
              </CrossLink>
            </Value>
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
            <Label>Project ID:</Label>
            <Value>
              <CrossLink color='green' href={`/project/${d.arb_id}`}>
                {data.arb_to_oprs[d.arb_id]}
              </CrossLink>
            </Value>
          </Group>
          <Group>
            <Label>Project Name:</Label>
            <Value>
              {data.arb_to_oprs[d.arb_id] &&
                data.opr_to_project_info[data.arb_to_oprs[d.arb_id]]
                  .project_name}
            </Value>
          </Group>
          <Group>
            <Label>Type:</Label>
            <Value>
              {data.arb_to_oprs[d.arb_id] &&
                data.opr_to_project_info[data.arb_to_oprs[d.arb_id]]
                  .project_type}
            </Value>
          </Group>
          <Group>
            <Label>Location:</Label>
            <Value>
              {data.arb_to_oprs[d.arb_id] &&
                data.opr_to_project_info[data.arb_to_oprs[d.arb_id]].state}
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
            <Value>
              <CrossLink color='pink' href={`/facility/${d.facility_id}`}>
                {d.facility_id}
              </CrossLink>
            </Value>
          </Group>
          <Group>
            <Label>Facility Name:</Label>
            <Value>{d.facility_name}</Value>
          </Group>
          <Group>
            <Label>Sector:</Label>
            <Value>{d.sector}</Value>
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
        </>
      )}
      {last && <Divider sx={{ mt: [3] }} />}
    </Box>
  )
}
