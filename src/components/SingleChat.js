import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { getSender, getSenderFull } from '../config/ChatLogics';
import { FaEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import Popup from './Popup';
import UpdateGroupChat from './miscellaneous/UpdateGroupChat';
import axios from 'axios';
import { toast } from 'react-toastify';
import ScrollableChat from './ScrollableChat';
import { io } from "socket.io-client";
import Loader from './Loader';
import { APP_LINK } from '../config/constant';

const ENDPOINT = "https://chat-application-backend-rjxc.onrender.com";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [isModalopen, setIsmodalOpen] = useState(false);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const { user, selectedChat, setSelectedChat, notification, setNotification, darkTheme } = ChatState();


    const openModal = () => {
        setIsmodalOpen(true);

    }
    const closeModal = () => {
        setIsmodalOpen(false);

    }

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`${APP_LINK}/api/message/${selectedChat._id}`, config);
            console.log(messages);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast.error("Failed to Load Message");
        }
    }
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        return () => {
            // Clean up socket connection when component unmounts
            socket.disconnect();
        };
    }, [])
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        console.log(notification, '------------------');
        socket.on("message recieved", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    })
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post(`${APP_LINK}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                },
                    config
                );
                console.log(data);
                socket.emit('new message', data);
                setMessages([...messages, data]);
            } catch (error) {
                toast.error("Failed to send message");
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (socketConnected) { return }

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }
    return (
        <>
            {selectedChat ? (
                <div className="ChatIsSelected  h-[96%]">

                    {!selectedChat.isGroupChat ? (
                        <>
                            <div className="header flex justify-between items-center">
                                <button className='md:hidden  hover:bg-orange-400 px-3 py-1 bg-orange-300 cursor-pointer shadow-lg inline-block rounded-md' onClick={() => setSelectedChat("")}><IoMdArrowRoundBack /></button>

                                {getSender(user, selectedChat.users)}
                                <div className='  hover:bg-orange-400 px-3 py-1 bg-orange-300 cursor-pointer shadow-lg inline-block rounded-md' onClick={openModal}><FaEye /></div>
                            </div>
                            {isModalopen && <Popup onclose={closeModal} isChatPage={true} user={getSenderFull(user, selectedChat.users)} />}

                        </>
                    ) : (
                        <>

                            <div className="header flex justify-between items-center">

                                <button className='md:hidden  hover:bg-orange-400 px-3 py-1 bg-orange-300 cursor-pointer shadow-lg inline-block rounded-md' onClick={() => setSelectedChat("")}><IoMdArrowRoundBack /></button>
                                {selectedChat.chatName.toUpperCase()}
                                {/* <div onClick={openModal}>abc</div> */}
                                <div className='  hover:bg-orange-400 px-3 py-1 bg-orange-300 cursor-pointer shadow-lg inline-block rounded-md' onClick={openModal}><FaEye /></div>
                            </div>
                            {isModalopen && <Popup onclose={closeModal} updategroup={true} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />}

                            {/* <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}
                        </>
                    )}

                    <div className={`relative chatui flex flex-col justify-end   m-2  h-[97%]  ${darkTheme ? "bg-[#474B57]" : "bg-[#ffe1d4]"} overflow-y-hidden rounded-lg`}>
                        {loading ?
                            <Loader className="" />
                            :
                            (
                                <div className='messages flex flex-col overflow-y-scroll '>
                                    <ScrollableChat messages={messages} />
                                </div>
                            )
                        }
                        {isTyping ?
                            <div className="w-[fit-content] bg-orange-400 ml-2 rounded-md opacity-40">
                                <div className='flex  gap-1 justify-left items-center p-2 bg-ora'>
                                    <div className='text-black text-[10px]'>typing</div>
                                    <div className='h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                    <div className='h-2 w-2 bg-black rounded-full animate-bounce'></div >
                                </div >
                            </div>
                            : <></>}
                        <div onKeyDown={sendMessage} className='flex' >
                            <input type="text" onChange={typingHandler} placeholder='Enter a message ....' value={newMessage} className={` p-2 flex-1 m-2 ${darkTheme ? "bg-[#42444a]" : "bg-[#ffffff]"} border-orange-400 border-2 rounded-md text-[18px]`} />
                        </div >
                    </div >
                </div >
            ) :
                (
                    <div className="ChatNotSelected flex justify-center items-center text-gray-400 text-[28px] h-full w-full">
                        Click On User To Start Chating
                    </div>
                )
            }
        </ >
    )
}

export default SingleChat