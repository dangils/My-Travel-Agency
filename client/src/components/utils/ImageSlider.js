import React from 'react'
import { Icon, Col, Card, Row, Carousel } from 'antd';
//ant 디자인의 Carousel 사용 하여 슬라이드 구현

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay >
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{ width: '100%', maxHeight: '150px' }}
                            src={`http://localhost:5000/${image}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider
