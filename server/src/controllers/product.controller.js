const { AuthFailureError, BadRequestError } = require('../core/error.response');
const { OK, Created } = require('../core/success.response');
const modelProduct = require('../models/product.model');
const { Op } = require('sequelize');

class controllerProduct {
    async uploadImage(req, res) {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `uploads/products/${file.filename}`;
        new Created({
            message: 'Upload image success',
            metadata: imageUrl,
        }).send(res);
    }
    async createProduct(req, res) {
        const {
            nameProduct,
            image,
            description,
            stock,
            covertType,
            publishYear,
            pages,
            language,
            publisher,
            publishingCompany,
        } = req.body;
        if (
            !nameProduct ||
            !image ||
            !description ||
            !stock ||
            !covertType ||
            !publishYear ||
            !pages ||
            !language ||
            !publisher ||
            !publishingCompany
        ) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }
        const product = await modelProduct.create({
            nameProduct,
            image,
            description,
            stock,
            covertType,
            publishYear,
            pages,
            language,
            publisher,
            publishingCompany,
        });
        new Created({
            message: 'Create product success',
            metadata: product,
        }).send(res);
    }
    async getAllProduct(req, res) {
        const products = await modelProduct.findAll();
        new OK({
            message: 'Get all product success',
            metadata: products,
        }).send(res);
    }

    async getTopBorrowedBooks(req, res) {
        const historyBook = require('../models/historyBook.model');
        const { Sequelize } = require('sequelize');

        // Lấy top 5 bookId được mượn nhiều nhất
        const topHistories = await historyBook.findAll({
            attributes: ['bookId', [Sequelize.fn('COUNT', Sequelize.col('bookId')), 'borrowCount']],
            group: ['bookId'],
            order: [[Sequelize.literal('borrowCount'), 'DESC']],
            limit: 5,
            raw: true
        });

        let products = [];

        if (topHistories.length === 0) {
            // Nếu không có dữ liệu mượn, lấy 5 cuốn bất kỳ
            products = await modelProduct.findAll({ limit: 5 });
        } else {
            const bookIds = topHistories.map(h => h.bookId);
            const foundProducts = await modelProduct.findAll({
                where: { id: bookIds },
                raw: true
            });

            products = topHistories.map(h => {
                const product = foundProducts.find(p => p.id === h.bookId);
                return product ? { ...product, borrowCount: parseInt(h.borrowCount, 10) || 0 } : null;
            }).filter(Boolean);

            // Bù thêm sách nếu chưa đủ 5 cuốn
            if (products.length < 5) {
                const existingIds = products.map(p => p.id);
                let moreProducts;
                if (existingIds.length > 0) {
                    moreProducts = await modelProduct.findAll({
                        where: { id: { [Op.notIn]: existingIds } },
                        limit: 5 - products.length,
                        raw: true
                    });
                } else {
                    moreProducts = await modelProduct.findAll({
                        limit: 5 - products.length,
                        raw: true
                    });
                }
                products = [...products, ...moreProducts];
            }
        }

        new OK({
            message: 'Get top borrowed product success',
            metadata: products,
        }).send(res);
    }

    async getOneProduct(req, res) {
        const { id } = req.query;
        const product = await modelProduct.findOne({ where: { id } });
        new OK({
            message: 'Get one product success',
            metadata: product,
        }).send(res);
    }

    async searchProduct(req, res) {
        const { keyword } = req.query;
        const products = await modelProduct.findAll({ where: { nameProduct: { [Op.like]: `%${keyword}%` } } });

        new OK({
            message: 'Search product success',
            metadata: products,
        }).send(res);
    }

    async updateProduct(req, res) {
        const { id } = req.query;
        const product = await modelProduct.update(req.body, { where: { id } });
        new OK({
            message: 'Update product success',
            metadata: product,
        }).send(res);
    }

    async deleteProduct(req, res) {
        const { id } = req.body;
        const product = await modelProduct.destroy({ where: { id } });
        new OK({
            message: 'Delete product success',
            metadata: product,
        }).send(res);
    }
}

module.exports = new controllerProduct();
