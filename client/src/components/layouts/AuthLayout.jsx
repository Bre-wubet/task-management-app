import React from 'react'
import Ui_img from '../../assets/images/ui_image.jpg'


function AuthLayout({ children }) {
  return (
    <div className='flex'>
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-gray-900'>Task Manager</h2>
        {children}
      </div>

        <div className='hidden md:flex h-screen md:w-[40vw] h-screen items-center justify-center bg-blue-100 bg-[url("../../assets/images/ui_image.jpg")] bg-cover bg-no-repeat bg-center overflow-hidden p-8'>
          <img src={Ui_img} alt="UI" className='w-64 lg:w-[90%]' />
        </div>
    </div>
  )
}

export default AuthLayout