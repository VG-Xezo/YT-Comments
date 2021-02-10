import React, { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form";
import "../css/dashboard.css"
import API from "../api"

function Dashboard() {

    const [avatar, setAvatar] = useState("")
    const [password, setPassword] = useState("")
    const [revealed, setRevealed] = useState(false)
    const { register, handleSubmit } = useForm()
    const [user, setUser] = useState({})

    const onSubmit = data => {
        myForm.current.reset()
        let newUser = JSON.parse(localStorage.getItem("user"))
        newUser.pfp = data.pfp
        data.email = user.email
        API.post('/updatepfp', data)
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(newUser))
                setTimeout(() => window.location = window.location, 1500)
            }, (error) => {
                alert("Change insuccessful")
                console.log(error)
            })
    }

    const myForm = useRef()

    function deleteUser() {
        const user = JSON.parse(localStorage.getItem("user"))
        API.delete(`/deleteuser/?email=${user.email}`)
        localStorage.clear()
        window.location.replace("/")
    }

    function changePassword() {
        const user = JSON.parse(localStorage.getItem("user"))
        if (revealed === true) {
            let hidePass = ""
            for (var i = 0; i < user.password.length; i++) {
                hidePass += "*"
            }
            setPassword(hidePass)
            setRevealed(false)
        }
        if (revealed === false) {
            setPassword(user.password)
            setRevealed(true)
        }
    }

    function logOut() {
        localStorage.clear()
        setTimeout(() => window.location.replace("/"), 1000)
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))

        if (user === null) {
            window.location.replace("/login")
        } else {
            let hidePass = ""
            for (var i = 0; i < user.password.length; i++) {
                hidePass += "*"
            }
            setUser(user)
            setPassword(hidePass)
            if (user.pfp !== "") {
                setAvatar(user.pfp)
            } else {
                setAvatar(`https://ui-avatars.com/api/?name=${user.username}`)
            }
        }
    }, [])

    return (
        <div>
            <div className="header-container">
                <div className="m-2 flex">
                    <img className="avatar" width="64" src={avatar} alt="YT comments logo" />
                    <h3 className="text-roboto ml-1">{user.username}</h3>
                </div>
            </div>
            <h2 className="m-2 mt-5">Your Info</h2>
            <div className="info-container mt-5">
                <h5 className="text-roboto m-2">Your email is {user.email}</h5>
                <div className="password-container flex m-2">
                    <h5 className="text-roboto mt-3">Your password is {password}</h5>
                    <button type="button" onClick={changePassword} className="btn btn-outline-primary ml-2">{revealed ? "Hide Password" : "Reveal Password"}</button>
                </div>
                <div className="input-container m-2">
                    <form className="mb-3" onSubmit={handleSubmit(onSubmit)} ref={myForm}>
                        <div className="form-group">
                            <label className="text-roboto" htmlFor="pfp">Profile Picture URL</label>
                            <input type="text" name="pfp" className="form-control" id="pfp" aria-describedby="emailHelp" placeholder="Enter URL" ref={register({ required: true })} />
                        </div>
                        <button type="submit" className="btn btn-primary">Set Profile Picture</button>
                    </form>
                </div>
            </div>
            <div className="actions-container mt-5">
                <button onClick={logOut} className="btn btn-warning ml-2 text-white"><i className="bi bi-trash"></i> Log Out</button>
                <a href="/"><button className="btn btn-outline-success ml-2"><i className="bi bi-house-door-fill"></i> Return Home</button></a>
            </div>
            <div className="delete-container mt-5">
                <h3 className="ml-2 mb-2">DANGER!</h3>
                <button onClick={deleteUser} className="btn btn-danger ml-2">Delete Account</button>
            </div>
        </div>
    )
}

export default Dashboard
