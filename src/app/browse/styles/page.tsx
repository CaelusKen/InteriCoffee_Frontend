import BrowseStyle from '@/components/custom/sections/body/browse-styles'
import React from 'react'
import Header from '@/components/custom/sections/header';
import Footer from "@/components/custom/sections/footer";
import FilterHeader from '@/components/custom/sections/sub-header/filter-header';

export default function StylesIndex() {
  return (
    <main>
      <Header/>
      <FilterHeader />
      <BrowseStyle />
      <Footer/>
    </main>
  )
}
