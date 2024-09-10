const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const db_link = 'mongodb+srv://Samiksha:admin@cluster0.5yw47.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, required: true, unique: true, validate: function () {
            return emailValidator.validate(this.email);
        }
    },
    password: { type: String, required: true, minLength: 8 },
    confirmPassword: {
        type: String, required: true, minLength: 8, function() {
            return this.confirmPassword == this.password
        }
    }
})

// userSchema.pre('save',function(){
//     console.log('before saving in db',this);
// })

// userSchema.post('save',function(doc){
//     console.log('after saving in db',doc);
// })

userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.confirmPassword = undefined; // Remove confirmPassword before saving
        next(); // Proceed to save the user
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
});

// userSchema.pre('save', function () {
//     this.confirmPassword = undefined;
// })

// userSchema.pre('save',async function(){
//     let salt=await bcrypt.genSalt();
//     let hashedString=await bcrypt.hash(this.password,salt);
//     this.password=hashedString;
//     console.log(hashedString);
// })

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;

// (async function createUser(){
//     let user={
//         name:"Ansh",email:"abcd@gmail.com",
//         password:"12345678",confirmPassword:"12345678"
//     };
//     let data= await userModel.create(user);
//     console.log(data);
// })();


mongoose.connect(db_link)
    .then(function (db) {
        // console.log(db);
        console.log('db connected');
    })
    .catch(function (err) {
        console.log(err);
    })