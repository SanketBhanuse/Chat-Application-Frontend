import React from 'react'
const Profile = ({ user }) => {


    return (
        <div className='profileContent_wrapper flex md:flex-row flex-col gap-5 items-center'>
            <div className="img_wrapper ">
                <img src={user.pic} alt="" className='w-[100px] h-auto rounded-full ring-2 ring-[#fea42d] p-1' />
            </div>
            <div className="info_wrapper md:text-left  text-center ">

                <div className='font-extrabold'>{user.name}</div>
                <div className='text-orange-500 font-bold'>{user.email}</div>
            </div>
        </div>
    )
}

export default Profile