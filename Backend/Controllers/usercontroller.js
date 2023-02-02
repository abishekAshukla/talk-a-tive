const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const User = require("../modelsforchatapp/Usermodel");
const Blog = require("../modelsforchatapp/Blogmodel");
const generateToken = require("../configforchatapp/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phonenumber,
    password,
    pic,
  } = req.body;

  if (!name || !email || !phonenumber || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ phonenumber });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    phonenumber,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phonenumber: user.phonenumber,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const createBlog = asyncHandler(async (req, res) => {
  const { image, content } = req.body;

  if (!image || !content) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const blog = await Blog.create({
    image,
    content,
  });

  if (blog) {
    res.status(201).json({
      _id: blog._id,
      image: blog.image,
      content: blog.content,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the blog");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); // find users except the current one
  res.send(users);
});

const checkUserexistence = asyncHandler(async (req, res) => {
  const { phonenumber } = req.body;
  const userPhnumberExists = await User.findOne({ phonenumber });

  if (userPhnumberExists) {
    res.status(400);
    throw new Error("User already exists");
  } else {
    res.json({
      message: "You can signup with this",
    });
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  checkUserexistence,
  createBlog,
};
