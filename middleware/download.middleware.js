import jwt from 'jsonwebtoken'

const Download = async (req, res, next)=>{
    const {token} = req.query

    if(!token)
        return res.status(400).send("Invalid request")

    try {       
        const payload = await jwt.verify(token, process.env.JWT_FILE_SECRET)
        req.body.path = payload.file
        next()
    }
    catch(err)
    {
        res.status(400).send("File link expired")
    }
}

export default Download