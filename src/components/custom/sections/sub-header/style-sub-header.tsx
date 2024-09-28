import React from 'react'
import RatingCard from '../../cards/rating-cards'
import { Bookmark, ExternalLink, Share } from 'lucide-react'
import Link from 'next/link'

const StyleSubHeader = () => {
  return (
    <header className='flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0'>
        <RatingCard score={5.00} maxScore={5.00}/>

        <div className='flex gap-8 items-center'>
            <Link href={'/'}><Bookmark size={20}/></Link> {/* Save function */}
            <Link href={'/'}><ExternalLink size={20}/></Link> {/* Open in editor */}
            <Link href={'/'}><Share size={20}/></Link> {/* Share */}
        </div>
    </header>
  )
}

export default StyleSubHeader