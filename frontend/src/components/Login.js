import React, { useState, useRef, useEffect } from 'react'
import { useForm } from "react-hook-form";
import "../css/login.css"
import API from "../api"

function LoginPage() {

    const { register, handleSubmit } = useForm()
    const [loading, setLoading] = useState(false)

    


    const onSubmit = data => {
        setLoading(true)
        myForm.current.reset()
        API.get(`/getuser/?email=${data.email}&password=${data.password}`)
            .then((response) => {
                alert("Login successful click ok to redirect");
                setLoading(false)
                myForm.current.reset()
                console.log(response.data)
                localStorage.setItem('user', JSON.stringify(response.data))
                setTimeout(() => window.location.replace("/"), 500)
            }, (error) => {
                alert("Couldnt find a user with that info!")
                console.log(error)
                setLoading(false)
            })
    }

    const myForm = useRef()

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
            <div className="header-container text-center mt-3 text-roboto">
                <h2>Please login</h2>
            </div>
            <div className="form-container m-5 p-3">
                <div className="inputs-container m-2">
                    <form onSubmit={handleSubmit(onSubmit)} ref={myForm}>
                        <div className="form-group mb-2">
                            <label className="text-roboto" htmlFor="email">Your Email</label>
                            <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" ref={register({ required: true })} />
                        </div>
                        <div className="form-group">
                            <label className="text-roboto" htmlFor="password">Your Password</label>
                            <input type="password" name="password" className="form-control" id="password" aria-describedby="emailHelp" placeholder="Enter Password" ref={register({ required: true })} />
                        </div>
                        <div className="btn-container text-center mt-3">
                            <button className="btn btn-primary" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
            { loading ? <div className="spinner-container text-center">
                <div class="spinner-border text-primary" role="status">

                </div>
            </div> : <br /> }
        </div>
    )
}

function SignupPage() {

    const { register, handleSubmit } = useForm()
    const [notSame, setNotSame] = useState(false)
    const [loading, setLoading] = useState(false)


    const onSubmit = data => {
        if (data.password !== data["repeat-password"]) {
            setNotSame(true)
            return
        } else {
            setNotSame(false)
        }
        data.pfp = ""
        setLoading(true)
        myForm.current.reset()
        API.post('/adduser', data)
            .then((response) => {
                alert("Signup successful click ok to redirect");
                myForm.current.reset()
                localStorage.setItem('user', JSON.stringify(data))
                setLoading(false)
                setTimeout(() => window.location.replace("/"), 500)
            }, (error) => {
                alert("Signup insuccessful either someone has that email or our servers are down")
                console.log(error)
                setLoading(false)
            })
    }

    const myForm = useRef()

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
            <div className="header-container text-center mt-3 text-roboto">
                <h2>Please Sign Up</h2>
            </div>
            <div className="form-container m-5 p-3">
                <div className="inputs-container m-2">
                    <form onSubmit={handleSubmit(onSubmit)} ref={myForm}>
                        <div className="form-group mb-2">
                            <label className="text-roboto" htmlFor="email">Your Email</label>
                            <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" ref={register({ required: true })} />
                        </div>
                        <div className="form-group mb-2">
                            <label className="text-roboto" htmlFor="username">Your Username</label>
                            <input type="text" name="username" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter Username" ref={register({ required: true })} />
                        </div>
                        <div className="form-group mb-2">
                            <label className="text-roboto" htmlFor="password">Your Password</label>
                            <input type="password" name="password" className="form-control" id="password" aria-describedby="emailHelp" placeholder="Enter Password" ref={register({ required: true })} />
                        </div>
                        <div className="form-group">
                            <label className="text-roboto" htmlFor="repeat-password">Repeat Password</label>
                            <input type="password" name="repeat-password" className="form-control" id="repeat-password" aria-describedby="emailHelp" placeholder="Repeat Password" ref={register({ required: true })} />
                        </div>
                        {notSame ? <div className="alert alert-danger" role="alert">Your passwords do not match!</div> : <br />}
                        <div className="btn-container text-center mt-3">
                            <button className="btn btn-success" type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
            { loading ? <div className="spinner-container text-center">
                <div className="spinner-border text-primary" role="status">
                    
                </div>
            </div> : <br />}
        </div>
    )
}

function Login() {

    const [login, setLogin] = useState(true)
    const [show, setShow] = useState(false)

    useEffect(() => {
        const user = localStorage.getItem("user")
        if (user === null) {
            setShow(true)
        } else {
            setShow(false)
        }
    }, [])

    function changeType() {
        setLogin(!login)
    }
    
    if (show === true) {
        return (
            <div>
                {login ? <LoginPage /> : <SignupPage />}
                <div className="or-container text-center">
                    <h6 className="or text-primary text-roboto" onClick={changeType}>Or {login ? "Sign Up" : "Login"}?</h6>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="header-container text-center mt-3 text-roboto">
                    <h2>You are already logged in</h2>
                </div>
                <div className="home-container text-center mt-4">
                    <a className="text-muted" href="/"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
                        <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
                    </svg></a>
                    <a href="/"><h5 className="text-roboto mt-1">Return Home</h5></a>
                </div>
            </div>
        )
    }
}

export default Login
