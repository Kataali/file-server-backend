const db = require("../databasepg");
const nodemailer = require("nodemailer");
const path = require("node:path")

// Add file to the Database
module.exports.uploadFile = async(obj, chosenFile) => {
    const file = chosenFile;
    const title = obj.title.trim();
    const description = obj.description.trim();
    const response = await db.query("INSERT into files(title, description, file) VALUES($1, $2, $3)", [title, description, file.filename])
    .catch(e => console.log(e));
    return response;
}

// Get All Files from Database
module.exports.getFiles = async() => {
    const response = await db.query('SELECT * FROM files ORDER BY id ASC')
    .catch(e => console.log(e))
        return response;
  }

// Get file path from Database
module.exports.getFileDbPath = async(title) => {
    const response = await db.query('SELECT file FROM files WHERE title = $1', [title.trim()])
    .catch(e => console.log("Failed to get file path" + e))
        return response.rows[0];
}


// Mail File to address
module.exports.emailFile = async(email, fileName, fileTitle) => {
    const filePath = path.join(__dirname, "../files/");
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "muhammadismaaiil360@gmail.com",
            pass: "yikl mmak mmmb zfde"
        }
      });
      
    var mailOptions = {
        from: "muhammadismaaiil360@gmail.com",
        to: email,
        subject: "File Request",
        text: `The File you requested, ${fileTitle} is attached below.`,
        attachments: [{filename: fileName, path: `${filePath}${fileName}`}]
    };

    const response = await transporter.sendMail(mailOptions)
    .catch(e => {return e})
        return response;
}

// Search database for keyword
module.exports.searchForFile = async(keyword) => {
    const response = await db.query(`SELECT file FROM files WHERE title LIKE $1 OR description LIKE $1`, [`%${keyword.trim()}%`])
    .catch(e => console.log("Failed to search database" + e))
        return response;
}

// 