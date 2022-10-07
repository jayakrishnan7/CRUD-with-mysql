import express, { Request, Response } from "express";
import moment from "moment";
import UserModel from "../models/users";
// import * as excelJS from 'exceljs'

const reader = require("xlsx");

// const { google } = require('googleapis')
const nodemailer = require("nodemailer");
let createTransport = require("nodemailer");

// const CLIENT_ID = '454044042835-55jg03pmevrn904aagqcjllb1o060iso.apps.googleusercontent.com';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//04FN8QvpjOLbGCgYIARAAGAQSNwF-L9Irsj9ZGEQqV6Xw48ZKazHqvoWH3Lg7KMAxMa47RLuTViqxfCSpbs1NqWXpb_P96hbahHE';


// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })


// import {createTransport} from 'nodemailer';

// const excelUser = require('../models/excelUser')
const excelJS = require("exceljs");

//importing crypto module to generate random binary data
var CryptoJS = require("crypto-js");

// ....... all users fetching....................
const allUsers = async (req: Request, res: Response) => {
  let skip = 0;
  let limit = 10;

  let myData = await UserModel.find().skip(skip);
  // .limit(limit);

  res.json({
    message: "Users Page",
    myData: myData,
    // newUserData,
  });
};

// .......  user  sign up   ....................
const createPerson = async (req: Request, res: Response) => {
  try {
    const { name, classNumber, email, password, phone, dob, photo, isDeleted } =
      req.body;

    const pswd = req.body.password;

    // ...........................................password.encrypting............................................
    var ciphertext = CryptoJS.AES.encrypt(pswd, "crud secret 763").toString();

    console.log("encrypted text ....... cipherrrrrr", ciphertext);

    const dateIn = req.body.dob;

    const newDate = moment.utc(dateIn, "DD/MM/YYYY").toDate();
    moment().format();

    // console.log('newwwwwwwwww', newDate);

    const userData = {
      name: req.body.name,
      classNumber: req.body.classNumber,
      email: req.body.email,
      password: ciphertext,
      phone: req.body.phone,
      dob: newDate,
      photo: req.body.photo,
      isDeleted: req.body.isDeleted,
    };

    // console.log("userdddddddddddd", userData);

    const user = await UserModel.create(userData);

    console.log("uuuuuu  user", user);

    // ...........................................password.decrypting.....................................................

    const decryptUser = userData.password;

    // console.log('deccccccrypt userrr', decryptUser);

    var bytes = CryptoJS.AES.decrypt(decryptUser, "crud secret 763");
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    // console.log("decrypted password..........", originalText);

    // ------------------------------------------------------------------------------------------------------------------

    res.status(201).json({ user: user._id, created: true });
  } catch (error) {
    console.log("errrrr", error);
    res.status(500).json({
      error,
      created: false,
    });
  }
};

// ....... edit user....................
const updateUser = async (req: Request, res: Response) => {
  try {
    // console.log("idsssssssss", req.body);
    const { name, classNumber, email, password, phone, dob, photo, isDeleted } =
      req.body;

    const data = await UserModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "User profile updated successfully..." });
  } catch (error) {
    console.log(error);
    res.status(500).send("Updation failed!!");
  }
};

// ....... edit user with classnumber....................
const updateTheUser = async (req: Request, res: Response) => {
  try {
    console.log("updating userrr");

    const classNumber: any = req.query.classNumber;
    const name: any = req.query.name;

    const classNum = parseInt(classNumber);

    // console.log('reaach', typeof(classNum));

    if (!classNum && !name) {
      console.log("Please fill all the details....");
      res.status(500).send("Please fill all the details....");
    } else if (!classNum) {
      console.log("class null");
      res.status(500).send("Please provide the class number");
    } else if (!name) {
      console.log("name null");
      res.status(500).send("Please provide the name");
    } else if (classNum && name) {
      const update = await UserModel.updateMany(
        { name: { $regex: name }, classNumber: classNum },
        { $inc: { classNumber: 1 } }
      );

      const updatedData = await UserModel.find({
        name: { $regex: name },
        classNumber: classNum + 1,
      });

      // console.log("updatedddd", updatedData);

      res.json({ message: "success. class incremented...", data: updatedData });
    }
  } catch (error) {
    res.status(500).send("Class not incremented. error!!!");
  }
};

// ........permanent delete user...................
// const deletePerson = async (req: Request, res: Response) => {
//   try {
//     await UserModel.findByIdAndDelete(req.params.id);
//     res.send("User deleted successfully...");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// };

// .......soft delete user...................
const deletePerson = async (req: Request, res: Response) => {
  try {
    const person: any = await UserModel.updateOne(
      { _id: req.params.id },
      { $set: { isDeleted: true } }
    );

    res.json({
      message: "User deleted Successfully..",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// ....... search users....................
const searchUsers = async (req: Request, res: Response) => {
  try {
    let userData = req.body;
    // let skip = userData.skip || 0;
    let limit = userData.limit || 10;
    let advanceQuery: any;
    advanceQuery = await createAdvanceQuery(userData);
    // console.log("advance query", advanceQuery);

    let finalQuery = {};
    // console.log(advanceQuery.finalFilterQuery);
    if (advanceQuery.finalFilterQuery) {
      finalQuery = JSON.parse(`{${advanceQuery.finalFilterQuery}}`);
    }
    // console.log(JSON.stringify(finalQuery));

    // console.log('ffffffffff', finalQuery);

    let totalCount = await UserModel.find(finalQuery).count();
    let users = await UserModel.find(finalQuery).limit(limit);

    // console.log("uuuuusers", users);

    // console.log('nameee', users[0].password);

    // const newUser  = {
    //   name : users[0].name,
    //   classNumber : users[0].classNumber,
    //   email : users[0].email,
    //   password : users[0].password,
    //   phone : users[0].phone,
    //   dob : users[0].dob,
    //   photo: users[0].photo
    // }

    if (users.length == 0) {
      res.send("No users with this details!!!");
    } else {
      res.json({
        message: "success fetching",
        data: users,
        totalCount,
      });
    }
  } catch (error) {
    console.log("errorrrrrrr", error);
    res.status(500).send(error);
  }
};

// function of searching users...................
function createAdvanceQuery(reqData: any) {
  return new Promise((res, rej) => {
    let appendQuery = "";

    let isEmpty = Object.values(reqData).every((x) => x === null || x === "");
    let objKeys = Object.keys(reqData);

    if (isEmpty) {
      res("");
      return;
    }

    for (let i = 0; i < objKeys.length; i++) {
      //  console.log('obbbbbbbbbb', objKeys[i]);
      //  console.log('occcccccccc', reqData[objKeys[i]]);

      if (reqData[objKeys[i]] != null && reqData[objKeys[i]] != undefined) {
        if (objKeys[i] == "classNumber" && reqData[objKeys[i]] != "") {
          // console.log('qqqqqqqqq', reqData[objKeys[i]]);

          appendQuery += `"classNumber": ${reqData[objKeys[i]]}  ,`;
          // console.log('insideeeeee entereddddddd');
        } else if (objKeys[i] == "searchText" && reqData[objKeys[i]] != "") {
          // console.log('else if entered...');

          appendQuery += `"$or": [
            
            {"name": { "$regex" : "${reqData[objKeys[i]]}", "$options": "i" }},
            {"email":{ "$regex" : "${reqData[objKeys[i]]}", "$options": "i" }},
            {"phone":{ "$regex" : "${reqData[objKeys[i]]}", "$options": "i" }}
          
              ] ,`;
        }
      }
    }

    let n = appendQuery.lastIndexOf(",");
    let finalFilterQuery = appendQuery.slice(0, n);
    // console.log(JSON.stringify(finalFilterQuery));
    res({ finalFilterQuery: finalFilterQuery });
  });
}

const exportUsers = async (req: Request, res: Response) => {
  let fromDate: any = req.query.dobFrom;
  let lastDate: any = req.query.dobTo;

  // console.log("reeeeeeeeeeeeee.........", fromDate, lastDate);

  const fDate = moment.utc(fromDate, "YYYY/MM/DD").toDate();
  moment().format();

  const workbook = new excelJS.Workbook();

  const worksheet = workbook.addWorksheet("excelUsers");

  // const path = "../../public/assets/";

  // console.log("path addeddd...........", path);

  worksheet.columns = [
    { header: "S no.", key: "_id", width: 10 },
    { header: "class no.", key: "classNumber", width: 10 },
    { header: "Name", key: "name", width: 10 },
    { header: "Email Id", key: "email", width: 10 },
    // { header: "Password", key: "password", width: 10 },
    { header: "Phone", key: "phone", width: 10 },
    { header: "Date of Birth", key: "dob", width: 10 },
    // { header: "Photo", key: "photo", width: 10 },
    { header: "delete status", key: "isDeleted", width: 10 },
  ];

  let counter = 1;

  // lastDate = lastDate + 'T23:59:59';

  const User = await UserModel.find({
    //query today up to tonight
    dob: {
      $gte: fromDate,
      $lt: lastDate,
    },
  });

  // console.log("user coming...........", User);

  User.forEach((user) => {
    user.classNumber = counter;
    worksheet.addRow(user);
    counter++;
  });

  worksheet.getRow(1).eachCell((cell: any) => {
    cell.font = { bold: true };
  });

  try {
    // console.log("reaaaaaaaaaachhhhhhhh.........");

    const data = await workbook.xlsx.writeFile(
      "excelSheet " + fromDate + "-" + lastDate + ".xlsx"
    );


    // -----------------------------------------------------------------------------------------------------------------------


    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jayakrishnan@scriptlanes.com",
        pass: "sivzgeycbgqpmsnz"
      }
    } )

    let details = {
      from: "jayakrishnan@scriptlanes.com",
      to: "jayakrishnansfc43@gmail.com",
      subject: "Student details in Excel file",
      text: "Testing out first sender"
    }

    mailTransporter.sendMail(details, (err: any) => {
      if(err) {
        console.log('There is an error ...', err);
        
      }
      else {
        console.log('email has sent!');
        
      } 
    })

// -----------------------------------------------------------------------------------------------------------------------


    // async function main() {
    //   // Generate test SMTP service account from ethereal.email
    //   // Only needed if you don't have a real mail account for testing
    //   let testAccount = await nodemailer.createTestAccount();
    
    //   // create reusable transporter object using the default SMTP transport
    //   let transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user: testAccount.user, // generated ethereal user
    //       pass: testAccount.pass, // generated ethereal password
    //     },
    //   });
    
    //   // send mail with defined transport object
    //   let info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    //   });
    
    //   console.log("Message sent: %s", info.messageId);
    //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    //   // Preview only available when sending through an Ethereal account
    //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // }
    
    // main().catch(console.error);


// -----------------------------------------------------------------------------------------------------------------------



    // const buffer = await workbook.xlsx.writeBuffer('excelSheet ' + fromDate + '-' + lastDate + '.xlsx');

    // console.log('bbbbbbbbb', buffer);

    // const transporter = createTransport({
    //   host: 'excel.students.com',
    //   port: '587',
    //   secure: false,
    //   auth: {
    //       user: 'username',
    //       pass: 'password',
    //   },
    // });

    // const mailOptions = {
    //   from: 'jayakrishnansfc43@gmail.com',
    //   to: ['jayakrishnan800@gmail.com', 'jayakrishnan800@gmail.com'],
    //   subject: 'excelFile',
    //   html: 'content',
    //   attachments: [
    //       {
    //           buffer,
    //           content: buffer,
    //           contentType:
    //               'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //       },
    //   ],
    // };
    // await transporter.sendMail(mailOptions);


// -----------------------------------------------------------------------------------------------------------------------


    res.send({
      status: "success",
      message: "file successfully downloaded",
      // path: `${path}/users.xlsx`,
    });

    // })
  } catch (error) {
    res.send({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// -----------------------------------------------------------------------------------------------------------------------


 

// async function sendMail() {
 
//   try {

    
//     console.log('innnnnnnnnn');
    
//     const accessToken = await oAuth2Client.getAccessToken()
    
//     console.log('startttttttt', accessToken);

//     const transport = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: 'jayakrishnansfc43@gmail.com',
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken
        
//       }
//     })
    
//     console.log('ttttttttt', transport);
    

//     const mailOptions = {
//       from: 'JAYAKRISHNAN 📧 <jayakrishnansfc43@gmail.com>',
//       to: 'jayakrishnan@scriptlanes.com',
//       subject: "Hello from gmail using API",
//       text: "Hello from gmail email using API",
//       html: "<h1>Hello from gmail email using API</h1>",
//     };

//     const result = await transport.sendMail(mailOptions)

//     console.log('rrrrrrrrrrrrrrr', result);

//     return result;

//   } catch (error) {
//     console.log('error', error);
//     return error
//   }
// }

// sendMail().then(result => console.log('Email sent ... ', result))
// .catch(error => console.log('errrrrrrr', error.message))

 
// -----------------------------------------------------------------------------------------------------------------------



export {
  allUsers,
  createPerson,
  updateUser,
  updateTheUser,
  deletePerson,
  searchUsers,
  exportUsers,
};
