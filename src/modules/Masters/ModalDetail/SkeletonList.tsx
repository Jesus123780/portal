import React from 'react'
import Skeleton from '@mui/material/Skeleton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Box } from '@mui/material'

export const SkeletonList = ({ wordCount = 5 }) => {
  return (
    <List>
      {Array.from(new Array(wordCount)).map((_, index) => (
        <ListItem key={index}>
          <Box>
            <Skeleton variant="text" width={210} />
            <Skeleton variant="text" width={410} />
            <Skeleton variant="text" width={110} />
          </Box>
        </ListItem>
      ))}
    </List>
  )
}
