const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = MyModel => {
  return catchAsync(async (req, res, next) => {
    let theId;

    // Check if we have only the Id or the UserId with us to take action
    if (req.params.id) theId = req.params.id;
    else if (req.params.uid) theId = req.params.uid;

    // Query and Delete the Document
    const doc = await MyModel.findByIdAndDelete(theId);

    if (!doc) {
      return next(new AppError('The document could not be found.', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};
