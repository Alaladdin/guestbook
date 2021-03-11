const express = require('express');
const { getComments, addComment } = require('../controllers/CommentsController');

const router = express.Router();

router.get('/comments/', getComments);

router.post('/comments/add/', addComment);

module.exports = router;
