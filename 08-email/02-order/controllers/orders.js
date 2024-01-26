const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');
const mapOrderConfirmation = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const order = new Order({user: ctx.user, product, phone, address});
  await order.save();
  const findProduct = await Order.findOne({product}).populate('product');
  const findOrder = mapOrderConfirmation(order, findProduct);
  await sendMail({
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
    locals: {id: findOrder.id, product: findOrder.product},
    template: 'order-confirmation',
  });
  ctx.body = {order: findOrder.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const ordersList = await Order.find({user: ctx.user._id}).populate(['user', 'product']);
  ordersList.forEach(mapOrder);
  ctx.body = {orders: ordersList};
};
