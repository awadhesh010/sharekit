const signup = async (e)=>{
    try {
        e.preventDefault()
        const form = e.target
        const data = {
            fullname: form.elements[0].value,
            email: form.elements[1].value,
            password: form.elements[2].value
        }
        const res = await axios.post('/api/signup', data)
        new Swal({
            icon: 'success',
            title: res.data.message,
            text: 'Click ok to go login page'
        })
        .then(()=>{
            window.location = "/login.html"
        })
    }
    catch(err)
    {
        new Swal({
            icon: 'error',
            title: err.response.data.message
        })
    }
}