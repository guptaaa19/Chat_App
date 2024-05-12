import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res) => {
    try{
        const { fullName, username, password, confirmPassword, gender} = req.body;

        if(password != confirmPassword ){
            return res.status(400).json({error: "Passwords don't match"});
        }

        const user = await User.findOne({username});

        if(user){
            return res.status(400).json({error: "Username already exits"});
        }

        //Hashed password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //avatars for profilepic
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;


//-----------------if user does not exsit then we try to create new user------------------------

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        if(newUser){
            //generate the JWT token here
            generateTokenAndSetCookie(newUser._id, res);


            //saving the new user to the database
            await newUser.save();


            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({ error: "Invalid user data"});
        }

    }catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
};

export const login = async (req,res) => {
    try{
        const { username, password } = req.body; //get input from the user
        const user = await User.findOne({ username }); // check if this user exits or not
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "" ); // check if this password iis correct or not

        if(!user || !isPasswordCorrect ){
            return res.status(400).json({ error: "Invalid username or password" });
        } // if any of them is false  return this error

        generateTokenAndSetCookie( user._id, res); // sending payload andd response // generating token and set cookie

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic:  user.profilePic,
        }); // then just sending this response

    }catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
};

export const logout = (req,res) => {
    try{
        res.cookie("jwt", "", {maxAge : 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }catch (error) {
        console.log(" Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};