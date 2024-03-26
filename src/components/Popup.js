import React, { useState } from 'react'

import close from '../assets/close.png'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm';
import Profile from './Profile';
import CreateNewGroup from './CreateNewGroup';
import UpdateGroupChat from './miscellaneous/UpdateGroupChat';
import { ChatState } from '../Context/ChatProvider';


const Popup = ({ onclose, isChatPage, createNewGroup, user, updategroup, fetchAgain, setFetchAgain, fetchMessages }) => {
    const { darkTheme } = ChatState();
    const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

    const handleOverlayClick = (e) => {
        // Check if the click target is the overlay itself, not any child element
        if (e.target === e.currentTarget) {
            onclose();
        }
    };

    const toggleForm = () => {
        setIsRegisterFormVisible(!isRegisterFormVisible);
    }


    return (
        <div id="Modal"  >
            <div className="modal-overlay z-50 bg-[#000] bg-opacity-80 absolute left-0 top-0  right-0 bottom-0 z-1  h-[100vh]" onClick={handleOverlayClick} >
                <div className={`${darkTheme ? "bg-[#474B57] text-white" : "bg-[#faf1ed]"} modal-content-wrapper absolute z-10 left-[50%] top-[50%]  transform translate-x-[-50%] translate-y-[-50%] text-black p-5 rounded-xl ${!isChatPage ? "md:w-[40%] w-[90%]" : ""} md:w-auto `}>
                    <button className=' hover:scale-105 absolute right-[10px] top-[10px] p-1 bg-black rounded-[50%]' type='button' onClick={onclose}>
                        <div className="img_wrapper w-[25px] h-auto">
                            <img src={close} alt="" />
                        </div>
                    </button>
                    {isChatPage ?
                        <>
                            <Profile user={user} />
                        </> :
                        createNewGroup ?
                            <>
                                <CreateNewGroup onClose={handleOverlayClick} />
                            </> :
                            updategroup ?
                                <>
                                    <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} onClose={onclose} fetchMessages={fetchMessages} />
                                </>
                                :
                                <>
                                    {isRegisterFormVisible ? <RegisterForm /> : <LoginForm />}
                                    <div className='block mt-2 text-right'> {isRegisterFormVisible ? " already register ?" : "Not registered ? "} <button className='inline-block text-[#f96e28] font-bold' onClick={toggleForm}>{isRegisterFormVisible ? "Login" : "Register"}</button></div>
                                </>

                    }

                </div>
            </div>
        </div>
    )
}

export default Popup