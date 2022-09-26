import mongoose, {connect} from 'mongoose'

function connects () {
    return connect('mongodb://localhost:27017/crud')
    .then(() => {
        console.log('DB connected successfully');
        
    })
    .catch((error: any) => {
        console.log(error);
        
    })
}


export default connects;