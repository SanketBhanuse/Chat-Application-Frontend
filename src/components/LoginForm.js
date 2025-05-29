import React, { useState } from 'react';
import Showpass from '../assets/show.png';
import Hidepass from '../assets/Hide.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';
import { APP_LINK } from '../config/constant';
import Loader from './Loader';


const LoginForm = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { darkTheme } = ChatState();

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        if (!email || !password) {
            toast.error('Please fill in all the required fields!');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                `${APP_LINK}/api/user/login`,
                { email, password },
                config,

            );
            console.log(data);

            toast.success('Login is successful');

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
            // history.push('/chats')
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);

        }
    };

    const handleShowClick = () => {
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 1000);
    }
    return (
        <div id='loginForm' >
            <h1 className='text-[28px] text-[#f96e28] font-bold mb-3'>Login</h1>
            <form action="" className='relative'>
                <label className={`mb-1 block ${darkTheme ? "text-white" : "text-black"}`} >Email Id</label>
                <input value={email} type="email" className='block mb-3 focus:outline-none w-[100%]  rounded-md p-1 border-b-2 border-red-600  bg-transparent' onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <div className="password_input_wrapper relative">
                    <input value={password} type={show ? "text" : "password"} className='z-1 block mb-1 focus:outline-none w-[100%]  rounded-md p-1 border-b-2 border-red-600  bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                    <div className='cursor-pointer absolute right-2 top-[50%] transform translate-y-[-50%]' onClick={handleShowClick} >
                        <div className="img_wrapper w-[20px] h-auto">
                            <img src={show ? Showpass : Hidepass} alt="" />
                        </div>
                    </div>
                </div>
                <div className="btn_wrapper text-right ">

                    <div className="block">
                        <button className=" bg-[#f96e28] hover:bg-[#f96028] inline-block text-white font-bold mt-3  py-2 px-10 text-right  rounded cursor-pointer" onClick={submitHandler} disabled={loading}>
                            {loading ? "loading..." : "Login"}
                        </button>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setEmail("guestuser@gmail.com");
                            setPassword("12345");
                        }}
                        className=" bg-[#6f6f6f] hover:bg-[#f96028] inline-block transition-all  text-white font-bold mt-3  py-2 px-10 text-right  rounded cursor-pointer">
                        Get Guest User Credentials
                    </button>
                </div>
            </form>
            {loading ? <Loader /> : ""}
        </div>
    )
}

export default LoginForm