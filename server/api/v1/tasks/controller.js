const Model = require('./model');
const { paginationParseParams } = require('../../../utils');

exports.id = async(req, res, next, id) => {
    try {
        const doc = await Model.findById(id).exec();
        if (!doc) {
            const message = `${Model.modelName} no encontrado`;

            next({
                message,
                statusCode: 404,
                level: 'warn',
            });
        } else {
            req.doc = doc;
            // next para ejecutar el siguiente middleware
            next();
        }
    } catch (err) {
        next(new Error(err));
    }
};

exports.create = async(req, res, next) => {
    const { body = {} } = req;
    const document = new Model(body);

    try {
        const doc = await document.save();
        res.status(201);
        res.json({
            success: true,
            data: doc,
        });
    } catch (err) {
        next(new Error(err));
    }
};

exports.all = async(req, res, next) => {
    const { query = {} } = req;
    const { limit, page, skip } = paginationParseParams(query);

    const all = Model.find({}).skip(skip).limit(limit);
    const count = Model.countDocuments();

    try {
        const data = await promise.all([all.exec(), count.exec()]);
        const [docs, total] = data;
        const pages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: docs,
            meta: {
                limit,
                skip,
                total,
                page,
                pages,
            },
        });
    } catch (err) {
        next(new Error(err));
    }
};

exports.read = async(req, res, next) => {
    const { doc = {} } = req;

    res.json({
        success: true,
        data: doc,
    });
};

exports.update = async(req, res, next) => {
    const { doc = {}, body = {} } = req;

    // Mezcla el conetido del primer objeto con el contenido del segundo
    // para casos màs avanzados como propiedades a mayor profundidad se recomienda usar la funciòn merge de la librerìa lodash
    Object.assign(doc, body);

    try {
        const updated = await doc.save();
        res.json({
            success: true,
            data: updated,
        });
    } catch (err) {
        next(new Error(err));
    }
};

exports.delete = async(req, res, next) => {
    const { doc = {} } = req;

    try {
        const removed = await doc.remove();
        res.json({
            success: true,
            data: removed,
        });
    } catch (err) {
        next(new Error(err));
    }
};