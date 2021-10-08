import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';

function LandingPage() {

    const [Products, setProducts] = useState([]) 
    //상품들을 이곳에 받아옴
    const [Skip, setSkip] = useState(0)
    //skip 처음 상태 0,
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")

    useEffect(() => {

        let body = {
            //skip과 limit을 이용해 처음 8개만 가져오게 함
            skip: Skip,
            limit: Limit
        }

        getProducts(body)
        // 조건에 맞는 아이템들을 새롭게 가져옴

    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                        //기존의 Products 가져온 후, 이 후의 productinfo 가져옴
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(" 상품들을 가져오는데 실패 했습니다.")
                }
            })
    }



    const loadMoreHanlder = () => {

        let skip = Skip + Limit
        // 더보기 클릭시 limit 갯수 이후의 사진들 출력
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters
        }

        getProducts(body) 
        setSkip(skip) //skip에 현재 값 저장
    }


    const renderCards = Products.map((product, index) => {
    //Product 갯수만큼 랜덤카드 생성
    // ImageSlider 컴퍼넌트에 슬라이더 기능 구현(ant디자인 라이브러리의 Carousel) 
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<a href={`/product/${product._id}`} ><ImageSlider images={product.images} /></a>}
            >              {/* 상품의 유니크ID로 상세페이지로 이동 */}
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    /* 필터를 검색 할때마다 getProducts 매서드 수행하여 데이터 새로 가져옴 */
    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)

    }


    const handlePrice = (value) => {
        const data = price; //Data의 price 오브젝트에 대한 데이터 들어옴
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }


    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters
        //filters: checkbox에서 전달 받은 체크된 항목들

        console.log('filters', filters)

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            // 눌러진것 포함하여 검색하기 위해 기본Filters값
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)

    }

    return (
          /* ant디자인에서 가져와 슬라이드 카드UI 생성 */ 
        <div style={{ width: '75%', margin: '3rem auto' }}>

            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /> </h2>
            </div>

            {/* Filter */}

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}> 
                    {/* CheckBox */}
                    <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
                    {/* 선택한 checkbox를 filters로 가져옴*/}
                   
                </Col>

                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <Radiobox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
                
            </Row>


            {/* Search */}

             <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature
                    refreshFunction={updateSearchTerm}
                />
            </div> 

            {/* Cards */}

            <Row gutter={[16, 16]} >
                {renderCards}
            </Row>

            <br />

            {PostSize >= Limit && //Limit보다 크거나 같으면 아래 수행
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHanlder}>더보기</button>
                </div>
            }

        </div>
    )
}

export default LandingPage
