import express, {Request, Response} from 'express';
import { createPerson, deletePerson, searchUsers, homeDetail, updateUser, userUpdating } from "../controllers/users";

const router = express.Router();

router.post('/register', createPerson)

router.get('/update/:id', updateUser)

router.put("/updating/:id", userUpdating);

router.delete("/delete/:id", deletePerson);

router.post('/search', searchUsers);

// router.post('/pagination', searchUsers);

router.get('/', homeDetail)



export {
    router
}