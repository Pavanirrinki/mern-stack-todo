const express = require('express');
const router = express.Router();
const middleware = require ("../Middleware/Middleware")
const Todos = require("../Models/Todomodel");



router.post('/add-todo', async (req, res) => {
    try {
      const { title, description, iscompleted, user } = req.body;
  const newTodo = new Todos({
        title,
        description,
        iscompleted,
        user
      });
  const createdTodo = await newTodo.save();
      res.status(201).json(createdTodo);
    } catch (error) {
    
      res.status(500).json({ error: 'Failed to create todo' });
    }
  });
  

router.get("/alltodos/:id",async (req,res)=>{
    const {id} = req.params;
    try{
    const usertodo = await Todos.find({user:id})

res.status(200).json({usertodo})
    }catch (error) {
res.status(500).json({ error: 'user not found' });
    }
})

router.delete("/delete-todo/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedTodo = await Todos.findByIdAndRemove(id);
      if (deletedTodo) {
        res.status(200).send("Deleted successfully");
      } else {
        res.status(404).send("Todo not found");
      }
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
 
 
 
  router.put("/update-todo/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, iscompleted, user } = req.body;
    
    try {
      const updatedTodo = await Todos.findByIdAndUpdate(
        id,
        { title, description, iscompleted, user },
        { new: true }
      );
      
      if (updatedTodo) {
        res.status(200).json(updatedTodo);
      } else {
        res.status(404).send("Todo not found");
      }
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
    


  router.delete("/delete-all-todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedTodo = await Todos.deleteMany({user:id});
      if (deletedTodo) {
        res.status(200).send("Deleted all todos successfully");
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });



  router.get("/filter-todos/:status/:id",async(req,res)=>{
    const {status,id} = req.params;

    try{
const uersstatus = await Todos.find({user:id,iscompleted:status});
console.log(status)
console.log(uersstatus)
res.status(200).json({uersstatus})
    }catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  })



module.exports = router