'use client'
import React, { useState } from 'react'
import LoaderPage from '@/components/loader/page'
const page = () => {
  const [showLoader, setShowLoader] = useState(false);
  return (
    <div className='h-screen w-screen bg-green-900'>
      <button onClick={() => setShowLoader(true)}>Show Loader</button>
      {showLoader && <LoaderPage />}
    </div>
  )
}

export default page
