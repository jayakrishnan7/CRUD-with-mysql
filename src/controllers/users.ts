import express, { Request, Response } from "express";
import UserModel from "../models/users";

// import { createUser, findAndUpdate, findUser, deleteUser } from '../services/users.service';

// const homeDetail = async (req: Request, res: Response) => {
//   let myData = await UserModel.find();

//   res.json({
//     message: "Users Page",
//     myData: myData,
//   });
// };

const homeDetail = async (req: Request, res: Response) => {
  // let myData = await UserModel.find();
  // res.json({
  //   message: "Users Page",
  //   myData: myData,
  // });
};

const createPerson = async (req: Request, res: Response) => {
  try {
    const { name, classNumber, email, password, phone, dob, photo } = req.body;

    console.log("cameeeee");
    const user = await UserModel.create(req.body);
    console.log("uuuuuu  user", user);

    res.status(201).json({ user: user._id, created: true });
  } catch (error) {
    console.log("errrrr", error);
    // const errors = handleErrors(error);
    res.json({
      // message: "User email already exist",
      error,
      // errors,
      created: false,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);

    const user = await UserModel.findById(req.params.id);
    res.json({ user });
  } catch (error: any) {
    console.log(error.message);
  }
};

const userUpdating = async (req: Request, res: Response) => {
  try {
    console.log("idsssssssss", req.body);
    const { name, classNumber, email, password, phone, dob, photo } = req.body;

    await UserModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      message: "User Profile Updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Updation failed" });
  }
};

const deletePerson = async (req: Request, res: Response) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const searchUsers = async (req: Request, res: Response) => {
  try {
    let userData = req.body;
    let skip = userData.skip || 0;
    let limit = userData.limit || 10;
    let advanceQuery: any;
    advanceQuery = await createAdvanceQuery(userData);
    console.log('addvv', advanceQuery);

    let finalQuery = {};
    console.log(advanceQuery.finalFilterQuery);
    if (advanceQuery.finalFilterQuery) {
        finalQuery = JSON.parse(`{${advanceQuery.finalFilterQuery}}`);
    }
    console.log("loggggg", finalQuery.toString());
    // let users = await UserModel.find(finalQuery).count();
    let users = await UserModel.find(finalQuery)
    // .sort({ createdAt: -1 })
    // .skip(skip).limit(limit);
    // return { users };
    res.json({
      message: "success fetching",
      data: users
    })
    // return true;
    

  } catch (error) {
    console.log('errorrrrrrr', error);
    
  }

};

  // try {
  //   // const users = await UserModel.find();
  //   // console.log("userssssssssss", users);

  //   const userClass = {
  //     classNumber: req.body.classNumber,
  //   };

  //   const userDetails = req.body.userDetails;

  //   // console.log("rrr", userClass);
  //   // console.log("cccc = ", userDetails);

  //   async function filtering(cls: any, data: any) {
  //     // console.log("cls", cls);
  //     // console.log("data", data);
  //     // console.log("usersdb", db);

  //     if (data) {
  //       const userCheck = await UserModel.find({
  //         $and: [
  //           cls,
  //           {
  //             $or: [{ name: data }, { email: data }, { phone: parseInt(data) }],
  //           },
  //         ],
  //       });
  //       console.log("userchecking with userdetails", userCheck);

  //       res.json({
  //         message: "Student Details from searchtext",
  //         data: userCheck,
  //       });
  //     } else {
  //       const user = await UserModel.find(cls);
  //       console.log("user with class", user);

  //       res.json({
  //         message: "Student Details from class",
  //         data: user,
  //       });
  //     }

  //     //   for (let i = 0; i < db.length; i++) {
  //     //     // console.log("dbbbbbbb", db[i]);

  //     //     if (data) {
  //     //       UserModel.find({});
  //     //       console.log("matched user details", db[i]);

  //     //       //   return db[i];
  //     //     }

  //     //     // if (data == name || data == email || data == phone) {
  //     //     //   UserModel.find({
  //     //     //     tags: { $elemMatch: {"data" : "data"} }
  //     //     //   });
  //     //     //   console.log("matched user det", db[i]);

  //     //     //   //   return db[i];
  //     //     // }
  //     //     else if (cls == db[i].classNumber) {
  //     //       console.log("matched cls", db[i]);

  //     //       //   return db[i];
  //     //     }
  //     //     // else if (data[db[i]] == data) {

  //     //     // }
  //     //     else {
  //     //       console.log("no student from this address!!!");
  //     //     }
  //     //   }
  //   }

  //   filtering(userClass, userDetails);

  //   // if (!userClass == undefined) {

  //   //     console.log('class not given');

  //   //     res.status(400).json({ message: "Class can not be empty!!" });
  //   // }

  //   // if(!req.body) {
  //   //     res.json({
  //   //         message: "Please Fill the column"
  //   //     })
  //   // }
  // } catch (error) {
  //   console.log(error);
  // }


function createAdvanceQuery(reqData: any) {
  return new Promise((res, rej) => {
    let appendQuery = "";

    let isEmpty = Object.values(reqData).every((x) => x === null || x === "");
    let objKeys = Object.keys(reqData);

    if(isEmpty) {
      res("");
      return;
    }

    for(let i = 0; i<objKeys.length; i++) {
    //  console.log('obbbbbbbbbb', objKeys[i]);
    //  console.log('occcccccccc', reqData[objKeys[i]]);

     if (reqData[objKeys[i]] != null && reqData[objKeys[i]] != undefined 
      // && objKeys[i] != "skip" && objKeys[i] != "limit" && objKeys[i] != "sort" 
      //  && objKeys[i] != "orderBy"
       ) 
      {

        if (objKeys[i] == "classNumber" && reqData[objKeys[i]] != "") {
          // console.log('qqqqqqqqq', reqData[objKeys[i]]);
        
          appendQuery +=   `"classNumber": { "$in":  ${reqData[objKeys[i]]} } ,`
          // console.log('insideeeeee');
        }
        else if (objKeys[i] == "searchText" && reqData[objKeys[i]] != ""){

        // console.log('else if entered...');
        
        
          appendQuery += `"$or": [
            
            {"name":{ "$regex" : "${reqData[objKeys[i]]}", "$options": "i" }},
            {"email":{ "$regex" : "${reqData[objKeys[i]]}", "$options": "i" }},
            {"phone":{ "$regex" : "${reqData[objKeys[i]]}", "$options": "i" }}
          
              ] ,`
          
            
        }

      }
    }           
      
  // console.log(JSON.stringify(appendQuery))
  // console.log('appendqueryyyyyyy');
      
  // res({appendQuery})

  let n = appendQuery.lastIndexOf(",");
  let finalFilterQuery = appendQuery.slice(0, n);
  console.log(JSON.stringify(finalFilterQuery))
  res({ finalFilterQuery: finalFilterQuery });

    })

  }


export {
  homeDetail,
  createPerson,
  updateUser,
  userUpdating,
  deletePerson,
  searchUsers,
};
