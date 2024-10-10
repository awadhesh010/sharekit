import FileModel from '../model/file.model.js'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const emailTemplate = (data)=>{
    return (
        `   
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Files from ShareKit</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        width: 100%;
                        background-color: #f4f4f4;
                        padding: 20px 0;
                    }
                    .email-content {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333333;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666666;
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .file-list {
                        margin-top: 20px;
                    }
                    .file-list a {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 10px 15px;
                        border-radius: 4px;
                        margin-bottom: 10px;
                    }
                    .file-list a:hover {
                        background-color: #45a049;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #999999;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-content">
                        <h1>Your Files from ShareKit</h1>
                        <p><b>Sender</b> - ${data.sender}</p>
                        <br />
                        <p style="text-transform: capitalize">Hello ${data.user},</p>
                        <p>Thank you for using ShareKit! The files you requested are now ready for download. Click the links below to access your files:</p>
                        
                        <div class="file-list">
                            <a href="${process.env.SERVER}/api/file/download?token=${data.token}" download>Download Now</a>
                        </div>

                        <p>If you have any questions, feel free to reach out to our support team at support@sharekit.com.</p>
                        <p>Best regards,<br> The ShareKit Team</p>

                        <div class="footer">
                            <p>&copy; 2024 ShareKit. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>

        `
    )
}

export const createFile = async (req, res)=>{
    try {
        const file = req.file
        const newFile = new FileModel({
            user: req.user.id,
            filename: file.originalname,
            type: file.mimetype,
            size: file.size,
            path: `storage/files/${file.filename}`
        })
        await newFile.save()
        res.status(200).json(newFile)
    }
    catch(err)
    {
        res.status(500).json({
            message: "Failed to upload file"
        })
    }
}

export const fetchFiles = async (req, res)=>{
    try {
        const files = await FileModel.find()
        res.status(200).json(files)
    }
    catch(err)
    {
        res.status(200).json({
            message: 'Failed to fetch files'
        })
    }
}

export const deleteFile = async (req, res)=>{
    try {
        const file = await FileModel.findByIdAndDelete(req.params.id)

        if(!file)
            return res.status(404).json({
                message: 'Failed to delete file'
            })

        res.status(200).json(file)
    }
    catch(err)
    {
        res.status(200).json({
            message: 'Failed to delete file'
        })
    }
}

export const downloadFile = async (req, res)=>{
    try {
        const { path }  = req.body
        res.download(path, (err)=>{
            if(err)
                return res.status(404).send("File not found")
        })
    }
    catch(err)
    {
        res.status(500).json({
            message: "Failed to download the file"
        })
    }
}

export const shareFile = async (req, res)=>{
    try {
        const receipt = req.body
        const payload = {
            file: receipt.file
        }
        const token = jwt.sign(payload, process.env.JWT_FILE_SECRET , {expiresIn: '7d'})
        receipt.token = token

        const smtp = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })

        await smtp.sendMail({
            from: process.env.SMTP_EMAIL,
            to: receipt.email,
            subject: 'ShareKit - File Recieved !',
            html: emailTemplate(receipt)
        })
        res.status(200).json({
            message: 'File sent'
        })
    }
    catch(err)
    {
        console.log(err.message)
    }
}