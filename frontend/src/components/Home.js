import React from 'react'
import Header from "./Header"
import ShowVideos from "./ShowVideos"
import "../css/home.css"

function Home() {
    return (
        <div>
            <div className="header-container">
                <Header />
            </div>
            <div className="flex-buttons">
                <div className="postvid-container m-2">
                    <a href="/addvideo"><button className="btn btn-outline-danger"><i className="bi bi-cloud-plus"></i> Post a Video</button></a>
                </div>
                <div className="postvid-container m-2">
                    <a href="/search"><button className="btn btn-outline-info"><i className="bi bi-search"></i> Search for a Video</button></a>
                </div>
            </div>
            <div className="videos-container mt-4">
                <ShowVideos />
            </div>
        </div>
    )
}

export default Home
