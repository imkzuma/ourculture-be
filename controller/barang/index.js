const User = require("../../models/Users");
const Barang = require("../../models/barangs");

const postBarang = async (req, res) => {
  const { title, description, userId, harga, location } = req.body;
  
  const { files } = req;
  const images = files ? files.map((file) => file.cloudStoragePublicUrl) : null;

  const barang = await Barang.create({
    title: title,
    description: description,
    userId: userId,
    harga: parseInt(harga),
    location: location,
    image: images
  });

  res.status(200).json(barang);
}

const getAllBarang = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const result = await Barang.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        attributes: ['username'],
      }],
    });

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
};

const getBarangById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Barang.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['username'],
      }],
    });

    res.status(200).json({
      data: result,
      message: "Success get barang",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  postBarang,
  getAllBarang,
  getBarangById
}