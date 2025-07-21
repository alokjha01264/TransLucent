import React, { useState, useEffect } from 'react';
import AddUser from './addUser/AddUser';
import "./chatList.css";
import { db } from '../../../lib/firebase';
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUserStore } from '../../../lib/userStore';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  // REMOVED BOT_CHAT and BOT_USER

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      if (!res.exists()) return;

      const items = res.data()?.chats || [];

      const promises = items.map(async (item) => {
        try {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          if (!userDocSnap.exists()) return null;
          const user = userDocSnap.data();
          return { ...item, user };
        } catch (err) {
          console.error("Error fetching user:", err);
          return null;
        }
      });

      const chatData = (await Promise.all(promises)).filter(Boolean);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unSub();
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    // No more special-case 'botChat', so this is simplified:
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);
    if (chatIndex === -1) return;

    userChats[chatIndex].isSeen = true;

    try {
      const userChatsRef = doc(db, "userchats", currentUser.id);
      await updateDoc(userChatsRef, { chats: userChats });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error("Failed to update chat status:", err);
    }
  };

  const filteredChats = chats.filter(
    (c) =>
      c.user?.username?.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search Icon" />
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt={addMode ? "Close Add Mode" : "Open Add Mode"}
          className="add"
          onClick={() => setAddMode(prev => !prev)}
        />
      </div>

      {filteredChats.length === 0 ? (
        <p className="no-chats">No chats found</p>
      ) : (
        filteredChats.map(chat => {
          const isBlocked = chat.user?.blocked?.includes(currentUser.id);
          return (
            <div
              className="item"
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <img
                src={
                  isBlocked
                    ? "./avatar.png"
                    : chat.user?.avatar || "./avatar.png"
                }
                alt="User Avatar"
              />
              <div className="texts">
                <span>{isBlocked ? "User" : chat.user?.username}</span>
                <p>{chat.lastMessage}</p>
              </div>
            </div>
          );
        })
      )}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
