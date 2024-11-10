import BrowseStyle from '@/components/custom/sections/body/browse-styles'
import React from 'react'
import FilterHeader from '@/components/custom/sections/sub-header/filter-header';

//Redo: start from the pre-made template, then allow user to edit directly based on thisz
export default function StylesIndex() {
  return (
    <main>
      <FilterHeader />
      <BrowseStyle />
    </main>
  )
}
