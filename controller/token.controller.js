import jwt from 'jsonwebtoken'

const verifyToken = async (req, res)=>{
    try {
        const user = await jwt.verify(req.body.token, process.env.JWT_SECRET)
        res.status(200).json(user)
    }
    catch(err)
    {
        res.status(401).json({
            message: 'Invalid token'
        })
    }
}

export default verifyToken