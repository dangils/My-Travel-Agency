import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd';
import axios from 'axios';


function FileUpload(props) {

    const [Images, setImages] = useState([])
    //이미지를 state를 사용하여 배열로 저장

    const dropHandler = (files) => {
        //files를 백엔드로 전달
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/fomr-data' }
            // 파일에 대한 타입 정의
        }
        formData.append("file", files[0])

        axios.post('/api/product/image', formData, config)
        //post방식으로 전송하여 전달, 드랍존에 들어가는 파일(formData)
            .then(response => {
                if (response.data.success) {
                    //파일 저장 성공시, 
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath])
                                        //스프레드 오퍼레이터로 이미지 변수의 데이터를 모두 저장
                    //UploadProduct에서 정의한 props(refreshFunction)                    

                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }


    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image); // 현재 이미지의 인덱스를 가져옴
        let newImages = [...Images] // 이미지 state의 이미지들을 새롭게 복사
        newImages.splice(currentIndex, 1) //현재 인덱스의 이미지 1개를 지움
        setImages(newImages)
        props.refreshFunction(newImages)


    }


    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                 {/* onDrop 이벤트가 일어날때 파일이 백엔드로 저장되고 프론트쪽으로 가져옴 */}
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem' }} />
                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                         {/* 클릭시 이미지를 삭제*/}
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}


            </div>


        </div>
    )
}

export default FileUpload
