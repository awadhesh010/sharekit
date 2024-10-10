window.onload = async ()=>{
    const session = await getSession()

    if(!session)
        return window.location = "/login.html"

    profileInfo(session)
    fetchDashboard(session)
}

const getMb = (byte)=>{
    const kb = byte / 1000
    const mb = kb / 1000
    return mb.toFixed(1)
}

const fetchDashboard = async (session)=>{
    try {
        const report = document.getElementById("report")
        const options = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }
        const {data} = await axios.get('/api/dashboard', options)

        for(let item of data)
        {
            console.log(item)
            const ui = `
                <div class="border border-gray-200 rounded-lg flex items-center justify-center flex-col py-8">
                    <i class="ri-file-3-fill text-4xl"></i>
                    <h1 class="text-lg">${item._id}</h1>
                    <h1 class="text-4xl font-bold mt-4">${getMb(item.totalSize)} Mb</h1>
                </div>
            `
            report.innerHTML += ui
        }
    }
    catch(err)
    {
        console.log(err)
    }
}