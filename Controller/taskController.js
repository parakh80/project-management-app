const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const app = require('./../server')

const Task = require('./../model/taskModel')



exports.setUserId = (req, res, next) => {
    if (!req.body.user) req.body.user = req.id;
    next();
  };


// Create a task
exports.createTask = async (req, res) => {
  try{
  
      const task = await Task.create(req.body);
      res.status(201).json({message: 'Task created successfully',task});
    } catch (error) {
      res.status(500).json({ error: 'Could not create task' });
    }
  };


exports.updateTask = async (req, res) => {

    try{
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!task) {
        return res.status(404).json({ message: 'task not found' });
      }
  
    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
}catch (error) {
    res.status(500).json({ error: 'Somthing went wrong' });
 }
};
  



// Fetch tasks based on filters
exports.getTasks =  async (req, res) => {
 const { label, estimateHours, status, fromDate, toDate, search} = req.query;
 const userId = req.id;
  let query = { user: userId };

      if (label) {
        query.label = label;
      }
  
      if (estimateHours) {
        query.estimateHours = estimateHours;
      }
  
      if (status) {
        query.status = status;
      }
  
      if (fromDate && toDate) {
        query.deadline = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }

      if (search) {
        query.$or = [{ name: search }, { comments: search }];
      }
  
    try {
      const tasks = await Task.find(query);
      res.status(300).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Could not fetch tasks' });
    }
  };
  


