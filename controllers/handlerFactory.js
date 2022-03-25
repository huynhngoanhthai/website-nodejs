const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

const getCollectionName = (Model, isSingular = false) => {
  const collectionName = Model.collection.collectionName;

  if (isSingular) {
    return collectionName.slice(0, -1);
  }
  return collectionName;
};

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const collectionName = getCollectionName(Model);

    const features = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: "success",
      results: document.length,
      data: {
        [collectionName]: document,
      },
    });
  });
// get one by id params
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const collectionName = getCollectionName(Model, true);

    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(AppError(404, `No ${collectionName} found with that ID`));
    }
    res.status(200).json({
      status: "success",
      data: {
        [collectionName]: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const collectionName = getCollectionName(Model, true);

    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        [collectionName]: newDocument,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const collectionName = getCollectionName(Model, true);

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });

    if (!document) {
      return next(AppError(404, `No ${collectionName} found with that ID`));
    }

    res.status(200).json({
      status: "success",
      data: {
        [collectionName]: document,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(AppError(404, `No ${collectionName} found with that ID`));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
