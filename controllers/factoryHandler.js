const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doc) {
      return next(new AppError(`Couldn't find the document to update.`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`couldn't find the document for this id to delete.`, 404)
      );
    }

    res.status(204).json({
      status: 'successfully deleted',
      data: null,
    });
  });
