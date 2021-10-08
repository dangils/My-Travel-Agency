import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Empty } from 'antd';


function CartPage(props) {
    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)//해당 값이 true 일때만 가격 출력

            
    useEffect(() => {

        let cartItems = []

        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {//상품이 한개이상 들어있는경우
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                //axios대신 리덕스 dispatch로 훅을 가져와 수행
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => { calculateTotal(response.payload) })
            }
        }
    }, [props.user.userData])


    let calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)

    }


    let removeFromCart = (productId) => {

        dispatch(removeCartItem(productId)) //removeCartItem 액션을 수행(user_action에 구현)
            .then(response => {

                if (response.payload.productInfo.length <= 0) {
                    setShowTotal(false)
                }

            })

    }



    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>

            <div>
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
                {/*UserCardBlock 에 props를 보냄 */}
            </div>

            {ShowTotal ?
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount: ${Total}</h2>
                </div>
                :
                <>
                    <br />
                    <br />
                    <Empty description={false} />
                </>
            }

        </div>
    )
}

export default CartPage
