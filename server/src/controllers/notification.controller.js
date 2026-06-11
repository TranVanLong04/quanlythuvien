const modelNotification = require('../models/notification.model');
const { OK } = require('../core/success.response');

class notificationController {
    async getNotifications(req, res) {
        const { id } = req.user;
        const notifications = await modelNotification.findAll({
            where: { userId: id },
            order: [['createdAt', 'DESC']]
        });
        
        new OK({
            message: 'Get notifications success',
            metadata: notifications,
        }).send(res);
    }

    async markAsRead(req, res) {
        const { id } = req.user;
        const { notificationId } = req.params;
        
        await modelNotification.update(
            { isRead: true },
            { where: { id: notificationId, userId: id } }
        );

        new OK({
            message: 'Mark as read success'
        }).send(res);
    }
}

module.exports = new notificationController();
