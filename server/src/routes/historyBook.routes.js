const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const { authUser, authAdmin, asyncHandler } = require('../auth/checkAuth');

const controllerHistoryBook = require('../controllers/historyBook.controller');

router.post('/create', authUser, asyncHandler(controllerHistoryBook.createHistoryBook));
router.get('/get-history-user', authUser, asyncHandler(controllerHistoryBook.getHistoryUser));
router.post('/cancel-book', authUser, asyncHandler(controllerHistoryBook.cancelBook));
router.get('/get-all-history-book', asyncHandler(controllerHistoryBook.getAllHistoryBook));
router.post('/update-status-book', asyncHandler(controllerHistoryBook.updateStatusBook));
router.post('/request-return', authUser, asyncHandler(controllerHistoryBook.requestReturnBook));
router.post('/approve-return', authAdmin, asyncHandler(controllerHistoryBook.approveReturnBook));
router.post('/extend', authUser, asyncHandler(controllerHistoryBook.extendBook));

module.exports = router;
