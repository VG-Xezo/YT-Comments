import React, { useState, useRef, useEffect } from 'react'
import Header from "./Header"
import { useForm } from "react-hook-form";

import API from "../api"

function SearchVideo() {

    const { register, handleSubmit } = useForm()
    const myForm = useRef()
    const [videos, setVideos] = useState([])
    const [searched, setSearched] = useState(false)

    function onSubmit(data) {
        API.get(`/search/?term=${data.term}`)
            .then((response) => {
                setVideos(response.data)
                setSearched(true)
            }, (error) => {
            })
    }

    return (
        <div>
            <Header />
            <form className="m-3" onSubmit={handleSubmit(onSubmit)} ref={myForm}>
                <div className="form-group mb-2">
                    <label className="text-roboto" htmlFor="term">Your Comment</label>
                    <input type="text" name="term" className="form-control" id="term" aria-describedby="emailHelp" placeholder="Your search tem" ref={register({ required: true })} />
                </div>
                <button className="btn btn-outline-info">Search</button>
            </form>
            <h2 className="text-center mt-3">Your results</h2>
            <hr className="m-5" />
            { searched ? videos.map(video => {
                return (
                    <a key={Math.random() * 10000} className="no-under" href={`/videos/${video._id}`}>
                        <div className="m-4 text-center">
                            <img className="img-fluid" src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} alt="" />
                            <h3 className="text-body text-roboto">{video.title}</h3>
                            <h6 className="text-muted text-roboto">{video.views} views</h6>
                        </div>
                    </a>
                )
            }) : <h4 className="mt-4 text-center">You haven't searched anything</h4> }
        </div>
    )
}

export default SearchVideo
