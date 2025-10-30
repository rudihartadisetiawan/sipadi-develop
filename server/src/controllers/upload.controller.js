const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const uploadFile = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Tidak ada file yang diunggah.' });
  }

  const urls = req.files.map((file) => {
    // Construct the full URL including protocol, host, and path
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return fullUrl;
  });

  res.status(httpStatus.CREATED).send({
    message: 'File berhasil diunggah',
    urls, // Return an array of URLs
  });
});

module.exports = {
  uploadFile,
};
