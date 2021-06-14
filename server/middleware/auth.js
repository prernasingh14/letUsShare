import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //check whether our token or from google OAuth
        const isCustomAuth = token.length < 500;
        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;//store user's ID
        }
        else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        //if authorized then to the next tasks
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;