// Catch Async function: Implements a common error handling function
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      next(err);
    });
  };
};
