export const getSender = (loggedUser, users) => {
    if (loggedUser && loggedUser._id) {

        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    }
}
// export const getSender = (loggedUser, users) => {
//     if (loggedUser && loggedUser._id && users && users.length >= 2) {
//         const senderIndex = users[0]._id === loggedUser._id ? 1 : 0;
//         return users[senderIndex].name;
//     }
//     // Handle the case where loggedUser or users is not properly defined
//     return "Unknown";
// }
export const getSenderFull = (loggedUser, users) => {
    if (loggedUser && loggedUser._id) {
        return users[0]._id === loggedUser._id ? users[1] : users[0].name;
    }
}

export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    )
}

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}


export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
}

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
}