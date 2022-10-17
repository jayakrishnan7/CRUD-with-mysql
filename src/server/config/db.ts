import {connect} from 'mongoose'

function connects () {
    
    return connect('mongodb+srv://jayakrishnan:VROLYJriRQDoDhHj@crud.xfz2ixo.mongodb.net/test')
    .then(() => {
        console.log('DB connected successfully');
        
    })
    .catch((error: any) => {
        console.log(error);
        
    })
}



// function connects () {
    
//     return  global.mysqldbconnection = {
//         query: function () {
//           var sql_args: any = [];
//           var args: any = [];
//           for (var i = 0; i < arguments.length; i++) {
//             args.push(arguments[i]);
//           }
//           var callback = args[args.length - 1]; //last arg is callback
//           pool.getConnection(function (err: any, connection: any) {
//             if (err) {
//               console.log(err);
//               return callback(err);
//             }
//             if (args.length > 2) {
//               sql_args = args[1];
//             }
//             connection.query(args[0], sql_args, function (err: any, results: any) {
//               connection.release(); // always put connection back in pool after last query
//               if (err) {
//                 console.log(err);
//                 return callback(err);
//               }
//               callback(null, results);
//             });
//           });
//         }
//       };
      
      
//     .then(() => {
//         console.log('DB connected successfully');
        
//     })
//     .catch((error: any) => {
//         console.log(error);
        
//     })
// }


export default connects;





