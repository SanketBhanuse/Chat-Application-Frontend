import React, { useState } from 'react';
import Showpass from '../assets/show.png';
import Hidepass from '../assets/Hide.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';
import { APP_LINK } from '../config/constant';
// import { useHistory } from 'react-router-dom';

const RegisterForm = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState(false);
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { darkTheme } = ChatState();
    // const history = useHistory();

    const handleShowClick = () => {

        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 1000);

    }

    const postDetails = (pics) => {
        if (pics === undefined) {
            toast.error('Please Upload your profile photo');
            setLoading(false);
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dyb56veff");
            fetch("https://api.cloudinary.com/v1_1/dyb56veff/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json()).then(data => {
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
        }
        else {
            toast.error('Please Select an Image');
            setLoading(false);
        }
    };
    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast.error('Please fill in all the required fields!');
            setLoading(false);
            return;
        }

        if (password !== confirmpassword) {
            toast.error('Password Do Not Match');
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                `${APP_LINK}/api/user`,
                { name, email, password, pic },
                config,

            );
            console.log(data);

            toast.success('Registration is successful');

            localStorage.setItem("userInfo", JSON.stringify(data));
            console.log(JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
            // history.push('/chats')
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);

        }
    };
    return (
        <div id='RegistrationForm' >
            <h1 className={`text-[28px] text-[#f96e28] font-bold mb-3`}>Register</h1>
            <form action="" className="">
                <label className={`mb-1 block ${darkTheme ? "text-white" : "text-black"}`}>Name *</label>
                <input required type="text" className='block mb-3 focus:outline-none w-[100%] rounded-md p-1 border-b-2 border-red-600  bg-transparent' onChange={(e) => setName(e.target.value)} />
                <label className='mb-1 block'>Email Id *</label>
                <input type="email" className='block mb-3 focus:outline-none w-[100%] rounded-md p-1 border-b-2 border-red-600  bg-transparent' onChange={(e) => setEmail(e.target.value)} />

                <label className={`mb-1 block ${darkTheme ? "text-white" : "text-black"}`}>Password *</label>
                <div className="password_input_wrapper relative">
                    <input required type={show ? "text" : "password"} className='block mb-1 focus:outline-none w-[100%] rounded-md p-1 border-b-2 border-red-600  bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                    <div className='cursor-pointer absolute right-2 top-[50%] transform translate-y-[-50%]' onClick={handleShowClick} >
                        <div className="img_wrapper w-[20px] h-auto">
                            <img src={show ? Showpass : Hidepass} alt="" />
                        </div>
                    </div>
                </div>
                <label className={`mb-1 block ${darkTheme ? "text-white" : "text-black"}`}>Confirm Password *</label>
                <div className="password_input_wrapper relative">
                    <input required type={show ? "text" : "password"} className='block mb-1 focus:outline-none w-[100%] rounded-md p-1 border-b-2 border-red-600  bg-transparent' onChange={(e) => setConfirmpassword(e.target.value)} />
                    <div className='cursor-pointer absolute right-2 top-[50%] transform translate-y-[-50%]' onClick={handleShowClick} >
                        <div className="img_wrapper w-[20px] h-auto">
                            <img src={show ? Showpass : Hidepass} alt="" />
                        </div>
                    </div>
                </div>
                <label className={`mb-1 block ${darkTheme ? "text-white" : "text-black"}`}>Upload Your Picture</label>
                <input type="file" accept='image/*' className='inline-block mb-3' onChange={(e) => postDetails(e.target.files[0])} />
                <div className="btn_wrapper text-right ">
                    <button className=" bg-[#f96e28] hover:bg-[#f96028] inline-block text-white font-bold mt-3  py-2 px-10 text-right  rounded cursor-pointer" onClick={submitHandler}  >
                        {loading ? 'Loading...' : 'Register Now'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm