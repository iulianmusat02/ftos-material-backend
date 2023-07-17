const express = require('express');
const router = express.Router();
const mth = require("./methodsLib.js");
const jwt = require('jsonwebtoken');
const openai = require("./openai.js")
require('dotenv').config();


router.post('/insertUIComponent', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const result =  await mth.setUIComponent(req.body);
    if(result) {
        res.status(200).json(result);
    } else {
        res.status(400);
    }
})
router.post('/deleteUIComponent', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const result = await(mth.deleteUIComponent(req.body));
    if(result) {
        res.status(200).json(result);
    } else {
        res.status(400);
    }
})
router.post('/getUIComponents', async(req,res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const result =  await mth.getUIComponents(req.body);
    if(result) {
        res.status(200).json(result);
    } else {
        res.status(400);
    }
})
router.post('/updateUIComponent', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const result = await mth.updateUIComponent(req.body);
    if(result) {
        res.status(200).send(result);
    } else {
        res.status(400);
    }
})
router.get('/getUIComponent', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const result = await mth.getUIComponent(req.query)
    if(result) {
        res.status(200).json(result);
    } else {
        res.status(400);
    }
});
router.post('/checkvalidtoken', async(req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.', authentication : false });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(200).json({ message: 'Invalid token.', authentication : false });
      } else {
        return res.status(200).json({ message: 'Authenticated', authentication : true});
      }
    });
});
router.post('/openai/chat',  async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const body = req.body;
    const result = await openai.chatGPT(body);
    // openai.ftosEndpoints();
    
    console.log(result);
    res.status(200).send(result);
});
router.post('/registerUser', async (req, res) => {
    const bodyParam = req.body;
    try {
        const result = await mth.registerUser(bodyParam);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});
router.post('/confirmAccount', async (req, res) => {
    const bodyParam = req.body;
    try {
        const result = await mth.confirmAccount(bodyParam);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(result);

    } catch {
        console.log(error);
    }
});
router.post('/authentication', async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { email, password } = req.body; // Destructure the username and password from the request body
    if(await mth.verifyAuthCredentials(email, password)) {
        res.status(200);
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE});
        res.json({ token });
    } else {
        res.status(401).send({message : 'Authentication Failed'});
    }
  });

module.exports = router;