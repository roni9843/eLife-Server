const Post = require("../models/Post");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const error = require("../utils/error");

// ^ find all user
const findUsers = () => {
  return User.find({});
};

// ^ find one user by id or any property
const findUserByProperty = async (key, value) => {
  if (key === "_id") {
    return User.findById(value);
  }
  try {
    const results = await User.aggregate([
      {
        $match: {
          phone: value,
        },
      },
      {
        $lookup: {
          from: "posts", // The name of the Post collection
          localField: "_id", // The field from the User collection
          foreignField: "postBy", // The field from the Post collection
          as: "posts", // The alias for the joined array
        },
        $lookup: {
          from: "postreactions", // The name of the Post collection
          localField: "_id", // The field from the User collection
          foreignField: "postId", // The field from the Post collection
          as: "reaction", // The alias for the joined array
        },
      },
    ]);

    const userWithPosts = results[0];
    return userWithPosts;
  } catch (err) {
    console.error("Error aggregating data:", err);
  }
};

// ^ find one teacher by userId or any property
const findAllTeacherWithUser = async () => {
  // console.log("this is all teacher and student ");

  // Use populate to replace teacher IDs with actual teacher documents
  //const usersWithTeachers = await User.find().populate("teachers");
  const allUserFind = await User.find();
  const alTeacherFind = await Teacher.find({}, { _id: 0, __v: 0 });

  return { allUserFind, alTeacherFind };
};
// ^ find one teacher by userId or any property
const findTeacherByProperty = (key, value) => {
  return Teacher.findOne({ [key]: value });
};

// ^ create a new user
const createNewUser = ({ name, phone, password }) => {
  const user = new User({
    phone,
    name,
    password,
  });

  return user.save();
};

const updateUser = async (id, data) => {
  const user = await findUserByProperty("_id", data.id);

  let userId = id;

  if (!user) {
    throw error("can not find user", 400);
  }

  try {
    const userResult = await User.findOneAndUpdate(
      { _id: userId },
      data,

      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return userResult;
  } catch (error) {
    console.error("Error:", error);

    console.log(error);

    throw error;
  }

  // ? this is marge
  // if (user.userRole === "Teacher") {
  //   const propertiesToHide = ["_id", "user", "__v"];

  //   // Create a projection object to exclude multiple properties
  //   const projection = propertiesToHide.reduce(
  //     (obj, prop) => ({ ...obj, [prop]: 0 }),
  //     {}
  //   );

  //   const teacherResult = await Teacher.findOneAndUpdate(
  //     { user: userId },
  //     data,
  //     { new: true, upsert: true, select: projection }
  //   );

  //   // Merge the properties of both documents into a single object
  //   const mergedObject = {
  //     ...userResult.toObject(),
  //     ...teacherResult.toObject(),
  //   };

  //   console.log("Merged Object:", mergedObject);

  //   return mergedObject;
  // }
  // ? end

  // return User.findByIdAndUpdate(
  //   id,
  //   {
  //     image: data.image,
  //     name: data.name,
  //     userSubject: data.userSubject,

  //     gender: data.gender,
  //     addressVillage: data.addressVillage,
  //     addressUnion: data.addressUnion,
  //     upzila: data.upzila,
  //     district: data.district,
  //     availableForTuition: data.availableForTuition,
  //     targetStudent: data.targetStudent,
  //     targetSubject: data.targetSubject,
  //   },
  //   { new: true }
  // );

  // try {
  //   // Use findOneAndUpdate with the upsert option
  //   const result = await Teacher.findOneAndUpdate({ userId }, data, {
  //     upsert: true,
  //     new: true,
  //     runValidators: true,
  //   });

  //   console.log("Result:", result);
  //   return result;
  // } catch (error) {
  //   console.error("Error:", error);
  //   throw error;
  // }
};

module.exports = {
  findUserByProperty,
  createNewUser,
  findUsers,
  createNewUser,
  updateUser,
  findTeacherByProperty,
  findAllTeacherWithUser,
};
