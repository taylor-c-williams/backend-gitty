const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');



module.exports = Router()

  .post('/', authenticate,  async (req, res, next) => {
    try{
      const post = await Post.insert({ ...req.body, userId: req.body.user_id });
      res.send(post);
    }catch(error){
      next(error);
    }
  })

  .get('/', [authenticate], async (req, res, next) => {
    try {
      const posts = await Post.getAllPosts();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  });
