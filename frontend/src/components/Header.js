import logo from "../assets/logo.png"
import "../css/header.css"
import React, { useEffect, useState } from 'react'

function Header() {

    const [logged, setLogged] = useState(true)
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
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
    }, [])
    return (
        <>
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
        </>
    )
}

export default Header
