import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { toast } from 'react-toastify';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import { FaPlus } from "react-icons/fa";
import Popup from './Popup';
import { APP_LINK } from '../config/constant';


const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const [isModalopen, setIsmodalOpen] = useState(false);

    const { selectedChat, setSelectedChat, user, chats, setChats, darkTheme } = ChatState();

    const openModal = () => {
        setIsmodalOpen(true);

    }
    const closeModal = () => {
        setIsmodalOpen(false);

    }
    const fetchChats = async () => {
        console.log(user._id);
        try {
            const config = {

                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${APP_LINK}/api/chat`, config);
            setChats(data);
        } catch (error) {
            toast.error('failed to load chat');
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain])
    return (
        <div className={`${darkTheme ? "bg-[#1F1E21]" : "bg-[#faf1ed]"} p-2 w-full md:w-[30%] rounded-md ${selectedChat ? "hidden" : "flex"} md:flex flex-col gap-[1px] `}>
            <div className="header flex justify-between items-center">
                <div className={`${darkTheme ? "text-white" : "text-black"} heading  p-2  font-bold text-lg`}>MyChats</div>
                <button className={`p-2    font-semibold text-sm flex gap-1 items-center rounded-md ${darkTheme ? "bg-[#474B57] text-white" : "bg-[#ff831d99] text-black"}`} onClick={openModal}>New Group Chat <FaPlus /> </button>
            </div>

            {chats ? (
                <div className="chatusers overflow-y-scroll">
                    {chats.map((chat) => (

                        // <div className={`chatusers ${darkTheme ? selectedChat === chat ? "!bg-orange-500 text-white" : "bg-[#474B57] text-white" : "bg-[#ffe1d4] text-black"} mb-1 py-3 px-2 hover:bg-[ffe1d4] rounded-md capitalize  cursor-pointer ${selectedChat === chat ? "!bg-orange-500 text-white" : " bg-[#ffdcba] text-black "}`}
                        <div className={`chatusers ${darkTheme ? selectedChat === chat ? "!bg-orange-500 text-white" : "bg-[#474B57] text-white" : selectedChat === chat ? "!bg-orange-500 text-white" : "bg-[#ffe1d4] text-black"} mb-1 py-3 px-2 hover:bg-[ffe1d4] rounded-md capitalize  cursor-pointer`}
                            onClick={() => setSelectedChat(chat)}
                            key={chat._id}
                        >
                            {!chat.isGroupChat ? (
                                getSender(loggedUser, chat.users)
                            ) : (chat.chatName)}

                        </div>
                    ))}
                </div>
            ) : (
                <ChatLoading />)

            }

            {isModalopen && <Popup onclose={closeModal} createNewGroup={true} user={user} />}

        </div>
    )
}

export default MyChats