import "./detail.css"
import { auth } from "../../lib/firebase"
const Detail = () => {
    return (
        <div className='detail'>
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>Jane Doe</h2>
                <p>lorem ipsum blhvjhvjv jjhvjhvjh jhhv</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        
                        
                        <div className="photoItem">
                            <div className="photoDetail">

                            <img src="https://cdn.pixabay.com/photo/2020/10/05/10/51/cat-5628953_1280.jpg" alt="" />
                            <span>photo_2025_2.png</span>
                            </div>
                        
                        <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">

                            <img src="https://cdn.pixabay.com/photo/2020/10/05/10/51/cat-5628953_1280.jpg" alt="" />
                            <span>photo_2025_2.png</span>
                            </div>
                        
                        <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">

                            <img src="https://cdn.pixabay.com/photo/2020/10/05/10/51/cat-5628953_1280.jpg" alt="" />
                            <span>photo_2025_2.png</span>
                            </div>
                        
                        <img src="./download.png" alt="" className="icon"/>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button>Block User</button>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            </div>
            
        </div>
    )
}
export default Detail