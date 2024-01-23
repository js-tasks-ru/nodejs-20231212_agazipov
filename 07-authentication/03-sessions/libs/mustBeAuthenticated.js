module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    ctx.throw('Пользователь не залогинен', 401);
  }
  return next();
};
