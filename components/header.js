import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider, IconButton } from 'theme-ui'
import { Row, Column, Filter, Badge } from '@carbonplan/components'
import { Search as SearchIcon, X } from '@carbonplan/icons'
import { sx, colors } from './styles'
import Results from './results'
import Search from './search'
import useStore from './use-store'

const Header = ({ children }) => {
  const { push } = useRouter()

  const setSearch = useStore((state) => state.setSearch)
  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const filtered = useStore((state) => state.filtered)

  return (
    <Box>
      <Row columns={[6, 8, 10, 10]} sx={{ mb: [5] }}>
        <Column start={[1, 1, 1, 1]} width={[6, 9, 9, 9]}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: ['wrap', 'nowrap', 'nowrap', 'nowrap'],
            }}
          >
            <SearchIcon
              sx={{
                mr: [3],
                width: 18,
                color: 'secondary',
                strokeWidth: 1.5,
                mt: ['2px'],
                flexShrink: 0,
              }}
            />
            <Filter
              values={searchBy}
              setValues={setSearchBy}
              colors={colors}
              sx={{ flexShrink: 0 }}
            />
            <Box
              sx={{
                display: ['unset', 'none', 'none', 'none'],
                flexBasis: '100%',
                height: 0,
              }}
            />
            <Search />
            <IconButton
              sx={{
                cursor: 'pointer',
                p: [0],
                mt: ['15px', '3px', '3px', '4px'],
                mx: [2],
                width: 18,
                height: 18,
                flexShrink: 0,
              }}
            >
              <X
                sx={{
                  strokeWidth: 1.5,
                  color: 'secondary',
                  transition: 'stroke 0.15s',
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                      stroke: 'primary',
                    },
                  },
                }}
                onClick={() => {
                  setSearch('')
                  push('/research/compliance-users', null, { scroll: false })
                }}
              />
            </IconButton>
            <Badge sx={{ mt: ['12px', 0, 0, 0], ml: ['2px'], flexShrink: 0 }}>
              {filtered.length}
            </Badge>
          </Box>
        </Column>
      </Row>
      {children}
    </Box>
  )
}

export default Header
