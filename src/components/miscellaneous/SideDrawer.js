import React, { useEffect, useState } from 'react';
import { Tooltip } from "@material-tailwind/react";
// import { Tooltip } from "material-tailwind";
import { FaSearch, FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ChatState } from '../../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import Popup from '../Popup';
import close from '../../assets/close.png';
import '../../Main.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEye } from "react-icons/fa";
import ChatLoading from '../ChatLoading';
import UserListItem from '../User Avtar/UserListItem';
import DarkTheme from '../DarkTheme';
import { getSender } from '../../config/ChatLogics';
import { APP_LINK } from '../../config/constant';



const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setloadingChat] = useState();
    const [showOptions, setshowOptions] = useState(false);
    const [isModalopen, setIsmodalOpen] = useState(false);
    const [isDraweropen, setIsDrawerOpen] = useState(false);
    const [displayNotification, setDisplayNotification] = useState(false);

    const [isDrawerClosed, setIsDrawerClosed] = useState(false);


    const { user, setSelectedChat, chats, setChats, notification, setNotification, darkTheme } = ChatState();
    const navigate = useNavigate();
    const opendrawer = () => {
        setshowOptions(!showOptions);

    }
    const openModal = () => {
        setIsmodalOpen(true);
        setshowOptions(!showOptions);

    }
    const closeModal = () => {
        setIsmodalOpen(false);

    }
    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
        setshowOptions(!showOptions);

    }

    const openDrawer = () => {
        setIsDrawerOpen(true);
    }
    const handleOverlay = (e) => {
        if (e.target === e.currentTarget) {
            setIsDrawerOpen(false);
        }
    }
    const closeDrawer = (e) => {
        setIsDrawerOpen(false);


    }
    const handleSearch = async () => {
        if (!search) {
            toast.error('Please enter somwthing in search');
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.get(`${APP_LINK}/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error('Faild to load the search results');

        }
    }

    const accessChat = async (userId) => {
        try {
            setloadingChat(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.post(`${APP_LINK}/api/chat`, { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setloadingChat(false);
            closeDrawer();
        } catch (error) {
            toast.error('Faild to fetch Chats');

        }
    }

    const showNotification = () => {

        setDisplayNotification(!displayNotification);


    }
    return (
        <>
            <div id='navbar' className='p-1 flex justify-between   items-center'>
                <div className="btn_wrapper">
                    <Tooltip content="Search User" className="p-1 relative"  >
                        <button className={`${darkTheme ? "bg-[#474B57] hover:bg-[#383c48] text-white" : "bg-[#ff831d99] hover:bg-orange-400 text-black"} px-[15px]  rounded-sm py-[5px] flex gap-2 justify-center items-center cursor-pointer`} onClick={openDrawer}>
                            <FaSearch style={{ color: 'black' }} className='block ' />
                            <span className='hidden md:block'>  Search User</span>
                        </button>

                    </Tooltip>
                </div>
                <div className="title_wrapper">
                    <h1 className={`${darkTheme ? "text-white" : "text-black"} text-[18px] md:text-[28px] font-black uppercase`}>
                        Chat Application
                    </h1>
                </div>
                <div className="flex profile_wrapper  justify-center items-center ">
                    <div className="darkTheme mr-2">
                        <DarkTheme />
                    </div>

                    <div className="notification relative">
                        <FaBell className={`mr-2 ${darkTheme ? "text-white" : "text-black"}`} onClick={showNotification}> </FaBell>
                        {notification.length !== 0 &&

                            <div className="counterDot text-[10px] flex justify-center items-center absolute w-3 h-3 rounded-full bg-red-700 text-white top-[-10px] right-[6px]">
                                {notification.length}
                            </div>
                        }
                        {displayNotification ?
                            <>

                                <div className="notification_box absolute top-6 cursor-pointer right-0 w-[max-content] bg-white h-auto p-2 shadow-md rounded-md" >
                                    {!notification.length ? "No New Messages" :
                                        <>
                                            {notification.map((notify) => (
                                                <div key={notify._id} onClick={() => {
                                                    setSelectedChat(notify.chat)
                                                    setNotification(notification.filter((n) => n !== notify))
                                                    setDisplayNotification(false)
                                                }}>
                                                    {notify.chat.isGroupChat ? `New Message in ${notify.chat.chatName}` :
                                                        `New Message From ${getSender(user, notify.chat.users)}`}
                                                </div>
                                            ))}
                                        </>}



                                </div>
                            </> :
                            <></>

                        }

                    </div>
                    <div className={` profile relative flex justify-center items-center ${darkTheme ? "bg-[#474B57]" : "bg-[#ff831d99]"} px-2 py-1 rounded-md gap-2`}>

                        <img className="hidden md:block w-8 h-auto p-[2px] rounded-full ring-2 ring-[#fff]" src={user.pic} alt="Bordered avatar"></img>
                        <div className="options_selector ">
                            {showOptions ?
                                <FaChevronUp onClick={opendrawer} className='cursor-pointer' />
                                : <FaChevronDown onClick={opendrawer} className='cursor-pointer' />
                            }

                            <div className={`options ${showOptions ? "block" : "hidden"} absolute right-0 top-10 bg-white`}>
                                <div className='w-full hover:bg-orange-400 px-6 py-1 cursor-pointer shadow-lg' onClick={openModal}>Profile</div>
                                <div className='w-full hover:bg-orange-400 px-6 py-1 cursor-pointer shadow-lg' onClick={logout}>Logout</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {isModalopen && <Popup onclose={closeModal} isChatPage={true} user={user} />}

            <div id='sideDrawer'>
                <div className={`drawer-overlay absolute z-50  h-full top-0 bg-[#000] bg-opacity-80 cursor-pointer ${isDraweropen ? 'open-overlay left-0' : 'left-[-100px]'}`} onClick={handleOverlay}>
                    <div className={`overflow-y-auto  ${darkTheme ? "bg-[#474B57] text-white" : "bg-[#faf1ed] text-black"}   w-[80%] md:w-[30%] h-full  absolute left-0 top-0 ${isDraweropen ? 'drawer-open' : ''}`}>

                        <div className="sidedrawerContent z-10 p-2">
                            <div className={`sticky top-0 relative  ${darkTheme ? "bg-[#474B57]" : "bg-[#faf1ed]"} pb-1`}>
                                <button className=' hover:scale-105 absolute right-[0px] top-[0px] p-1 bg-black rounded-[50%]' type='button' onClick={closeDrawer}>
                                    <div className="img_wrapper w-[20px] h-auto ">
                                        <img src={close} alt="" />
                                    </div>
                                </button>
                                <div className='text-[18px] font-semibold py-1 w-full border-b-2' > Search User</div>
                                <input type="text" className='text-black border-gray-500 border-[2px] rounded-md w-[80%] text-[18px] p-1 mt-3 inline-block ' placeholder='Search by name or email' value={search} onChange={(e) => setSearch(e.target.value)} />
                                <button className='bg-orange-500 inline-block w-[19%] ml-[1%] py-2 rounded-md text-white' onClick={handleSearch}>Go</button>
                            </div>
                            <div className="chatResults mt-3 ">
                                {loading ?
                                    <div className="loadingSceleton ">
                                        <ChatLoading />
                                    </div>
                                    :
                                    (

                                        searchResult?.map(user => (
                                            <UserListItem
                                                key={user.id}
                                                user={user}
                                                handleFuncation={() => accessChat(user._id)}
                                            />
                                        ))
                                    )
                                }
                                {loadingChat && <span className='absolute top-[0] left-[0] flex justify-center items-center w-full h-full bg-[#ff872b00] backdrop-blur'><svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg></span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default SideDrawer