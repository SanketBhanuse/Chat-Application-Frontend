import { ChatState } from "../Context/ChatProvider"
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";


const Chatpage = () => {
    const { user, darkTheme } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <div>
            {user && <SideDrawer />}
            <section className={`chatbox_wrapper flex justify-between p-[10px]  h-[91vh] ${darkTheme ? "bg-[#474B57]" : "bg-[#ffe1d4]"} gap-2`}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </section>
        </div>
    )
}

export default Chatpage