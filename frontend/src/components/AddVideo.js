import React, { useState, useEffect, useRef } from 'react'
import API from "../api"
import { useForm } from "react-hook-form";

function AddVideo() {

    const { register, handleSubmit } = useForm()
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const myForm = useRef()
    
    useEffect(() => {
        const avatar = JSON.parse(localStorage.getItem('user'))

        if (avatar === null) {
            window.location.replace("/login")
        } else {
            setUser(avatar)
        }
    }, [])

    const onSubmit = data => {

        data.author = user.email
        data.views = "0"
        data.likes = "0"
        data.comments = []
        data.likers = []
        setLoading(true)
        myForm.current.reset()
        API.post('/addvideo', data)
            .then((response) => {
                alert("Video Post Successful");
                setLoading(false)
            }, (error) => {
                alert("Something went wrong!")
                console.log(error)
                setLoading(false)
            })
    }

    return (
        <div>
            <div className="header-icon-container m-3">
                <a href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-house-fill text-muted" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
                        <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
                    </svg>
                </a>
            </div>
            <h2 className="text-roboto mt-2 mb-3 text-center">Fill out the form below to post a video!</h2>
            <div className="form-container m-4">
                <div className="inputs-container m-2">
                    <form onSubmit={handleSubmit(onSubmit)} ref={myForm}>
                        <div className="form-group mb-2">
                            <label className="text-roboto" htmlFor="title">Your Video Title</label>
                            <input type="text" name="title" className="form-control" id="title" aria-describedby="emailHelp" placeholder="Enter Video Title" ref={register({ required: true })} />
                        </div>
                        <div className="form-group mb-2">
                            <label className="text-roboto" htmlFor="desc">Your Video Description</label>
                            <input type="text" name="desc" className="form-control" id="desc" aria-describedby="emailHelp" placeholder="Enter Video Description" ref={register({ required: true })} />
                        </div>
                        <div className="form-group">
                            <label className="text-roboto" htmlFor="id">Your Video ID</label>
                            <input type="text" name="id" className="form-control" id="id" aria-describedby="emailHelp" placeholder="Enter Video ID" ref={register({ required: true })} />
                            <small id="emailHelp" className="form-text text-muted">Ex: https://www.youtube.com/watch?v=<span className="text-primary">Qw4w9WgXcQ</span> Only Add: Qw4w9WgXcQ</small>
                        </div>
                        <div className="btn-container text-center mt-3 mb-2">
                            <button className="btn btn-outline-success" type="submit"><i className="bi bi-cloud-plus"></i> Post Video</button>
                        </div>
                    </form>
                    {loading ? <div className="spinner-container text-center">
                        <div className="spinner-border text-primary" role="status">

                        </div>
                    </div> : <br />}
                </div>
            </div>
        </div>
    )
}

export default AddVideo
