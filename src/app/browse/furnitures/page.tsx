import BrowseFurnitures from '@/components/custom/sections/body/browse-furnitures'
import React from 'react'
import Header from '@/components/custom/sections/header';
import Footer from "@/components/custom/sections/footer";

export default function FurnituresIndex() {
  return (
    <main>
      <Header/>
      <BrowseFurnitures/>
      <Footer/>
    </main>
  )
}