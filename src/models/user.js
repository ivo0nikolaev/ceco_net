const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = process.env.SECRET;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 3 || value.length > 32) {
          throw new Error(
            "User name should be between 3 and 32 characters long!"
          );
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value.length > 64) {
          throw new Error("Email should be no more than 64 charecters long!");
        }
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0 || value > 120) {
          throw new Error("Age must be between 0 and 120 years");
        }
      },
    },
    phone: {
      type: String,
      validate(value) {
          if(!value == ""){
            if (value.length < 6 || value.length > 20) {
              throw new Error("Phone must be between 6 and 20 characters long!");
            }  
          }      
      },
    },
    status: {
        type: String,
        validate(value) {
          if(value.length > 240) {
              throw new Error("The status value cannto be bigger than 240 charactes!")
          }
        }
      },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 10 || value.length > 64) {
          throw new Error("The password sould be between 10 and 64 characters!");
        }
        //Add a proper password validaiton on the fron-end!!
        if (value === "password" || value === "pass") {
          throw new Error(
            "This password is too secure for our server to handle!"
          );
        }
      },
    },
    tokens: [],
  },
  {
    timestamps: true,
  }
);

// Generates a JWT token for user, when user.JWT
userSchema.methods.genAuth = async function () {
  const token = jwt.sign({ _id: this.id.toString() }, secret);

  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

// HASHING the user.password
// .pre runs when you call user.save() and checks if the password
// has been modified (or just added for a new user) and hashes it
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

//Find a user by email/password
userSchema.statics.findByCredentials = async (email, password) =>{
  const user = await User.findOne({ email })
  if (!user) {
      throw new Error('Unable to login')
  }
  // Hashing FTW!!!
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
      throw new Error('Unable to login')
  }
  
  return user
}

//sets the toJSON, whicha automatically get's called by Express, when
//sending back a JSON. Doing this for some sanitization
userSchema.methods.toJSON = function(){
  const user = this

  // using toObject() to remove all the metadata that Mongoose adds
  const publicUser = user.toObject()

  delete publicUser.password

  delete publicUser.tokens

  return publicUser
}

userSchema.pre('remove', async function (next) {
  await Photo.deleteMany({ owner : this._id})
  
  next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;
