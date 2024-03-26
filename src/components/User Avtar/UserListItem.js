import React from 'react'

const UserListItem = ({ user, handleFuncation }) => {


    return (
        <div onClick={handleFuncation}>
            <div className="main_box cursor-pointer bg-[#797979] hover:bg-orange-500 w-full flex items-center text-white px-3 py-2 mb-2 rounded-lg" >
                <div className="avtar flex gap-3">

                    <div className="img_wrapper ">
                        <img className='ring-2   w-[50px] h-[50px]  ring-[#fff] p-1 rounded-full ' src={user.pic} alt="" />
                    </div>
                    <div className="info_wrapper">
                        <div className='font-bold capitalize'>{user.name}</div>
                        <div><span className='font-semibold'>Email: </span>{user.email}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserListItem