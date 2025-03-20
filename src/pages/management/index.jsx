import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AnalyticsPage from './analytics'
import ProductsPage from './products'
import Navbar from '../components/navbar'

function ManagementPage() {

  return (
    <>
     <div>
      <Navbar />
        <Routes>
            <Route path='/analytics' element={<AnalyticsPage/>}/>
            <Route path='/products' element={<ProductsPage/>}/>
        </Routes>
     </div>
    </>
  )
}

export default ManagementPage
