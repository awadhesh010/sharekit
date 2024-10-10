import jwt from 'jsonwebtoken'

const Authorization = async (req, res, next)=>{
    const auth = req.headers.authorization

    if(!auth)
        return res.status(400).send("Bad request")

    const [type, token] = auth.split(" ")
    
    if(type !== "Bearer")
        return res.status(400).send("Bad request")

    try {
        const user = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    }
    catch(err)
    {
        return res.status(400).send("Bad request")
    }
}

export default Authorization