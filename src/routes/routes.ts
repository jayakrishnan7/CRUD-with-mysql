import express, {Request, Response} from 'express';
import { createPerson, deletePerson, searchUsers, allUsers, updateUser, updateTheUser } from "../controllers/users";

const router = express.Router();

router.post('/register', createPerson)

router.put("/updating/:id", updateUser);

// new route....
router.put("/updateUser", updateTheUser);
//...............

router.delete("/delete/:id", deletePerson);

router.post('/search', searchUsers);

router.get('/', allUsers)



export {
    router
}