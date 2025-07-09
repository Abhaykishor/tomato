import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const statusSteps = [
  { key: 'Placed', label: 'Placed', icon: '📝' },
  { key: 'Preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'Out for Delivery', label: 'On the way', icon: '🚚' },
  { key: 'Delivered', label: 'Delivered', icon: '✅' },
  { key: 'Cancelled', label: 'Cancelled', icon: '❌' }
];

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { url, token, currency, setCartItems } = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    setData(response.data.data)
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  const handleReorder = (order) => {
    const newCart = {};
    order.items.forEach(item => {
      newCart[item._id] = item.quantity;
    });
    setCartItems(newCart);
  };

  const handleCancel = async (order) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    await axios.post(url + '/api/order/updatestatus', { orderId: order._id, status: 'Cancelled' });
    fetchOrders();
  };

  const handleInvoice = (order) => {
    const win = window.open('', '_blank');
    win.document.write('<html><head><title>Invoice</title></head><body>');
    win.document.write(`<h2>Order Invoice</h2>`);
    win.document.write(`<p><b>Order ID:</b> ${order._id}</p>`);
    win.document.write(`<p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>`);
    win.document.write(`<p><b>Address:</b> ${order.address ? Object.values(order.address).join(', ') : ''}</p>`);
    win.document.write('<table border="1" cellpadding="8" style="border-collapse:collapse;margin:1em 0;">');
    win.document.write('<tr><th>Item</th><th>Qty</th><th>Price</th></tr>');
    order.items.forEach(item => {
      win.document.write(`<tr><td>${item.name}</td><td>${item.quantity}</td><td>${currency}${item.price}</td></tr>`);
    });
    win.document.write('</table>');
    win.document.write(`<p><b>Total:</b> ${currency}${order.amount}</p>`);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(s => s.key.toLowerCase() === status.toLowerCase());
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#4BB543';
    if (status === 'Cancelled') return '#e13d13';
    if (status === 'Out for Delivery') return '#FF4C24';
    if (status === 'Preparing') return '#f7b731';
    return '#888';
  };

  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    alert('Order ID copied!');
  };

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="orders-container">
        {data.length === 0 && <p style={{color:'#888',padding:'2rem'}}>No orders found.</p>}
        {data.map((order, index) => {
          const statusIdx = getStatusIndex(order.status);
          const previewImg = assets.parcel_icon;
          const isNew = index === 0;
          return (
            <div key={order._id} className='order-card' style={{background: 'linear-gradient(135deg, #fff4f2 60%, #f7f7fa 100%)'}}>
              {(order.status === 'Delivered' || order.status === 'Cancelled' || isNew) && (
                <div className={`order-badge${order.status === 'Cancelled' ? ' cancelled' : ''}`}>{order.status === 'Delivered' ? 'Delivered' : order.status === 'Cancelled' ? 'Cancelled' : isNew ? 'New' : ''}</div>
              )}
              <div className="order-card-header">
                <div className="order-box-img">
                  <img src={previewImg} alt="Preview" />
                </div>
                <div>
                  <div className="order-id-date">
                    <span>Order ID: <span className="order-id-copy" title="Copy Order ID" onClick={() => copyOrderId(order._id)}>{order._id.slice(-6)}</span></span>
                    <span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</span>
                  </div>
                  <div className="order-status-bar">
                    {statusSteps.map((step, idx) => (
                      <div key={step.key} className={`status-bar-step${idx <= statusIdx ? ' done' : ''}${order.status === step.key ? ' current' : ''}`}
                        style={{color: idx <= statusIdx ? getStatusColor(step.key) : '#bbb'}}>
                        <span className="status-bar-icon">{step.icon}</span>
                        <span className="status-bar-label">{step.label}</span>
                        {idx < statusSteps.length-1 && <span className="status-bar-sep">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="order-summary">
                <p className="order-items-list">
                  {order.items.map((item, idx) => `${item.name} x ${item.quantity}${idx < order.items.length - 1 ? ', ' : ''}`)}
                </p>
                <p className="order-amount">{currency}{order.amount}.00</p>
                <p className="order-status" style={{color: getStatusColor(order.status)}}><span>&#x25cf;</span> <b>{order.status}</b></p>
              </div>
              <div className="order-actions">
                <button title="Order Details" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>ℹ️</button>
                <button title="Download Invoice" onClick={() => handleInvoice(order)}>🧾</button>
                <button title="Reorder" onClick={() => handleReorder(order)}>🔄</button>
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button title="Cancel Order" onClick={() => handleCancel(order)} className="cancel-btn">❌</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {showModal && selectedOrder && (
        <div className="order-modal-bg" onClick={() => setShowModal(false)}>
          <div className="order-modal" onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Order Details</h3>
              <span className="order-modal-status" style={{color: getStatusColor(selectedOrder.status)}}>
                {statusSteps.find(s => s.key === selectedOrder.status)?.icon} {selectedOrder.status}
              </span>
            </div>
            <p><b>Order ID:</b> {selectedOrder._id} <button className="copy-btn" onClick={() => copyOrderId(selectedOrder._id)} title="Copy Order ID">📋</button></p>
            <p><b>Date:</b> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}</p>
            <p><b>Payment:</b> {selectedOrder.payment ? 'Paid 💳' : 'Not Paid'}</p>
            <div style={{marginBottom:'0.5em'}}>
              <b>Address:</b><br/>
              {selectedOrder.address && (
                <>
                  <span>{selectedOrder.address.firstName} {selectedOrder.address.lastName}</span><br/>
                  {selectedOrder.address.phone && <span>{selectedOrder.address.phone}<br/></span>}
                  <span>{selectedOrder.address.street},</span><br/>
                  <span>{selectedOrder.address.city}, {selectedOrder.address.state}, {selectedOrder.address.country}, {selectedOrder.address.zipcode}</span>
                </>
              )}
            </div>
            <div className="order-modal-status-bar">
              {statusSteps.map((step, idx) => (
                <div key={step.key} className={`modal-status-step${idx <= getStatusIndex(selectedOrder.status) ? ' done' : ''}${selectedOrder.status === step.key ? ' current' : ''}`}
                  style={{color: idx <= getStatusIndex(selectedOrder.status) ? getStatusColor(step.key) : '#bbb'}}>
                  <span className="modal-status-icon">{step.icon}</span>
                  <span className="modal-status-label">{step.label}</span>
                  {idx < statusSteps.length-1 && <span className="modal-status-sep">→</span>}
                </div>
              ))}
            </div>
            <table className="order-modal-table">
              <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>
                {selectedOrder.items.map(item => (
                  <tr key={item._id}><td>{item.name}</td><td>{item.quantity}</td><td>{currency}{item.price}</td></tr>
                ))}
              </tbody>
            </table>
            <p><b>Total:</b> {currency}{selectedOrder.amount}</p>
            <button onClick={() => setShowModal(false)} className="close-modal">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders
