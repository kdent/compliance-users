import { Box, Themed } from 'theme-ui'
import { Row, Column } from '@carbonplan/components'
import About from './about.md'
import Methods from './methods.md'

const Info = () => {
  return (
    <Row sx={{ mt: [7] }} columns={[6, 8, 10, 10]}>
      <Column start={[1, 1, 1, 1]} width={[6, 4, 4, 4]}>
        <About />
      </Column>
      <Column start={[1, 5, 5, 5]} width={[6, 5, 5, 5]}>
        <Methods />
      </Column>
    </Row>
  )
}

export default Info
