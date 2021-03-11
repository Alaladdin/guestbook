const Comment = require('../models/comment');

const getComments = async (req, res) => {
  const commentsList = await Comment.find({}, (err) => {
    if (err) return res.status(500).json({ message: 'some error was occurred', error: err });
  })
    .select({ author: 1, comment: 1, createdOn: 1 })
    .lean()
    .catch(console.error);
  return res.status(200).json({ commentsList });
};

const addComment = async (req, res) => {
  const { comment } = req.body;

  if (!comment) return res.status(400).json({ message: 'comment not provided' });

  try {
    const newComment = new Comment({
      author: comment.username,
      comment: comment.comment,
    });
    await newComment.save();
    return res.status(201).json({ newComment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error was occurred' });
  }
};

module.exports = {
  getComments,
  addComment,
};
