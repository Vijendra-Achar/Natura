const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Handler fynction for Creating a Document
exports.createOne = MyModel => {
  return catchAsync(async (req, res, next) => {
    const doc = await MyModel.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

// Handler fynction for Updating a Document.
exports.updateOne = MyModel => {
  return catchAsync(async (req, res, next) => {
    let theId;

    // Check if we have only the Id or the UserId with us to take action
    if (req.params.id) theId = req.params.id;
    else if (req.params.uid) theId = req.params.uid;

    // Query and Update Document
    const doc = await MyModel.findByIdAndUpdate(theId, req.body, {
      runValidators: true,
      new: true
    });

    if (!doc) {
      return next(new AppError('No Document was found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

// Handler fynction for Deleting a Document.
exports.deleteOne = MyModel => {
  return catchAsync(async (req, res, next) => {
    let theId;

    // Check if we have only the Id or the UserId with us to take action
    if (req.params.id) theId = req.params.id;
    else if (req.params.uid) theId = req.params.uid;

    // Query and Delete the Document
    const doc = await MyModel.findByIdAndDelete(theId);

    if (!doc) {
      return next(new AppError('The document was found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};
