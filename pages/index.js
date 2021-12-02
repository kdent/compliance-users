import { Box, Themed } from 'theme-ui'
import { default as NextLink } from 'next/link'
import { Link } from '@carbonplan/components'
import Tool from '../components/tool'
import Main from '../tool/main'

const Index = () => {
  const meta = {
    id: 'compliance-users',
    title: 'Compliance users',
    color: 'pink',
    card: 'compliance-users',
    quickLook: 'Tracking the users of compliance offsets',
  }

  const description = (
    <span>
      In the California cap-and-trade program, polluting entities use carbon
      offsets for compliance. Who are they? This tool lets you search for an
      offset project, user, or facility, and see the linked results. Read more
      in our{' '}
      <Link href='https://carbonplan.org/blog/compliance-offset-users'>
        blog post
      </Link>{' '}
      or checkout the{' '}
      <Link href='https://github.com/carbonplan/compliance-users'>
        GitHub repository
      </Link>
      .
    </span>
  )

  return (
    <Tool
      meta={meta}
      title={meta.title}
      description={description}
      contentWidth={[6, 8, 10, 10]}
      descriptionWidth={[6, 7, 7, 7]}
      quickLookStart={9}
    >
      <Main />
    </Tool>
  )
}

export default Index
