import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, darkTheme } = ChatState();
    return (
        <div className={`${darkTheme ? "bg-[#1F1E21] text-white" : "bg-[#faf1ed] text-black"} p-2 w-full md:w-[70%]  rounded-md ${selectedChat ? "flex" : "hidden"} md:flex   flex-col`} >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    )
}

export default ChatBox