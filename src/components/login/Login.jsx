import "./login.css";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"; // *** Added getDoc
import upload from '../../lib/upload';

const BOT_USER_ID = "8jCFTUGMvIadZ71rsvwL"; // Replace this with actual bot user UID

const Login = () => {
    const [avatar, setAvatar] = useState({ file: null, url: "" });
    const [loading, setLoading] = useState(false);

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const imgUrl = await upload(avatar.file);

            // Create user in "users" collection
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            });

            // Ensure userchats and unique bot chat
            const userChatsRef = doc(db, "userchats", res.user.uid);
            const userChatsSnap = await getDoc(userChatsRef);

            const defaultBotChat = {
                chatId: res.user.uid + BOT_USER_ID, // or generate unique ID
                isSeen: false,
                lastMessage: "Hey! I'm your assistant bot 🤖",
                receiverId: BOT_USER_ID,
                updatedAt: Date.now(),
            };

            if (!userChatsSnap.exists()) {
                // If doc does not exist, create with bot chat
                await setDoc(userChatsRef, { chats: [defaultBotChat] });
            } else {
                // Doc exists; prevent duplicate bot entries
                const existingChats = userChatsSnap.data().chats || [];
                const hasBotChat = existingChats.some(chat => chat.receiverId === BOT_USER_ID);
                if (!hasBotChat) {
                    await setDoc(
                        userChatsRef,
                        { chats: [...existingChats, defaultBotChat] },
                        { merge: true }
                    );
                }
            }

            toast.success("Account created! You can login now.");
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login'>
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an image
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
