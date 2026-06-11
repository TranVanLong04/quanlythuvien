const usersRoutes = require('./users.routes');
const productRoutes = require('./product.routes');
const historyBookRoutes = require('./historyBook.routes');
const notificationRoutes = require('./notification.routes');

function route(app) {
    app.use('/api/user', usersRoutes);
    app.use('/api/product', productRoutes);
    app.use('/api/history-book', historyBookRoutes);
    app.use('/api/notification', notificationRoutes);
}

module.exports = route;
