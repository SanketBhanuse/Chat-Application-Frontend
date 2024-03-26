import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => <div>
                <div className={`w-auto flex ${m.sender._id === user._id ? "justify-end " : " justify-start "}`} key={m._id}>
                    {(isSameSender(messages, m, i, user._id)
                        || isLastMessage(messages, i, user._id)
                    ) && (
                            <img src={m.sender.pic} alt="" className='w-6 h-6 m-2 mt-3' />
                        )}

                    <span
                        className={`rounded-md m-2  flex ${m.sender._id === user._id ? "bg-[#ffffff] text-black justify-start" : "bg-[#f99945] text-white justify-end"} max-w-[70%] py-[5px] px-[15px]  ${isLastMessage(messages, i, user._id) || isSameSender(messages, m, i, user._id) ? "ml-0" : "ml-[40px]"} mb-1`}
                    // className={`rounded-md m-2  flex ${m.sender._id === user._id ? "bg-[#ffffff] text-black justify-start" : "bg-[#f99945] text-white justify-end"} max-w-[70%] py-[5px] px-[15px] ml-[${isSameSenderMargin(messages, i, user._id)}] mt-[${isSameUser(messages, m, i, user._id)}] mb-1`}
                    >
                        {m.content}
                    </span>

                </div>
            </div>)
            }

        </ScrollableFeed >
    )
}

export default ScrollableChat