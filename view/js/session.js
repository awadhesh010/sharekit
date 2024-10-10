const getSession = async ()=>
{
    const session = localStorage.getItem("auth")

    if(!session)
        return null

    try {
        const res = await axios.post("/api/verify-token", {token: session})
        return {
            token: session,
            user: res.data
        }
    }
    catch(err)
    {
        return null
    }
}

const logout = ()=>{
    localStorage.clear()
    window.location = "/login.html"
}