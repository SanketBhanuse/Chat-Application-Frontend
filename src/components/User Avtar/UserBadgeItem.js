import React from 'react';
import { IoIosCloseCircle } from "react-icons/io";

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <div className="flex gap-1 items-center text-md bg-orange-500 text-white w-fit py-0 px-2 rounded-lg" >
            {user.name} <IoIosCloseCircle className='cursor-pointer' onClick={handleFunction} />

        </div>
    )
}

export default UserBadgeItem