import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  avatar: {
    type: String,
    default: "https://www.gravatar.com/avatar/"
  },
  mobile: {
    type: String,
    default: null
  },
  refresh_token: {
    type: String,
    default: ""
  },
  verify_email: {
    type: Boolean,
    default: false
  },
  last_login_date: {
    type: Date,
    default: ""
  },
  status : {
    type : String,
    enum : ['Active', 'Inactive','Suspension'],
    default: "Active" 
  },
  address_details : [
    {
        type : mongoose.Schema.ObjectId,
        ref: 'address'
    }
  ],
  shopping_cart : [
    {
        type : mongoose.Schema.ObjectId,
        ref: 'cart_product'
    }
  ],
  orderHistory : [
    {
        type : mongoose.Schema.ObjectId,
        ref: 'order'
    }
  ],
  forgot_password_otp : {
    type : String,
    default : null
  },
  forgot_password_otp_time : {
    type : Date,
    default : null
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER" ],
    default: "USER"
  }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
