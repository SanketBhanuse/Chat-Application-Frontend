import React, { useEffect, useState } from 'react'
import chatpng from '../assets/chat-png-2.png';
import '../Main.css'
import Popup from '../components/Popup';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';
import DarkTheme from '../components/DarkTheme';

const Homepage = () => {
    const [isModalopen, setIsmodalOpen] = useState(false);
    const navigate = useNavigate();
    const { darkTheme } = ChatState();

    const openModal = () => {
        setIsmodalOpen(true)
    }
    const closeModal = () => {
        setIsmodalOpen(false)
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) {
            navigate("/chats");
        }
    }, [navigate]);

    return (
        <div id='Home-page' className='relative'>
            <div className=" container m-auto">
                <div className="darkthemeWrapper absolute right-2 top-2">

                    <DarkTheme />
                </div>
                <div className="custom-grid grid grid-cols-1  md:grid-cols-2">
                    <div className="info-wrapper flex justify-center items-center order-2 md:order-1">
                        <div className="info md:bg-transparent bg-white p-5 m-3 rounded-md">
                            <div className="text-[28px] md:text-[38px] lg:w-[70%] mx-auto my-0 w-[100%] md:text-left text-center ">
                                <div className={`heading leading-10 font-semibold ${darkTheme ? " md:text-white text-black" : "md:text-black text-black"}`}> <p className={`text-[#f96e28] inline-block font-bold `}>Connect</p>   with your circle in a fun way! </div>
                                <div className={`${darkTheme ? "md:text-white text-black" : "md:text-black text-black"} text-[18px] mt-5`}>Express yourself more through
                                    reactions in chat
                                    ep the quality
                                    Abundant features are
                                    waiting for you, what are
                                    you waiting for?</div>
                                <button type="button" onClick={openModal} className="focus:outline-none text-white bg-[#f96e28] hover:bg-[#f95928] focus:ring-4 focus:ring-orange-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#f96e28] dark:hover:bg-[#f96728] mt-3">Let's Start Coversation</button>

                            </div>
                        </div>
                    </div>
                    <div className="img-block order-1 md:order-2">
                        <div className="img_wrapper">
                            <img src={chatpng} alt="" className="image" />
                        </div>
                    </div>


                </div>
            </div>
            {isModalopen && <Popup onclose={closeModal} />}
        </div>
    )
}

export default Homepage