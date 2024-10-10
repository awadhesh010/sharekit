let session = null

window.onload = async ()=>{
    session = await getSession()
    
    if(!session)
        return window.location = "/login.html"

    profileInfo(session.user)
    fetchFiles(session.token)
}

const getMb = (byte)=>{
    const kb = byte / 1000
    const mb = kb / 1000
    return mb.toFixed(1)
}

const uploadFile = async (e)=>{
    try {
        const progress = document.getElementById("progress")
        const size = document.getElementById("size")
        const input = e.target
        const file = input.files[0]
        const formdata = new FormData()
        formdata.append('file',file)
        const options = {
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            onUploadProgress: (e)=>{
                const total = e.total
                const loaded = e.loaded
                const percentage = Math.floor((loaded*100)/total)
                progress.style.width = percentage+'%'
                progress.innerHTML = percentage+'%'
                size.innerHTML = `${getMb(loaded)}Mb / ${getMb(total)}Mb`
            }
        }
        await axios.post('/api/file', formdata, options)
        window.location = location.href
    }
    catch(err)
    {
        console.log(err.response.data)
    }
}

const fetchFiles = async (session)=>{
    try {
        let count = 1
        const options = {
            headers: {
                Authorization: `Bearer ${session}`
            }
        }
        
        const res = await axios.get("/api/file", options)
        const table = document.getElementById("files-table")
        for(let file of res.data)
        {
            console.log(file)
            const ui = `
                 <tr class="border-b">
                    <td class="py-4 pl-3">${count}</td>
                    <td>${file.filename}</td>
                    <td>${file.size}</td>
                    <td>${file.type}</td>
                    <td>${moment(file.createdAt).format('DD MMM YYYY, hh:mm:ss A')}</td>
                    <td>
                        <div class="space-x-2">
                            <button class="bg-rose-500 text-white rounded w-10 h-10" onclick="deleteFile('${file._id}')">
                                <i class="ri-delete-bin-6-line"></i>
                            </button>

                            <button class="bg-violet-500 text-white rounded w-10 h-10" onclick="downloadFile('${file.path}', '${file.filename}')">
                                <i class="ri-download-line"></i>
                            </button>

                            <button class="bg-green-500 text-white rounded w-10 h-10" onclick="openDrawer('${file.path}', '${file.filename}')">
                                <i class="ri-share-line"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `
            table.innerHTML += ui
            count = count+1
        }
    }
    catch(err)
    {
        console.log("my error", err.response.data)
    }
}


const deleteFile = async (id)=>{
    try {
        const options = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }
        await axios.delete(`/api/file/${id}`, options)
        window.location = location.href
    }
    catch(err)
    {
        console.log(err.response.data)
    }
}


const downloadFile = async (path, filename)=>{
    try {
        const options = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }
        const {data} = await axios.post('/api/file/download', {path}, options)
        const url = URL.createObjectURL(data)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }
    catch(err)
    {
        const error = await (err.response.data).text()
        console.log(error)
    }
}

const openDrawer = (path, filename)=>{
    // Showing filename
    const filenameInput = document.getElementById("filename")
    filenameInput.innerHTML = 'Share File - '+filename

    // Setting path in file input
    const fileInput = document.getElementById("file-input")
    fileInput.value = path

    // Setting send email id
    const sender = document.getElementById("sender")
    sender.value = session.user.email

    const drawer = document.getElementById("drawer")
    drawer.classList.remove("-right-[450px]")
    drawer.classList.add("right-0")
}

const closeDrawer = ()=>{
    const drawer = document.getElementById("drawer")
    drawer.classList.remove("right-0")
    drawer.classList.add("-right-[450px]")
}

const shareFile = async (e)=>{
    try {
        e.preventDefault()
        const loadingButton = document.getElementById("loading-button")
        loadingButton.classList.remove("hidden")

        const sendingButton = document.getElementById("sending-button")
        sendingButton.classList.add("hidden")

        const options = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }
        const form = e.target
        const data = {
            sender: form[0].value,
            user: form[1].value,
            email: form[2].value,
            file: form[3].value
        }
        await axios.post('/api/file/share', data, options)
        new Swal({
            icon: 'success',
            title: 'File Sent !'
        })
        form.reset()
        closeDrawer()
        loadingButton.classList.add("hidden")
        sendingButton.classList.remove("hidden")
    }
    catch(err)
    {
        new Swal({
            icon: 'error',
            title: 'File Sending failed'
        })
    }
}