import jwt from "jsonwebtoken";

export const employerMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // check kro agr headers exist nhi krta aur headers me bearer exist nhi krta to unauthorized return kro
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // token Bearer ke saath aarha hai to tm token se Beared ko split krke sirf token ko nikaal rhe ho...
        const token = authHeader.split(" ")[1];

        // Jwt se token verify ho rha hai..token expiry to nhi invalid to nhi..
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // token ke andr jo employerId tha usko req.employer me store kr rhe ho...
        // Ab aage ke controllers ko pata hoga kaunsa employer request kar raha hai...
        if (decoded.role !== "employer") {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.userId = decoded.id;
        req.role = decoded.role;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Token invalid or expired" });
    }
}