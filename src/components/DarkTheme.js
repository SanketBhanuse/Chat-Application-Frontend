import React, { useState } from 'react'
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { ChatState } from '../Context/ChatProvider';

const DarkTheme = () => {
    // const [dark, setDark] = useState(false);
    const { darkTheme, setDarkTheme } = ChatState();

    const setTheme = () => {
        setDarkTheme(!darkTheme)
    }

    return (
        <div className={`p-1 border-2 border-[#ffba71] rounded-md cursor-pointer ${darkTheme ? "bg-[#353535]" : "bg-[#fce0b5]"}`} onClick={setTheme}>
            {darkTheme ? <MdDarkMode className='text-white' /> : <MdDarkMode />}

        </div>
    )
}

export default DarkTheme