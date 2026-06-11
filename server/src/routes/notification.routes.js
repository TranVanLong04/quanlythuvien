const express = require('express');
const router = express.Router();
const { authUser, asyncHandler } = require('../auth/checkAuth');
const notificationController = require('../controllers/notification.controller');

router.use(authUser);

router.get('/', asyncHandler(notificationController.getNotifications));
router.put('/:notificationId/read', asyncHandler(notificationController.markAsRead));

module.exports = router;
