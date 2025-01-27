import  User  from "../Schema/User.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { getAuth } from "firebase-admin/auth";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const generateUsername = (Email) => {
  const username = Email.split("@")[0] + nanoid().substring(0, 5);
  return username;
};

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.personal_info.email,
    username: user.personal_info.username,
  };
  const Token = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN_KEY, {
    expiresIn: '48d',
  });

  return Token;
};

const formatDataSend = (user) => {
  const token = generateToken(user);

  return {
    fullname: user.personal_info.fullname,
    email: user.personal_info.email,
    username: user.personal_info.username,
    profile_img: user.personal_info.profile_img,
    accessToken: token,
  };
};

const signUp = async (req, res) => {
  try {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(401).json({
        message: "All fields are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(403).json({
        error: "email is invalid",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(403).json({
        error:
          "Password must have 6 to 20 characters as well as alteat 1 lowercase,1 uppercase and a numeric",
      });
    }
    const ExistedUser = await User.findOne({ "personal_info.email": email });

    if (ExistedUser) {
      return res.status(401).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = generateUsername(email);

    const user = new User({
      personal_info: {
        fullname,
        username,
        email,
        password: hashedPassword,
      },
    });
    user
      .save()
      .then(async (user) => {
        return res.status(200).json(await formatDataSend(user));
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.log("sign-in error", error);
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        error: "Email and password, Both are required",
      });
    }

    await User.findOne({ "personal_info.email": email }).then((user) => {
      if (!user) {
        return res.status(403).json({
          error: "Email not found",
        });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "something went wrong while checking password",
          });
        }
        if (!result) {
          return res.status(403).json({
            error: "password is Incorrect",
          });
        }

        return res.status(200).json(formatDataSend(user));
      });
    });
  } catch (error) {
    console.error("singIn error", error);
  }
};

const googleAuth = (req, res) => {
  const { accessToken } = req.body;

  getAuth()
    .verifyIdToken(accessToken)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        // .select(
        //   "personal_info.fullname personal_info.username _id personal_info.profile_img  google_auth"
        // )
        // .then((u) => {
        //   return u || null;
        // });

      if (user) {
        // login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email is signed up without google please enter password to access the your account",
          });
        } else {
          // Login Google user
          let user = await User.findOne({ "personal_info.email": email })
      return res.status(200).json(formatDataSend(user));
        }
      }
      else{
        let username = generateUsername(email);
       let newUser = new User({
          personal_info: {
            fullname: name,
            email,
            profile_img: picture,
            username,
          },
          google_auth: true,
        });
        await newUser.save().then((u) => {
          newUser = u;
        });
        return res.status(200).json(formatDataSend(newUser))
      }

    })
    .catch((err) => {
      console.log(err,"google Auth Error");
      return res.status(500).json({ error: "failed to authenticate you with google. Try with another google account" });
    });
};

const uploadBanner=async(req,res)=>{
  if (!req.file) {
    console.log('file',req.file);
    return res.status(400).json({ url: 'file is not uploaded' });
  }
  const filePath=req.file.path
 console.log('file path:',filePath);
const result=await  uploadOnCloudinary(filePath)
return res.status(200).json({ url: result })
}

export { signUp, signIn, googleAuth,uploadBanner };
