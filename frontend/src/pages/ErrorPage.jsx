import React from 'react'
import images from '../assets/images'
import { NavLink } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div >
        <div className="min-h-[85vh] flex justify-center flex-col items-center">
          <img
            src={images.Page404}
            alt="error"
            className="mb-5 h-[100%]  object-cover w-[70%] sm:w-[60%] md:w-[40%] xl:w-[60%]"
          />
          <div className=" flex justify-center items-center flex-col">
            <h2 className="mb-3">PAGE NOT FOUND</h2>
            <NavLink
              to="/"
              className="btn btn-primary text-primary md:text-lg font-medium"
            >
              {" "}
              Back To Home Page{" "}
            </NavLink>
          </div>
        </div>
      </div>
  )
}

export default ErrorPage