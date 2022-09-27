import express, {Request, Response} from 'express';
import { createPerson, deletePerson, searchUsers, allUsers, updateUser, updateTheUser } from "../controllers/users";

const router = express.Router();

router.post('/register', createPerson)

router.put("/updateUser/:id", updateUser);

// new route....
router.put("/updateUserWithClass", updateTheUser);
//...............

router.delete("/delete/:id", deletePerson);

router.post('/search', searchUsers);

router.get('/', allUsers)



export {
    router
}