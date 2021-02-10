import React, { useState, useEffect, useRef } from 'react'
import ShowVideos from "./ShowVideos"
import { useParams } from "react-router-dom"
import logo from "../assets/logo.png"
import API from "../api"
import "../css/video.css"

import { useForm } from "react-hook-form";

function Comment(props) {

    const [loadingLikes, setLoadingLikes] = useState(false)
    const [author, setAuthor] = useState({})
    const [liked, setLiked] = useState(false)

    async function addLike() {
        const user = JSON.parse(localStorage.getItem("user"))

        if (props.likers.includes(user.email)) {
            setLoadingLikes(true)
            await API.put(`/removecommentlike/${props.id}`, { liker: user.email, comment: props.index })
                .then((response) => {
                    
                    setLiked(false)
                }, (error) => {
                    console.log(error)
                })
            await API.put(`/removeview/?id=${props.id}`)
            props.getQuestion()
            setLoadingLikes(false)
        } else {
            setLoadingLikes(true)
            await API.put(`/addcommentlike/${props.id}`, { liker: user.email, comment: props.index })
                .then((response) => {
                    setLiked(true)
                }, (error) => {
                    console.log(error)
                })
            await API.put(`/removeview/?id=${props.id}`)
            props.getQuestion()
            setLoadingLikes(false)
        }
    }

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"))
        let pfp = ""

        API.get(`/getpfp/?email=${props.author}`)
            .then((response) => {
                pfp = response.data
            }, (error) => {
                console.log(error)
            })
        API.get(`/getusername/?email=${props.author}`)
            .then((response) => {
                let newAuthor = {
                    pfp: pfp,
                    username: response.data
                }
                setAuthor(newAuthor)
            }, (error) => {
                console.log(error)
            })
        if (props.likers.includes(user.email) === true) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [])

    return (
        <div className="mb-3">
            <div className="header-container flex">
                <img height="32" className="avatar" src={author.pfp} alt={`${author.username}'s pfp`} />
                <h5 className="ml-1">{author.username}</h5>
            </div>
            <div className="content-container mt-1 ml-1">
                <h6 className="text-bold">{props.content}</h6>
            </div>
            <div className="like-container">
                {loadingLikes ? <div className="spinner-container"><div className="spinner-border text-primary" role="status"></div></div> : <div className="flex mb-1"><h4><i onClick={addLike} className={liked ? "bi bi-hand-thumbs-up text-primary cursor-pointer" : "bi bi-hand-thumbs-up cursor-pointer"}></i></h4><h6 className="ml-1">{props.likes}</h6></div>}
            </div>
        </div>
    )
}

function Video() {

    const [logged, setLogged] = useState(true)
    const [isAuthor, setIsAuthor] = useState(false)
    const [author, setAuthor] = useState({})
    const [video, setVideo] = useState({})
    const [avatar, setAvatar] = useState("")
    const [loaded, setLoaded] = useState(false)
    const { register, handleSubmit } = useForm()
    const [liked, setLiked] = useState(false)
    const [loadingLikes, setLoadingLikes] = useState(false)
    const myForm = useRef()
    let { id } = useParams();

    async function addLike() {
        const user = JSON.parse(localStorage.getItem("user"))

        if (video.likers.includes(user.email)) {
            setLoadingLikes(true)
            await API.put(`/removelike/?id=${id}&email=${user.email}`)
            await API.put(`/removeview/?id=${id}`)
            getQuestion()
            setLoadingLikes(false)
        } else {
            setLoadingLikes(true)
            await API.put(`/addlike/?id=${id}&email=${user.email}`)
            await API.put(`/removeview/?id=${id}`)
            getQuestion()
            setLoadingLikes(false)
        }
    }

    function deleteVid() {
        API.delete(`/deletevideo/?id=${id}`)
        window.location.replace("/")
    }

    async function getQuestion() {
        let thisVideo = {}
        const user = JSON.parse(localStorage.getItem("user"))

        if (user === null) {
            setAvatar({})
            setLogged(false)
        } else {
            if (user.pfp !== "") {
                setAvatar(user.pfp)
            } else {
                setAvatar(`https://ui-avatars.com/api/?name=${user.username}`)
                setLogged(true)
            }
        }
        let pfp = ""
        await API.get(`/getvideo/?id=${id}`)
            .then((response) => {
                if (response.data === "") {
                    window.location.replace("/404")
                }
                let newData = response.data
                newData.ogranizedComments = response.data.comments.sort((a, b) => {

                    return b.likes - a.likes
                })
                setVideo(newData)
                thisVideo = response.data
                if (user.email === response.data.author) {
                    setIsAuthor(true)
                }
                if (response.data.likers.includes(user.email) === true) {
                    setLiked(true)
                } else {
                    setLiked(false)
                }
            }, (error) => {
                console.log(error)
                window.location.replace("/404")
            })
        await API.get(`/getpfp/?email=${thisVideo.author}`)
            .then((response) => {
                pfp = response.data
            }, (error) => {
                console.log(error)
            })
        await API.get(`/getusername/?email=${thisVideo.author}`)
            .then((response) => {
                let newAuthor = {
                    pfp: pfp,
                    username: response.data
                }
                setAuthor(newAuthor)
            }, (error) => {
                console.log(error)
            })
        setTimeout(() => setLoaded(true), 3000)
        await API.put(`/addview/?id=${id}`)
    }
 
    function onSubmit(data) {
        const user = JSON.parse(localStorage.getItem("user"))
        data.likes = "0"
        data.likers = []
        data.author = user.email


        API.post(`/addcomment/${id}`, data)
            .then((response) => {
                alert("Added Comment Successfully")
                API.put(`/addlike/?id=${id}&email=${user.email}`)
                API.put(`/removeview/?id=${id}`)
                getQuestion()
            }, (error) => {
                alert("Something went wrong!")
                console.log(error)
            })
        myForm.current.reset()
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user === null) {
            window.location.replace("/login")
        }
        getQuestion()
    }, [])

    if (loaded === true) {
        return (
            <div>
                <div className="header-container flex-header">
                    <a className="no-under" href="/">
                        <div className="m-2 flex">
                            <img className="float" width="64" src={logo} alt="YT comments logo" />
                            <h5 className="text-roboto text-muted ml-1">YT Comments</h5>
                        </div>
                    </a>
                    <div className="avatar-container m-2">
                        {logged ? <a title="Go to dashboard" href="/dashboard"><img className="avatar" width="48" height="48" src={avatar} alt="Your Avatar" /></a> : <h6 className="text-roboto ml-1">Please <a href="/login">Login</a> To Make the Most Out Of Yt Comments</h6>}
                    </div>
                </div>
                <div className="video-container">
                    <div className="content-container mt-3">
                        <center>
                            <div className="embed-responsive embed-responsive-16by9 embed-container">
                                <iframe src={`https://www.youtube.com/embed/${video.id}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        </center>
                        <div className="text-container mt-2">
                            <h2 className="text-roboto">{video.title}</h2>
                            <h6 className="text-roboto text-muted">{video.views} views</h6>
                            <hr />
                            <div className="author-container mt-2 mb-2 flex">
                                <img height="48" className="avatar" src={author.pfp} alt={`${video.author}'s pfp`} />
                                <p className="text-bold text-roboto ml-1">{author.username}</p>
                            </div>
                            <p className="mt-2 text-roboto">{video.desc}</p>
                            <div className="like-container flex">
                                {loadingLikes ? <div className="spinner-container text-center mb-1"><div className="spinner-border text-primary" role="status"></div></div> : <div className="flex mb-1"><h4><i onClick={addLike} className={liked ? "bi bi-hand-thumbs-up text-primary cursor-pointer" : "bi bi-hand-thumbs-up cursor-pointer"}></i></h4><h6 className="ml-1">{video.likes}</h6></div>}
                            </div>
                            {isAuthor ? <button onClick={deleteVid} className="btn btn-danger"><i className="bi bi-trash"></i> Delete</button> : <br /> }
                        </div>
                    </div>
                </div>
                <div className="comment-container m-3 mt-5">
                    {logged ? <form onSubmit={handleSubmit(onSubmit)} ref={myForm}><div className="form-group mb-2"><label className="text-roboto" htmlFor="content">Your Comment</label><input type="text" name="content" className="form-control" id="content" aria-describedby="emailHelp" placeholder="Your comment" ref={register({ required: true })} /></div><button className="btn btn-outline-info"><i className="bi bi-envelope"></i> Post Comment</button></form> : <form onSubmit={handleSubmit(onSubmit)} ref={myForm}><div className="form-group mb-2"><label className="text-roboto" htmlFor="comment">You most login first!</label><input type="text" readOnly name="comment" className="form-control" id="comment" aria-describedby="emailHelp" placeholder="Your must login" ref={register({ required: true })} /></div><button className="btn btn-outline-info"><i className="bi bi-envelope"></i> Post Comment</button></form>}
                </div>
                <hr className="m-3" />
                <div className="comments-container m-3">
                    {video.ogranizedComments.map((comment, index) => {
                        return (
                            <Comment key={Math.random() * 10000} liked={comment.likers.includes()} likes={comment.likes} id={id} index={index} likers={comment.likers} getQuestion={getQuestion} content={comment.content} author={comment.author} />
                        )
                    })}
                </div>
                <hr className="m-5" />
                <div className="videos-container">
                    <h3 className="m-4 text-center text-roboto">Recommended</h3>
                    <ShowVideos />
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="spinner-container text-center mt-5">
                    <div className="spinner-border text-primary" role="status">

                    </div>
                </div>
                <h3 className="mt-3 text-center text-danger text-roboto">Your video is loading...</h3>
            </div>
        )
    }
}

export default Video
