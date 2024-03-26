import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import UserListItem from './User Avtar/UserListItem';
import UserBadgeItem from './User Avtar/UserBadgeItem';
import Loader from './Loader';
import { APP_LINK } from '../config/constant';

const CreateNewGroup = () => {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

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
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error('failed to load chat');

        }
    }


    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast.error('Please fill all the fields');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.post(`${APP_LINK}/api/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);

            setChats([data, ...chats]);

            toast.success('group chat created successfully');
        } catch (error) {
            toast.success('Faild to create group chat ');

        }
    }


    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id));
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.error('User is already added');
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    return (
        <div className='createGroupChat min-w-[300px] max-w-[300px]'>
            <div className="heading text-[22px] font-bold pb-1 mb-2 border-orange-500 border-b-2">Create Group Chat</div>
            < >
                <input placeholder="Chat Name" className='text-black mb-3 block border-2 border-gray-600 rounded-sm w-full p-1' type="text" onChange={(e) => setGroupChatName(e.target.value)} />

                <input placeholder="Add Users" className=' text-black block border-2 border-gray-600 rounded-sm w-full p-1' type="text" onChange={(e) => handleSearch(e.target.value)} />
                <div className="userbadgeWrapper flex flex-wrap gap-1 my-2">

                    {
                        selectedUsers.map((u) => (
                            <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                        ))
                    }
                </div>

                {loading ? <div className='block text-center animate-pulse opacity-5 text-orange-500 font-semibold ' ><Loader /></div> : (
                    searchResult?.slice(0, 3).map(user => (
                        <UserListItem key={user._id} user={user} handleFuncation={() => handleGroup(user)} />
                    ))
                )}
                <button onClick={handleSubmit} className='w-full py-1 bg-orange-500 hover:bg-orange-400 hover:text-black font-semibold text-white rounded-md mt-1'>Create Chat</button>
            </>

        </div>
    )
}

export default CreateNewGroup

