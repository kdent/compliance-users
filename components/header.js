import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Badge } from '@carbonplan/components'
import { Search as SearchIcon, X } from '@carbonplan/icons'
import { sx, colors } from './styles'
import Results from './results'
import Search from './search'
import useStore from './use-store'

const Header = ({ children }) => {
  const { push } = useRouter()

  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const filtered = useStore((state) => state.filtered)

  return (
    <Box>
      <Row columns={[6, 8, 10, 10]} sx={{ mb: [5] }}>
        <Column start={[1, 1, 1, 1]} width={[9, 9, 9, 9]}>
          <Box sx={{ display: 'flex' }}>
            <SearchIcon
              sx={{
                mr: [3],
                width: 18,
                color: 'secondary',
                strokeWidth: 1.5,
                mt: ['2px'],
              }}
            />
            <Filter
              values={searchBy}
              setValues={setSearchBy}
              colors={colors}
              sx={{ flexShrink: 0 }}
            />
            <Search />

            <X
              sx={{
                cursor: 'pointer',
                mx: [2],
                strokeWidth: 1.5,
                color: 'secondary',
                width: 18,
                transition: 'stroke 0.15s',
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': {
                    stroke: 'primary',
                  },
                },
              }}
              onClick={() => push('/', null, { scroll: false })}
            />
            <Badge sx={{ ml: ['2px'] }}>{filtered.length}</Badge>
          </Box>
        </Column>
      </Row>
      {children}
    </Box>
  )
}

export default Header
