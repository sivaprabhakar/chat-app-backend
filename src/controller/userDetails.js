import getUserDetailsFromToken from "../helper/getUserToken.js";

const userDetails = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1] || "";
        const user = await getUserDetailsFromToken(token);

        if (user.logout) {
            return res.status(401).json({
                message: user.message,
                data: user
            });
        }

        return res.status(200).json({
            message: "User details",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

export default userDetails;
