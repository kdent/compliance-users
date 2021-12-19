import { Box, Themed } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'
import About from './about.md'
import Methods from './methods.md'

const Info = () => {
  return (
    <Row sx={{ mt: [9] }} columns={[6, 8, 10, 10]}>
      <Column start={1} width={4}>
        <About />
      </Column>
      <Column start={5} width={5}>
        <Methods />
      </Column>
    </Row>
  )
}

export default Info
