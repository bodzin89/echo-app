module.exports = function handleErrors() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.messages || [error.message];
    }
  };
};
