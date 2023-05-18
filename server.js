 const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');



const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const userController = require('./Controller/userController')
const taskController = require('./Controller/taskController')


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//USER API
app.post('/api/register',userController.uploadUserImage,userController.register)
app.post('/api/login',userController.login);
app.post('/api/logout',userController.logout);

//TASK API
app.post('/api/createTask',userController.isLoggedIn,taskController.setUserId,taskController.createTask)
app.get('/api/getTasks',userController.isLoggedIn,taskController.getTasks)
app.patch('/api/tasks/:taskId',userController.isLoggedIn,taskController.updateTask)



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

module.exports = app;