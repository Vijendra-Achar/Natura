const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// Handler function for getting all Documents
exports.getAll = (MyModel) => {
  return catchAsync(async (req, res, next) => {
    let filter = {};

    // Get all the reviews for one specific tour with the ID
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Final Query
    const features = new APIFeatures(MyModel.find(filter), req.query)
      .filter()
      .limitFields()
      .sorting()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      timeOfRequest: req.time,
      data: {
        data: doc,
      },
    });
  });
};

// Handler function for Getting One Document
exports.getOne = (MyModel, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    let theId;

    // Check if we have only the Id or the UserId with us to take action
    if (req.params.id) theId = req.params.id;
    else if (req.params.uid) theId = req.params.uid;

    // Query Variable
    let query = MyModel.findById(theId);

    // Mutate the Query Veriable if the populate options is present
    if (populateOptions) query = query.populate(populateOptions);

    // The final result after awaiting the query
    const doc = await query;

    if (!doc) {
      return next(
        new AppError('The Document with this ID does not exist.', 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

// Handler function for Creating a Document
exports.createOne = (MyModel) => {
  return catchAsync(async (req, res, next) => {
    const doc = await MyModel.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

// Handler function for Updating a Document.
exports.updateOne = (MyModel) => {
  return catchAsync(async (req, res, next) => {
    let theId;

    // Check if we have only the Id or the UserId with us to take action
    if (req.params.id) theId = req.params.id;
    else if (req.params.uid) theId = req.params.uid;

    // Query and Update Document
    const doc = await MyModel.findByIdAndUpdate(theId, req.body, {
      runValidators: true,
      new: true,
    });

    if (!doc) {
      return next(new AppError('No Document was found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

// Handler function for Deleting a Document.
exports.deleteOne = (MyModel) => {
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
      data: null,
    });
  });
};
