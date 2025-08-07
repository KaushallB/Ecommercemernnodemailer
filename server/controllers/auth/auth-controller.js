const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../../models/User");

//register
const registerUser=async (req, res) => {
    const {userName,email,password,phone}=req.body;

      if (!userName || !email || !password || !phone) {
        return res.status(400).json({
            success: false,
            message: "All fields are required. Please fill in all fields.",
        });
    }

    try{

      const checkEmail = await User.findOne({ email });
        if (checkEmail) 
            return res.status(400).json({
                success: false,
                message: 'User already exists with the same email! Please use a new one',
            });

        const checkPhone = await User.findOne({ phone });
        if (checkPhone) 
            return res.status(400).json({
                success: false,
                message: 'User already exists with the same phone number! Please use a new one',
            });
        const hashPassword=await bcrypt.hash(password,12);
        const newUser=new User({
            userName,
            email,
            password:hashPassword,
            phone
        });

        //saving in db

        await newUser.save();
        res.status(200).json({
            success:true,
            message:"User registration successful",
        })

    }catch(e){
        console.error('Registration error',e);
        res.status(500).json({
            success:false,
            message:"Some error occured",
            error: e.message 
        });
    }
};

//login
const loginUser=async(req,res)=>{
    const {identifier,password}=req.body;

    try{

    const checkUser=await User.findOne({
            $or: [
                { email: identifier },
                { phone: identifier }
            ]
        });
    
    if(!checkUser) return res.json({
        success:false,
        message:`${identifier} is not registered. Please register first`
    })

    const checkPasswordMatch=await bcrypt.compare(password,checkUser.password);
    if(!checkPasswordMatch) return res.json({
        success:false,
        message:"Incorrect password!Please try again",
    });

    const token=jwt.sign({
        id:checkUser._id,
        role:checkUser.role,
        email:checkUser.email,
        phone:checkUser.phone,
    },'CLIENT_SECRET_KEY',{expiresIn : '60m'})

    //for dev purpose only http true and secure false
    res.cookie('token',token,{httpOnly:true,secure:false}).json({
        success:true,
        message:"User Log in successfull",
        user:{
            email:checkUser.email,
            phone:checkUser.phone,            role:checkUser.role,
            id:checkUser._id,
        }
    })

    }catch(e){
        console.log("Registration error",e);
        res.status(500).json({
            success:false,
            message:"An error occured while logging in",
            error: e.message 
        });
    }

};




//logout
const logout=(req,res)=>{
    res.clearCookie('token').json({
        success:true,
        message:'Logged Out Successfully!'
    })

}





//auth-middleware
const authMiddleware=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token) return res.status(401).json({
        success:false,
        message:"Unauthorized! Please log in first"
    });

    try{
        const decode=jwt.verify(token,'CLIENT_SECRET_KEY');
        req.user=decode;
        next();
    }catch(error){
        res.status(401).json({
            success:false,
            message:"Invalid token! Please log in again",
        });
    }
}


module.exports={registerUser,loginUser,logout,authMiddleware};