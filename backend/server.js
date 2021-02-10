import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"

import userSchema from "./schemas/userSchema.js"
import videoSchema from "./schemas/videoSchema.js"

import config from "./config.js"

const app = express()
const PORT = process.env.PORT || 8000

const URL = `${config.dbURL}`
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

app.use(cors())
app.use(bodyParser.json())

app.post("/adduser", (req, res) => {
    userSchema.exists({ email: req.body.email }, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result === true) {
                res.status(500).send("That user exists!")
            } else {
                userSchema.create(req.body, (err, data) => {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        res.status(201).send(data)
                    }
                })
            }
        }
    })
})

app.post("/addvideo", (req, res) => {
    videoSchema.create(req.body, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.post("/updatepfp", (req, res) => {
    userSchema.findOne({ email: req.body.email}, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {


                foundObject.pfp = req.body.pfp

                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.post("/updateuser", (req, res) => {
    userSchema.findOne({ email: req.body.email }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {


                foundObject.username = req.body.username

                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.get("/getuser/", (req, res) => {
    let email = req.query.email
    let password = req.query.password
    userSchema.findOne({ email: email, password: password }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (data === null) {
                res.status(500).send(err)
            } else {
                res.status(201).send(data)
            }
        }
    })
})

app.get("/getpfp/", (req, res) => {
    let email = req.query.email
    userSchema.findOne({ email: email }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (data === null) {
                res.status(500).send(err)
            } else {
                res.status(201).send(data.pfp)
            }
        }
    })
})

app.get("/getallvideos", (req, res) => {
    videoSchema.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get("/getusername/", (req, res) => {
    let email = req.query.email
    userSchema.findOne({ email: email }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (data === null) {
                res.status(500).send(err)
            } else {
                res.status(201).send(data.username)
            }
        }
    })
})

app.get("/getvideo/", (req, res) => {
    let id = req.query.id
    videoSchema.findOne({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get("/search/", (req, res) => {
    let term = req.query.term
    videoSchema.find((err, data) => {

        let termData = []

        data.forEach((item, index) => {
            if (item.title.toLowerCase().includes(term.toLowerCase()) === true) {
                termData.push(item)
            }
        })


        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(termData)
        }
    })
})

app.put("/addlike/", (req, res) => {
    let id = req.query.id
    let email = req.query.email
    videoSchema.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {

                
                let likes = foundObject.likes

                let newLikes = parseInt(likes) + 1

                let newLikers = foundObject.likers

                newLikers.push(email)

                foundObject.likers = newLikers

                foundObject.likes = newLikes.toString()

                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        console.log(updatedObject)
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.put("/removelike/", (req, res) => {
    let id = req.query.id
    let email = req.query.email
    videoSchema.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {


                let likes = foundObject.likes

                let newLikes = parseInt(likes) - 1

                let newLikers = foundObject.likers

                const index = newLikers.indexOf(email);
                if (index > -1) {
                    newLikers.splice(index, 1);
                }

                foundObject.likers = newLikers

                foundObject.likes = newLikes.toString()

                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.put("/addview/", (req, res) => {
    const id = req.query.id
    videoSchema.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {


                let views = foundObject.views

                let newViews = parseInt(views) + 1

                foundObject.views = newViews.toString()

                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.put("/removeview/", (req, res) => {
    const id = req.query.id
    videoSchema.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {


                let views = foundObject.views

                let newViews = parseInt(views) - 1

                foundObject.views = newViews.toString()

                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.put("/removecommentlike/:id", (req, res) => {
    const id = req.params.id
    videoSchema.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {

                console.log(req.body)
                let comment = req.body.comment


                let likeCount = parseInt(foundObject.comments[comment].likes) - 1
                let newLikers = foundObject.comments[comment].likers

                const index = newLikers.indexOf(req.body.liker);
                if (index > -1) {
                    newLikers.splice(index, 1);
                }

                let newComment = {
                    likers: newLikers,
                    likes: likeCount.toString(),
                    content: foundObject.comments[comment].content,
                    author: foundObject.comments[comment].author
                }


                foundObject.comments[comment] = newComment
                foundObject.markModified("comments")
                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.put("/addcommentlike/:id", (req, res) => {
    const id = req.params.id
    videoSchema.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {

                console.log(req.body)
                let comment = req.body.comment


                let likeCount = parseInt(foundObject.comments[comment].likes) + 1
                let newLikers = foundObject.comments[comment].likers
                newLikers.push(req.body.liker)

                let newComment = {
                    likers: newLikers,
                    likes: likeCount.toString(),
                    content: foundObject.comments[comment].content,
                    author: foundObject.comments[comment].author
                }


                foundObject.comments[comment] = newComment
                foundObject.markModified("comments")
                console.log(newComment)
                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.post("/addcomment/:id", (req, res) => {
    const id = req.params.id
    videoSchema.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
            console.log(err)
            res.status(500).send()
        } else {
            if (!foundObject) {
                res.status(404).send()
            } else {

                let newComment = {}

                if (req.body.content) {
                    newComment.content = req.body.content
                }

                if (req.body.likes) {
                    newComment.likes = req.body.likes
                }

                if (req.body.likers) {
                    newComment.likers = req.body.likers
                }

                if (req.body.author) {
                    newComment.author = req.body.author
                }


                let comments = foundObject.comments
                comments.push(newComment)

                foundObject.comments = comments
                
                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.send(updatedObject)
                    }
                })
            }
        }
    })
})

app.delete("/deletevideo/", (req, res) => {
    const id = req.query.id
    videoSchema.deleteOne({ _id: id }, function (err) {
        if (err) {
            res.status(500).send()
        } else {
            res.status(200).send()
        }
    })
})

app.delete("/deleteuser/", (req, res) => {
    const email = req.query.email
    userSchema.deleteOne({ email: email }, function (err) {
        if (err) {
            res.status(500).send()
        } else {
            res.status(200).send()
        }
    })
})

app.listen(PORT)

