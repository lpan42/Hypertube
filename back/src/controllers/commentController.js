const axios = require('axios').default;
const Comment = require('../models/Comment');
const sanitize = require('mongo-sanitize');

export async function addComment(req, res){
    const newComment = new Comment({
        userId: req.userid,
        username: req.username,
        imdbId: req.params.imdbId,
        comment: sanitize(req.body.newComment),
    });
    newComment.save(err => {
        if (err){
            console.error(err);
            return res.status(400);
        }
        return res.status(200);
      });
  
}

export async function getAllComments(req, res){
    Comment.find({ imdbId :req.params.imdbId}).sort({time : -1}).exec((err, result) => {
        if(err){
            return res.status(400).json({ error: err.message });
        }
        return res.status(200).json({
            data: result,
        });
    })
}