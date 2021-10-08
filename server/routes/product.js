const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require("../models/Product");

//=================================
//             Product

//product 모델에서 export 한것을 가져옴

/* Product Api 관리 */

// UploadProductPage 에서 보내는request axios를 이곳에서 받음
//=================================


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
        //uploads 폴더에 사진이 저장됨
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
        //현재 날짜와 파일이름으로 저장됨
    }
})

var upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {

    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

})




router.post('/', (req, res) => {

    //받아온 정보들을 DB에 넣어 준다.
    const product = new Product(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

})



router.post('/products', (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    // product collection에 들어 있는 모든 상품 정보를 가져오기 
    //받아온 데이터를 DB에 저장
    // 랜딩 페이지의 limit 정보 받아옴(8개씩 사진 출력)
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
     //limit이 잇다면 지정해준 값으로, 없다면 20으로 수행
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    //검색창에 입력한 값이 이곳으로 들어옴(searchTerm)
    let term = req.body.searchTerm


    let findArgs = {};

    for (let key in req.body.filters) {
        //key값은 continents, price
        if (req.body.filters[key].length > 0) {

            console.log('key', key)

            if (key === "price") {
                findArgs[key] = {
                    //(gte:Greater than equal,크거나 같음)
                    $gte: req.body.filters[key][0],
                    //(lte:Less than equal)
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }

        }
    }


    if (term) {
         //검색창에 값(term)이 있을때 수행
        //백엔드에서 전달 받은 데이터로 상품들을 추려냄
        Product.find(findArgs)
        // product collection에 들어 있는 모든 상품 정보를 가져옴
            .find({ $text: { $search: term } })
            //mongoDB 함수 $text,$search로 term 값을 찾음
            .populate("writer")
            //ObjectId를 기반으로 다른 collection의 정보들을 함께 담아서 출력
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true, productInfo,
                    postSize: productInfo.length
                })
            })
    } else {

        //백엔드에서 전달 받은 데이터로 상품들을 추려냄/DB에서 productId와 같은 상품의 정보를 가져온다.
        Product.find(findArgs)
        // product collection에 들어 있는 모든 상품 정보를 가져옴
            .populate("writer")
            //ObjectId를 기반으로 다른 collection의 정보들을 함께 담아서 출력
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true, productInfo,
                    postSize: productInfo.length
                })
            })
    }

})


//id=123123123,324234234,324234234 -> type=array
router.get('/products_by_id', (req, res) => {

    let type = req.query.type //db쿼리(productiId)를 이용해 가져옴
    let productIds = req.query.id

    if (type === "array") {
        //id=123123123,324234234,324234234 이거를 
        //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔 저장
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    //productId를 이용해서 DB에서  productId와 같은 상품의 정보들을 가져옴
    Product.find({ _id: { $in: productIds } }) //$in : 여러개 데이터를 가져옴
        .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })

})



module.exports = router;
