import React, { useState } from 'react'
import AddUser from './addUser/AddUser'
import "./chatList.css"
import { db } from '../../../lib/firebase'
import { onSnapshot } from 'firebase/firestore'

const ChatList = () => {
    const [chats, setChats] = useState([])
    const [addMode,setAddMode]= useState(false)

    const { currentUser } = useUserStore()
    useEffect (() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats
            const promises = items.map(async (item)=> {
                const userDocRef = doc(db, "")
            })

        })

        return () => {
            unSub()
        }
    }, [currentUser.id])
    return(
        <div className='chatList'>
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img
                 src={addMode ? "./minus.png" : "./plus.png"}
                  alt=""
                   className="add" 
                    onClick={() => setAddMode((prev) => !prev)}
                />
                
            </div>
            {chats.map(chat=>(
            <div className="item" key={chat.chatId}>
                <img src="./avatar.png" alt="" />
                <div className="texts">
                    <span>Jane Doe</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </div>
            ))}
            
          {addMode && <AddUser />}
        </div>
        
    )
}

export default ChatList;