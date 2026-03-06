import React, { useEffect, useState } from 'react';
import { orderApi } from '../../../api';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderApi.getOrders();
            setOrders(res.data || []);
        } catch (e) {
            console.error('Error fetching orders:', e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await orderApi.updateStatus(id, newStatus);
            if (res.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, orderStatus: newStatus } : o));
            }
        } catch (e) {
            console.error('Failed to update status', e);
            alert('Failed to update status');
        }
    };

    const generatePDF = (order) => {
        try {
            const doc = new jsPDF();

            // 1. Header
            doc.setFontSize(22);
            doc.setTextColor(26, 26, 26);
            doc.text("The String Theory", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Official Invoice & Packing Slip", 14, 26);

            // 2. Order Details (Right side)
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text(`Order ID: #${order.id.slice(-8).toUpperCase()}`, 140, 20);
            doc.setFontSize(10);
            const orderDate = order.createdAt?._seconds
                ? new Date(order.createdAt._seconds * 1000).toLocaleDateString()
                : order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
            doc.text(`Date: ${orderDate}`, 140, 26);
            doc.text(`Status: ${order.orderStatus || 'Pending'}`, 140, 32);

            // 3. Customer Info
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Bill To / Ship To:", 14, 45);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            const customerName = order.customerDetails?.name || 'Guest Customer';
            const customerEmail = order.customerDetails?.email || 'N/A';
            const customerPhone = order.customerDetails?.phone || 'N/A';
            const address = order.shippingAddress || 'No Address Provided';

            doc.text(customerName, 14, 52);
            doc.text(customerEmail, 14, 58);
            doc.text(`Phone: ${customerPhone}`, 14, 64);

            // Wrap address if it's too long
            const splitAddress = doc.splitTextToSize(`Address: ${address}`, 90);
            doc.text(splitAddress, 14, 70);

            // 4. Line Items Table
            const tableColumn = ["Item", "Qty", "Price", "Total"];
            const tableRows = [];

            (order.items || []).forEach(item => {
                const itemData = [
                    item.title,
                    item.quantity.toString(),
                    `Rs. ${item.price}`,
                    `Rs. ${item.price * item.quantity}`
                ];
                tableRows.push(itemData);
            });

            // Footer rows
            const subtotalValue = order.subtotal || (order.items || []).reduce((acc, i) => acc + (i.price * i.quantity), 0);
            tableRows.push([{ content: 'Subtotal', colSpan: 3, styles: { halign: 'right' } }, `Rs. ${subtotalValue}`]);

            if (order.discount > 0) {
                tableRows.push([{ content: 'Discount', colSpan: 3, styles: { halign: 'right' } }, `-Rs. ${order.discount}`]);
            }
            if (order.shippingFee !== undefined) {
                tableRows.push([{ content: 'Shipping', colSpan: 3, styles: { halign: 'right' } }, order.shippingFee === 0 ? "Free" : `Rs. ${order.shippingFee}`]);
            }

            // Final Total Row
            tableRows.push([{ content: 'Grand Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `Rs. ${order.grandTotal || subtotalValue}`]);

            autoTable(doc, {
                startY: 95,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: {
                    fillColor: [26, 26, 26],
                    fontSize: 10,
                    halign: 'left'
                },
                columnStyles: {
                    0: { cellWidth: 100 },
                    1: { halign: 'center' },
                    2: { halign: 'right' },
                    3: { halign: 'right' }
                },
                didParseCell: function (data) {
                    // Header alignment
                    if (data.section === 'head') {
                        if (data.column.index === 1) data.cell.styles.halign = 'center';
                        if (data.column.index === 2 || data.column.index === 3) data.cell.styles.halign = 'right';
                    }

                    // Final row styling for Grand Total
                    if (data.row.index === tableRows.length - 1) {
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.fillColor = [240, 240, 240];
                    }
                }
            });

            // 5. Footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text("Thank you for choosing The String Theory.", 105, 285, { align: 'center' });
            }

            doc.save(`Invoice_${order.id.slice(-6).toUpperCase()}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to generate PDF. Check the browser console for details.");
        }
    };

    if (loading) return <p>Loading Orders...</p>;

    return (
        <div>
            <h2>Manage Orders</h2>
            <table className="admin-table" style={{ minWidth: '900px' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{order.id.slice(-6).toUpperCase()}</td>
                            <td>{order.customerDetails?.name || 'Guest'}</td>
                            <td>{order.customerDetails?.email || 'N/A'}</td>
                            <td style={{ fontWeight: 600 }}>₹{order.grandTotal || 0}</td>
                            <td>
                                <select
                                    className={`status-badge ${order.orderStatus || 'Pending'}`}
                                    value={order.orderStatus || 'Pending'}
                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                    style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    className="btn-action edit"
                                    onClick={() => generatePDF(order)}
                                    title="Download printable PDF bill"
                                >
                                    📥 PDF Bill
                                </button>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;
