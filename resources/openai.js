require('dotenv').config();
const axios = require('axios');

const { Configuration, OpenAIApi } = require("openai");

function chatGPT(body) {
    console.log(body)
    let chatGptMessage = body.message;
    console.log(body.context)
    console.log(chatGptMessage);
    return new Promise ((resolve, reject) => {
        const openai = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        }))
        openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: [{
                role: "assistant",
                content: body.message
            }]
        }).then(res => {
            resolve(res.data.choices)
        })
    })
}
function ftosEndpoints(){
    return new Promise ((resolve, reject) => {
        let data = JSON.stringify({
            "username": "iulian.musat",
            "password": "Pass-w0rd"
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://app-envoy-bankaccclone-dev.azurewebsites.net/ftosapi/authentication/keycloakToken',
            headers: { 
                'Content-Type': 'application/json', 
                'Cookie': 'ARRAffinity=31a267ed7b71ec86982412cc9dc4ad2f31ca2b8f51b692363aa765c405b03b84; ARRAffinitySameSite=31a267ed7b71ec86982412cc9dc4ad2f31ca2b8f51b692363aa765c405b03b84'
            },
            data : data
            };
            axios.request(config)
            .then((response) => {
            console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
            console.log(error);
        });
    })


}

module.exports = {
    chatGPT,
    ftosEndpoints
}
