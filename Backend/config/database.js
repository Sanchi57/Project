const mongoose = require("mongoose");

uri = "mongodb+srv://suprim:G1m5YePs4bhsyuPM@sneakersapi.sjnixjg.mongodb.net/SneakersAPI?retryWrites=true&w=majority";


 const connectDatabase =( )=>{
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};





module.exports = connectDatabase;