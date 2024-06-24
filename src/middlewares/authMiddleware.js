import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized access' });
        }
       const decoded= jwt.verify(token, process.env.JWT_SECRET)
            // req.user=decoded?.user
            console.log(decoded);
            const id=decoded?.user?.id

            req._id=id

            next();
    } catch (error) {
        console.log(error);
    }
};
