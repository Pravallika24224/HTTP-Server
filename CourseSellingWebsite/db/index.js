const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb+srv://pravallika:Pravallika%4010@cluster0.kxj574s.mongodb.net/course-selling-website")

// Define schemas
const AdminSchema = new mongoose.Schema({
  userName: String,
  password: String
});

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
  purchasedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String

});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
  Admin,
  User,
  Course
}