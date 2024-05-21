import { useState } from 'react'
import useEditor from './use-editor'
import { EditorView } from '..'
import { styled } from '@mui/material/styles'

const List = styled('ul')(({ theme }) => ({
  margin: 0
}))

export default function Editor() {
  const { openFiles, setOpenFiles } = useEditor()

  return (
    <List>
      {openFiles.length ? (
        openFiles.map((path) => (
          <li key={path}>
            <EditorView path={path} />
          </li>
        ))
      ) : (
        undefined
      )}
    </List>
  )
}