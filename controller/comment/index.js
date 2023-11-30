const User = require("../../models/Users");
const Comment = require("../../models/comments");

const postCommentByBarangId = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment, rating } = req.body;

    const { files } = req;
    const images = files ? files.map((file) => file.cloudStoragePublicUrl) : null;

    const result = await Comment.create({
      comment,
      rating,
      image: images,
      userId: parseInt(userId),
      barangId: parseInt(id),
    });

    res.status(200).json({
      data: result,
      message: "Success post comment",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getCommentByBarangId = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { id } = req.params;

    const result = await Comment.findAndCountAll({
      where: { barangId: id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        attributes: ['username'],
      }],
    })
    
    const totalPages = Math.ceil(result.count / limit);

    res.status(200).json({
      data: result.rows,
      totalItems: result.count,
      totalPages,
      currentPage: parseInt(page),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  postCommentByBarangId,
  getCommentByBarangId,
};