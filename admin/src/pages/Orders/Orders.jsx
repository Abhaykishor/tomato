import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
    }
    else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/updatestatus`, {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    const response = await axios.post(`${url}/api/order/delete`, { orderId });
    if (response.data.success) {
      let undoTimeout;
      const undo = async () => {
        clearTimeout(undoTimeout);
        await axios.post(`${url}/api/order/restore`, { orderId });
        toast.success('Order restored');
        fetchAllOrders();
      };
      toast(
        <span>
          Order deleted. <button style={{color:'#FF4C24',background:'none',border:'none',cursor:'pointer',fontWeight:600}} onClick={undo}>Undo</button>
        </span>,
        { autoClose: 8000 }
      );
      undoTimeout = setTimeout(fetchAllOrders, 8000);
    } else {
      toast.error('Failed to delete order');
    }
  };


  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name="" id="">
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button className="order-delete-btn" onClick={() => deleteOrder(order._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
