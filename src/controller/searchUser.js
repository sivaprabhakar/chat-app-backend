import UserModel from "../models/User.js";

const searchUser = async(req,res)=>{
    try {
        const { search } = req.body

        const query = new RegExp(search,"i","g")

        const user = await UserModel.find({
            "$or" : [
                { name : query },
                { email : query }
            ]
        }).select("-password")

        return res.json({
            message : 'all user',
            data : user,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

export default searchUser