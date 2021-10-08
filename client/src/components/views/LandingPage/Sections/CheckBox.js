import React, { useState } from 'react'
import { Collapse,Checkbox } from 'antd';

//antd 의 Collapse 라이브러리 이용

const { Panel } = Collapse;


function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {
        //누른 것의 Index를 구하고 
        const currentIndex = Checked.indexOf(value)
        //전체 Checked된 State에서  현재 누른 Checkbox가 이미 있다면 
        const newChecked = [...Checked]

        // State 넣어준다. 
        if (currentIndex === -1) { //checked 안의 값이 없는 경우(-1일때)
            newChecked.push(value)
            // 빼주고 
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleFilters(newChecked)
        //체크된것 부모컴퍼넌트로 전달(filters)
    }


    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index} >
            <Checkbox onChange={() => handleToggle(value._id)}
                checked={Checked.indexOf(value._id) === -1 ? false : true} />
                {/* onChange가 일어 날때 checked 속성이 각각 false,true로 변화  */}
            <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Continents" key="1">

                    {renderCheckboxLists()}

                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
