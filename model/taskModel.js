const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
    name: String,
    label: String,
    deadline: Date,
    estimateHours: Number,
    comments: [String],
    status: {
        type: String,
        enum: {
          values: ['To Do','In progress','completed'],
        }
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      }
  });


  TaskSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'user',
      select: 'fullName'
    });
    next();
  });
  

  const Task = mongoose.model('Task', TaskSchema);

  module.exports = Task;