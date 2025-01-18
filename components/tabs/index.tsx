'use client'

import { Component } from './component'
import { TABS } from '@/data/icon-tabs'

export function Tabs() {
  return (
    // {show && ()}
    <div className='relative flex flex-1 items-center justify-center overflow-hidden'>
      <div className='pointer-events-none absolute left-0 z-20 h-full w-8 bg-gradient-to-r from-background to-transparent' />
      <div className='pointer-events-none absolute right-0 z-20 h-full w-8 bg-gradient-to-l from-background to-transparent' />
      <div className='scrollbar-none w-full overflow-x-auto'>
        <Component tabs={TABS} />
      </div>
    </div>
  )
}
