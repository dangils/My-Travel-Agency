import React, { useState } from 'react'
import { Input } from 'antd';

const { Search } = Input;

function SearchFeature(props) {

    const [SearchTerm, setSearchTerm] = useState("")

    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value)
         //타이핑 할때마다 searchTerm 값이 변화
        props.refreshFunction(event.currentTarget.value)
    }

    return (
        <div>
            <Search
                placeholder="input search text"
                onChange={searchHandler} // 변경 될때마다(onChange) searchHandler 매서드 실행
                style={{ width: 200 }}
                value={SearchTerm}
               
            />
        </div>
    )
}

export default SearchFeature
