import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        //find every user in the db except for the one not logged in the app because we dont really want to see ourselves
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }}).select("-password");

        /* will find all users in  the db
          const filteredUsers = await User.find()
          */

        res.status(200).json(filteredUsers);

    }catch (error){
        console.log(" Error in getUsersForSidebar: ", error.message );
        res.status(500).json( { error: "Internal Server Error "});
    }
};