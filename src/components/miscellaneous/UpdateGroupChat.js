import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import UserBadgeItem from '../User Avtar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../User Avtar/UserListItem';
import Loader from '../Loader';
import { APP_LINK } from '../../config/constant';


const UpdateGroupChat = ({ fetchAgain, setFetchAgain, updategroup, onClose, fetchMessages }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false)

    const { user, selectedChat, setSelectedChat } = ChatState();

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("only admin can remove someone");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put(`${APP_LINK}/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                }, config);


            user1._id === user.id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setRenameLoading(false);
        } catch (error) {
            toast.error("faild to remove user");
            console.log(error);

        }


    }


    const handleGroup = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1.id)) {
            toast.error("User already in a group");
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("only admin can add someone");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put(`${APP_LINK}/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            toast.error("faild to add")
        }
    }
    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const response = await axios.put(`${APP_LINK}/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            // console.log(response)
            if (response) {

                setSelectedChat(response.data);
                setFetchAgain(!fetchAgain);
                setRenameLoading(false);
            }

            onClose();


        } catch (error) {
            console.log(error);

        }

        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get(`${APP_LINK}/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error('failed to load chat');

        }
    }

    return (
        <div className='md:min-w-[300px] '>
            <div className="heading text-center font-bold text-[22px]">{selectedChat.chatName}</div>
            <div className='label my-2'>Group Members:- </div>
            <div className='flex flex-wrap gap-1 '>
                {
                    selectedChat.users.map((u) => (
                        <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                    ))
                }
            </div>
            <div className="renamebox mt-2 flex gap-3">
                <input type="text" placeholder='Chat Name' className='text-black p-1 flex-1  border-orange-400 border-2 rounded-md' value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                <button onClick={handleRename} className='bg-orange-400 hover:bg-orange-300 text-black font-bold px-3 py-1 rounded-md'  >Update</button>
            </div>

            <div className="adduser mt-2 ">
                <input type="text" placeholder='Add User To Group' className='text-black w-[100%] p-1 flex-1  border-orange-400 border-2 rounded-md ' onChange={(e) => handleSearch(e.target.value)} />
                <div className="userbadgeWrapper flex flex-wrap gap-1 my-2">


                </div>

                {loading ? <div className='block text-center animate-pulse opacity-5 text-orange-500 font-semibold ' >
                    <Loader />
                </div> : (
                    searchResult?.slice(0, 3).map(user => (
                        <UserListItem key={user._id} user={user} handleFuncation={() => handleGroup(user)} />
                    ))
                )}

            </div>

            <div className="leave_grp flex justify-end">
                <button onClick={() => handleRemove(user)} className='bg-red-600 hover:bg-red-500 text-right text-white mt-2 font-bold px-3 py-1 rounded-md'>Leave Group</button>

            </div>

        </div>
    )
}

export default UpdateGroupChat