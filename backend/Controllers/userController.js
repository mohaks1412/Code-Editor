import User from "../Models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import storageService from "../appwriteClient.js"

const generateUsername = async (name) => {
  const base = name.trim().toLowerCase().replace(/\s+/g, '');
  let username;
  let isUnique = false;

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    username = `${base}${randomNum}`;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return username;
};




const generateToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public

const registerUser = async (req, res)=>{
    try{
        
        const {name, email, password} = req.body;

        if(!name || !email || !password){
           return res.status(400).json({ message: "Please fill all fields" });
        }
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const username = await generateUsername(name);

        const user = await User.create({
            name,
            username,
            email,
            passwordHash: hashedPassword,
        });

        

        return res.status(201).json({
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            bio: user.bio,
            skills: user.skills,
            github: user.github,
            website: user.website,
        });
    }
    catch(error){
        
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({message : "Both Email and Password are required"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "The user Doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if(!isMatch){
            return res.status(401).json({message : "Invalid credentials"});
        }

        const token = generateToken(user._id);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only send cookie over HTTPS in production
            sameSite: 'None', // helps protect from CSRF
            maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
        });

        return res.status(200).json({
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            bio: user.bio,
            skills: user.skills,
            github: user.github,
            website: user.website,
        });
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}



const logoutUser = (req, res) => {
  res.cookie('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 0,
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

// controllers/userController.js
const updateUserProfile = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id);

    
    if (!user) return res.status(404).json({ message: "User not found" });


    
    console.log(req.file);
    
    if(user.avatarId){
      
      await storageService.deleteFile(user.avatarId);

    }
    const avatarFile = req.file ? await storageService.createFile(req.file) : null;

    
    const avatarId = avatarFile ? avatarFile.$id : null;
    // Update fields if provided
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    user.github = req.body.github || user.github;
    user.website = req.body.website || user.website;
    user.avatarId = avatarId || user.avatarId;

    
    const updatedUser = await user.save();


    const profileImage = updatedUser.avatarId ? storageService.viewFile(updatedUser.avatarId) : null;
    
    console.log("Saving User : ", user);
    res.json({id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        github: updatedUser.github,
        website: updatedUser.website,
        profileImage: profileImage});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMe = async(req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
    const user = req.user;


    
  // Return only the fields your frontend expects
  const userData = {
    id: user._id.toString(),
    username: user.username || "",
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    skills: user.skills || [],
    github: user.github || "",
    website: user.website || "",
    profileImage: user.avatarId || null,
  };

  res.json(userData);
};

export {updateUserProfile, registerUser, loginUser, logoutUser, getMe};