const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {displayName, email, password} = ctx.request.body;
  const token = uuid();
  const user = new User({email, displayName, verificationToken: token});
  await user.setPassword(password);
  await user.save();
  await sendMail({
    template: 'confirmation',
    locals: {token: token},
    to: email,
    subject: 'Подтвердите почту',
  });
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const filter = {verificationToken: verificationToken};
  // при установке значения undefined этот метод работать не хочет.
  // по этому получилось удалить поле только с помощью $unset.
  const user = await User.findOneAndUpdate(filter, {$unset: {verificationToken: ''}}, {
    new: true,
  });
  if (!user) ctx.throw('Ссылка подтверждения недействительна или устарела');

  const token = await ctx.login(user);
  ctx.body = {token: token};
};
