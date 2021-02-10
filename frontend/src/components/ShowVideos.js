import React, { useState, useEffect } from 'react'
import { Link, Router } from "react-router-dom"
import "../css/showvideo.css"
import API from "../api"

function ShowVideos() {

    const [videos, setVideos] = useState([])

    useEffect(() => {
        API.get("/getallvideos")
            .then((response) => {
                let newArray = response.data.sort((a, b) => {

                    return b.views - a.views 
                })
                setVideos(newArray)
            }, (error) => {
            })
    }, [])

    return (
        <div>
            {videos.map(video => {
                return (
                    <a key={Math.random() * 10000} className="no-under" href={`/videos/${video._id}`}>
                        <div className="m-4 text-center">
                            <img className="img-fluid" src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} alt=""/>
                            <h3 className="text-body text-roboto">{video.title}</h3>
                            <h6 className="text-muted text-roboto">{video.views} views</h6>
                        </div>
                    </a>
                )
            })}
        </div>
    )
}

export default ShowVideos
