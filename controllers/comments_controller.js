const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();
            
            comment = await comment.populate('user', 'name email').execPopulate();
            //commentsMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('Error in creating a queue', err);
                    return;
                }

                console.log('Job enqueued',job.id);
            });

            if (req.xhr){
                
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }   
}


module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){
            let postId =comment.post;

            comment.remove();

            await Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}});

            // destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }
            req.flash('success','Comment deleted successfully!');
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this comment');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}