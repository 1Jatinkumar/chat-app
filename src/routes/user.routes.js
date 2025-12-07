import { Router } from "express";

const userRoute = Router();

userRoute.get('/', (req, res)=>{
    res.send('hello from user get');
})
// userRoute.post('/',)
// userRoute.put('/',)
// userRoute.patch('/',)
// userRoute.delete('/',)

export default userRoute;