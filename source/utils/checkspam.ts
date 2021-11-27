import axios from 'axios';
async function checkspam(text:string){
    const response = await axios({
    method: 'post',
    url: 'http://localhost:5000/spam', //change this to spamdetector url later
    data: {
        message : text
    }
    });
    return response.data
};
