import "./detail.css"

const Detail = () => {
  return (
    <div className='detail'>
        <div className="user">
            <img src="./avatar.png" alt="" />
            <h2>Jane Doe</h2>
            <p>Skibid toilet sigma boi</p>
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
                <span>Privacy % help</span>
                <img src="./arrowUp.png" alt="" />
                </div>  
                <div className="photos">
                    <div className="photoI">
                        <img src="https://raw.githubusercontent.com/Sonny4546/Tradery/refs/heads/main/images/background.jpg" alt="" />
                        <span>photo_2024_2.png</span>
                    </div>
                    <img src="./download.png" alt="" />
                </div>
            </div>
            <div className="option">
              <div className="title">
                <span>Shared Photos</span>
                <img src="./arrowDown.png" alt="" />
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
                <span>Chat Settings</span>
                <img src="./arrowUp.png" alt="" />
                </div>  
            </div>
        </div>
    </div>
  )
}

export default Detail