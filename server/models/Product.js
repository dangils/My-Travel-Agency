const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },

    continents: {
        type: Number,
        default: 1
    },

    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

productSchema.index({ // title,description에 포함된 text도 검색
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5, //검색시 title의 중요도를 높임
        description: 1
    }
})


const Product = mongoose.model('Product', productSchema);

module.exports = { Product }