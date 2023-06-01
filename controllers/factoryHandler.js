const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
