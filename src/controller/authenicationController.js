import express from "express";
import connection from "../config/connectDB";
const { Vonage } = require('@vonage/server-sdk')
import { Auth, LoginCredentials } from "two-step-auth";
import configFB from "../config/configFB";
import passport from "passport";
const vonage = new Vonage({
    apiKey: "8ac9f4b0",
    apiSecret: "PLL4VwzCTMaJHp4W"
})

let emailOTPSender = async (req, res) => {
    LoginCredentials.mailID = "buinguyennhattan12122002@gmail.com";
    LoginCredentials.password = "vaduvhytsidprfch";
    LoginCredentials.use = false;
    try {
        const res = await Auth("buinguyennhattan12122002@gmail.com", "Company Name");
        console.log(res);
        console.log(res.mail);
        console.log(res.OTP);
        console.log(res.success);
        return res.status(200).json({
            message: "Send OTP",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Not send OTP",
        });
    }
};


let sendSMS = async (req, res) => {
    const from = "Vonage APIs";
    const to = "84966053414";
    const text = "Hello from Vonage SMS API";

    await vonage.sms.send({ to, from, text })
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    return res.status(200).json({
        message: "Send SMS",
    });
}

let facebookAuthenication = async (req, res) => {
    passport.authenticate('facebook', { scope: ['email'] });
    return res.status(200).json({
        message: "Facebook Authenication",
        data: configFB,
    });
}

module.exports = {
    sendSMS: sendSMS,
    emailOTPSender: emailOTPSender
}