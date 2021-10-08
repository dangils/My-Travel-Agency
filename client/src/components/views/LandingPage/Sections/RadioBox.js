import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';
//antd 의 Radio 박스 라이브러리 이용
const { Panel } = Collapse;


function RadioBox(props) {

    const [Value, setValue] = useState(0)


    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}> {value.name} </Radio>
                                //해당 value값이 선택될때 useState value로 값 전달
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }



    return (
        <div>
            <Collapse defaultActiveKey={['0']} > 
            {/* 처음엔 닫힌 상태 (0) */}
                <Panel header="Price" key="1">

                    <Radio.Group onChange={handleChange} value={Value}>
                                                    {/* 저장된 value 값을 가져옴 */}
                        {renderRadioBox()}
                    </Radio.Group>

                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
