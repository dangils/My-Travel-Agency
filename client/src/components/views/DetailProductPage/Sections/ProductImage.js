import React, { useState, useEffect } from 'react'
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {

        if (props.detail.images && props.detail.images.length > 0) { //이미지 정의
            let images = []

            props.detail.images.map(item => {//map으로 item의 사진 갯수 만큼 push
            
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }

    }, [props.detail])
    //[]) -> 맨처음 useEffect를 작동 시킬때 초기값, DetailProductPage에서 넣은
    // props값(detail={Product})을 가져와서 수행 props.detail
    return (
        <div>
            <ImageGallery items={Images} />
            {/* seImages로 저장된 이미지를 가져옴 */}
        </div>
    )
}

export default ProductImage
