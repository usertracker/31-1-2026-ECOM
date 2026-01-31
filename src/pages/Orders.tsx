import React, { useState, useMemo } from 'react';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../lib/utils';
import { Package, ChevronDown, ChevronUp, Star, Copy, Download, MapPin, Truck, History, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper for date formatting like "Wed, 4th Jun '25"
const formatDetailedDate = (date: Date) => {
  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] || ["th", "st", "nd", "rd"][day % 10] || "th";
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.toLocaleDateString('en-US', { year: '2-digit' });
  return `${weekday}, ${day}${suffix} ${month} '${year}`;
};

// Detailed Tracking Timeline Component
const TrackingTimeline = ({ status, date }: { status: string, date: string }) => {
  const orderDate = new Date(date);
  
  // Calculate dates based on 10-day delivery promise
  const processedDate = new Date(orderDate); processedDate.setDate(orderDate.getDate() + 1);
  const pickedUpDate = new Date(orderDate); pickedUpDate.setDate(orderDate.getDate() + 2);
  const shippedDate = new Date(orderDate); shippedDate.setDate(orderDate.getDate() + 3);
  const hubReceivedDate = new Date(orderDate); hubReceivedDate.setDate(orderDate.getDate() + 8); // Near delivery
  const outForDeliveryDate = new Date(orderDate); outForDeliveryDate.setDate(orderDate.getDate() + 9);
  const deliveredDate = new Date(orderDate); deliveredDate.setDate(orderDate.getDate() + 10);

  // Determine active step index for styling
  let activeStepIndex = 0;
  if (status === 'Shipped') activeStepIndex = 1;
  if (status === 'Out For Delivery') activeStepIndex = 2; 
  if (status === 'Delivered') activeStepIndex = 3;

  // Mock random ID for COD
  const trackingId = useMemo(() => `FDS${Math.floor(1000000000 + Math.random() * 9000000000)}`, []);

  const timelineEvents = [
    {
      title: `Order Confirmed ${formatDetailedDate(orderDate)}`,
      isCompleted: true,
      details: [
        { text: "Your Order has been placed.", date: formatDetailedDate(orderDate), time: "5:51 pm" },
        { text: "Seller has processed your order.", date: formatDetailedDate(processedDate), time: "8:52 pm" },
        { text: "Your item has been picked up by delivery partner.", date: formatDetailedDate(pickedUpDate), time: "4:10 pm" }
      ]
    },
    {
      title: `Shipped ${formatDetailedDate(shippedDate)}`,
      isCompleted: activeStepIndex >= 1 || status === 'Delivered',
      details: [
        { text: `Delivery COD  ${trackingId}`, isBold: true },
        { text: "Your item has been shipped.", date: formatDetailedDate(shippedDate), time: "5:01 pm" },
        { text: "Your item has been received in the hub nearest to you.", date: formatDetailedDate(hubReceivedDate), time: "11:30 am" }
      ]
    },
    {
      title: "Out For Delivery",
      isCompleted: activeStepIndex >= 2 || status === 'Delivered',
      details: [
         { text: "Your item is out for delivery.", date: formatDetailedDate(outForDeliveryDate), time: "8:30 am" }
      ]
    },
    {
      title: `Delivered ${formatDetailedDate(deliveredDate)}`,
      isCompleted: status === 'Delivered',
      details: [
        { text: "Your item has been delivered", date: formatDetailedDate(deliveredDate), time: "4:15 pm" }
      ]
    }
  ];

  return (
    <div className="pl-4 py-6 bg-white border-t border-gray-100 relative font-sans">
      <div className="space-y-0">
        {timelineEvents.map((step, idx) => (
          <div key={idx} className="relative flex gap-4">
            {/* Line connecting dots */}
            {idx !== timelineEvents.length - 1 && (
              <div className={`absolute left-[9px] top-5 bottom-[-20px] w-[2px] ${step.isCompleted && (timelineEvents[idx+1]?.isCompleted || idx < activeStepIndex) ? 'bg-[#26a541]' : 'bg-gray-200'}`}></div>
            )}
            
            {/* Dot */}
            <div className={`z-10 w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${step.isCompleted ? 'bg-[#26a541] border-[#26a541]' : 'bg-white border-gray-300'}`}></div>
            
            {/* Content */}
            <div className="flex-1 pb-8">
              <h4 className={`text-sm font-bold mb-2 ${step.isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.title}
              </h4>
              
              {/* Sub-events */}
              {step.isCompleted && (
                <div className="space-y-4 pl-1">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="text-xs">
                      {detail.isBold ? (
                        <p className="font-bold text-gray-800 mb-1">{detail.text}</p>
                      ) : (
                        <>
                          <p className="text-gray-800 font-medium">{detail.text}</p>
                          {detail.date && (
                            <p className="text-gray-500 text-[10px] mt-0.5">
                              {detail.date} - {detail.time}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Orders = () => {
  const { orders } = useOrders();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [ratedItems, setRatedItems] = useState<Record<string, boolean>>({}); 
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({}); // State for Delivery/Price toggle
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Filter Logic
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase().trim();
    return orders.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.items.some(item => item.name.toLowerCase().includes(term))
    );
  }, [orders, searchTerm]);

  const toggleExpand = (uniqueId: string) => {
    setExpandedItems(prev => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
  };

  const toggleDetails = (orderId: string) => {
    setShowDetails(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    showToast('Order ID copied to clipboard', 'success');
  };

  const handleRateProduct = (e: React.MouseEvent, uniqueId: string, rating: number) => {
    e.stopPropagation();
    setRatedItems(prev => ({ ...prev, [uniqueId]: true }));
    showToast(`You rated this product ${rating} stars!`, 'success');
  };

  const handleDownloadInvoice = (order: any) => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 116, 240); // FlipZon Blue
        doc.text('FlipZon', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Invoice / Receipt', 14, 28);

        // Order Info
        doc.setTextColor(0);
        doc.text(`Order ID: ${order.id}`, 14, 40);
        doc.text(`Order Date: ${new Date(order.date).toLocaleDateString()}`, 14, 46);
        doc.text(`Payment Method: ${order.paymentMethod}`, 14, 52);

        // Customer Details
        doc.text('Bill To:', 120, 40);
        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(order.customerDetails?.name || 'Customer', 120, 46);
        doc.text(order.customerDetails?.phone || '', 120, 52);
        const address = order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city} - ${order.shippingAddress.zip}` : '';
        const splitAddress = doc.splitTextToSize(address, 70);
        doc.text(splitAddress, 120, 58);

        // Items Table
        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = order.items.map((item: any) => [
            item.name,
            item.quantity,
            `Rs. ${item.price}`,
            `Rs. ${item.price * item.quantity}`
        ]);

        autoTable(doc, {
            startY: 75,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [40, 116, 240] },
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Amount: Rs. ${order.total}`, 140, finalY, { align: 'right' });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Thank you for shopping with FlipZon!', 14, finalY + 20);

        doc.save(`Invoice_${order.id.slice(0, 8)}.pdf`);
        showToast('Invoice PDF downloaded successfully', 'success');
    } catch (error) {
        console.error("PDF Generation Error:", error);
        showToast('Failed to generate PDF', 'error');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-100 font-sans">
        <div className="bg-gray-200 p-6 rounded-full mb-4">
            <Package size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-medium mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-2 font-medium shadow-sm rounded-sm hover:bg-blue-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  const getStatusText = (status: string, date: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 10); // Match the 10-day logic
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (status === 'Delivered') return `Delivered on ${dateStr}`;
    if (status === 'Cancelled') return `Cancelled on ${dateStr}`;
    return `Arriving by ${dateStr}`;
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4 lg:py-6 font-sans">
      <div className="max-w-[1400px] mx-auto px-2 lg:px-4">
        
        {/* Page Header with Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 lg:mb-6 gap-3">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">My Orders ({filteredOrders.length})</h2>
            
            {/* Search Orders - Visible on Mobile & Desktop */}
            <div className="flex bg-white border border-gray-300 rounded-sm overflow-hidden w-full md:w-96 shadow-sm focus-within:border-blue-500 transition-colors">
                <div className="pl-3 flex items-center justify-center">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by Order ID or Product" 
                    className="flex-1 px-3 py-2 text-sm outline-none text-gray-700" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="px-2 text-gray-400 hover:text-gray-600">
                        ×
                    </button>
                )}
                <button className="bg-[#2874f0] text-white px-4 lg:px-6 py-2 text-sm font-bold flex items-center gap-2">
                    Search
                </button>
            </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => {
            // CALCULATE ORDER LEVEL TOTALS
            const orderListingPrice = order.items.reduce((acc, i) => acc + (i.originalPrice * i.quantity), 0);
            const orderSpecialPrice = order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            const orderDiscount = orderListingPrice - orderSpecialPrice;
            const finalOrderAmount = order.total;
            const isDetailsVisible = showDetails[order.id];

            return (
              <div key={order.id} className="bg-white shadow-sm rounded-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                
                {/* Order Header Bar */}
                <div className="bg-[#f5faff] px-4 py-2 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#2874f0] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">ORDER PLACED</span>
                        <span className="text-xs text-gray-500 font-mono hidden sm:inline">ID: {order.id}</span>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <span className="text-xs text-gray-500 font-mono sm:hidden">ID: {order.id.slice(0, 12)}...</span>
                        <button 
                            onClick={() => handleCopyOrderId(order.id)} 
                            className="text-blue-600 hover:underline text-xs flex items-center gap-1 font-medium bg-white px-2 py-1 rounded border border-blue-100" 
                            title="Copy Order ID"
                        >
                            <Copy size={12} /> Copy ID
                        </button>
                    </div>
                </div>

                {/* --- MAIN CONTENT GRID --- */}
                <div className="flex flex-col lg:flex-row relative">
                    
                    {/* LEFT COLUMN: PRODUCTS LIST */}
                    <div className={`${isDetailsVisible ? 'lg:w-[70%] border-r border-gray-100' : 'w-full'} transition-all duration-300`}>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, index) => {
                                const uniqueId = `${order.id}-${item.id}-${index}`;
                                const isExpanded = expandedItems[uniqueId];
                                const isRated = ratedItems[uniqueId];
                                const statusText = getStatusText(order.status, order.date);

                                return (
                                    <div key={uniqueId}>
                                        {/* Item Row */}
                                        <div className="p-4 lg:p-6 hover:bg-gray-50 transition-colors flex gap-4 lg:gap-6 items-start">
                                            
                                            {/* Image */}
                                            <div className="w-20 h-20 lg:w-28 lg:h-28 flex-shrink-0 border border-gray-200 rounded-sm p-1 bg-white flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-start gap-1">
                                                {/* Product Name */}
                                                <h3 
                                                    className="font-medium text-sm lg:text-lg text-gray-900 line-clamp-2 leading-snug cursor-pointer hover:text-blue-600"
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                >
                                                    {item.name}
                                                </h3>
                                                
                                                {/* Category */}
                                                <p className="text-xs lg:text-sm text-gray-500">{item.category}</p>

                                                {/* Rating Badge */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="bg-[#388e3c] text-white text-[10px] lg:text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                        {item.rating} <Star size={10} fill="currentColor" />
                                                    </div>
                                                    <span className="text-xs lg:text-sm text-gray-500">({item.reviews})</span>
                                                </div>

                                                {/* Price Row */}
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="font-bold text-lg lg:text-xl text-gray-900">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                    <span className="text-gray-500 text-xs lg:text-sm line-through">
                                                        {formatPrice(item.originalPrice)}
                                                    </span>
                                                    <span className="text-green-700 font-bold text-xs lg:text-sm">
                                                        {item.discount}% Off
                                                    </span>
                                                </div>

                                                {/* Status / Delivery Info */}
                                                <div className="mt-2 text-xs lg:text-sm text-gray-900 flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-600' : 'bg-orange-500'}`}></div>
                                                    <span>{statusText}</span>
                                                </div>
                                                
                                                {/* View History / Track Button */}
                                                <button 
                                                    onClick={() => toggleExpand(uniqueId)}
                                                    className="mt-3 flex items-center gap-1 text-blue-600 font-bold text-xs lg:text-sm hover:underline w-fit"
                                                >
                                                    {order.status === 'Delivered' ? (
                                                        <>
                                                            <History size={14} /> View History
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Truck size={14} /> Track Package
                                                        </>
                                                    )}
                                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>

                                                {/* Rating Prompt (If delivered) */}
                                                {!isRated && order.status === 'Delivered' && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex text-gray-300">
                                                            {[1,2,3,4,5].map(s => (
                                                                <Star 
                                                                    key={s} 
                                                                    size={16} 
                                                                    fill="currentColor" 
                                                                    className="hover:text-yellow-400 transition-colors cursor-pointer"
                                                                    onClick={(e) => handleRateProduct(e, uniqueId, s)}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs lg:text-sm text-blue-600 font-medium">Rate Product</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Timeline */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-gray-50/50"
                                                >
                                                    <TrackingTimeline status={order.status} date={order.date} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Toggle Details Button (Visible when collapsed) */}
                        <div className="p-3 border-t border-gray-100 flex justify-center lg:justify-end">
                            <button 
                                onClick={() => toggleDetails(order.id)}
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
                            >
                                {isDetailsVisible ? 'Hide Order Details' : 'View Order Details & Invoice'} 
                                {isDetailsVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DETAILS & BUTTONS (Collapsible) */}
                    <AnimatePresence>
                        {isDetailsVisible && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, width: 0 }}
                                animate={{ opacity: 1, height: 'auto', width: 'auto' }}
                                exit={{ opacity: 0, height: 0, width: 0 }}
                                className="lg:w-[30%] bg-gray-50/30 border-l border-gray-100 lg:sticky lg:top-20 lg:h-fit lg:self-start overflow-hidden"
                            >
                                <div className="p-5">
                                    <div className="space-y-6">
                                        {/* Delivery Address */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <MapPin size={16} className="text-blue-600" />
                                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Delivery Address</h4>
                                            </div>
                                            <div className="pl-6">
                                                <h5 className="text-base font-bold text-gray-900 mb-1">{order.customerDetails?.name || 'User'}</h5>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                                    {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city} - ${order.shippingAddress.zip}` : 'Address not available'}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                                    <span className="text-gray-600 font-normal">Phone:</span>
                                                    {order.customerDetails?.phone}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200"></div>

                                        {/* Price Details */}
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Order Summary</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Listing price</span>
                                                    <span className="line-through">{formatPrice(orderListingPrice)}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-900">
                                                    <span>Special price</span>
                                                    <span>{formatPrice(orderSpecialPrice)}</span>
                                                </div>
                                                <div className="flex justify-between text-green-600 font-medium">
                                                    <span>Total discount</span>
                                                    <span>- {formatPrice(orderDiscount)}</span>
                                                </div>
                                                <div className="border-t border-gray-200 my-2"></div>
                                                <div className="flex justify-between text-base font-bold text-gray-900">
                                                    <span>Total Amount</span>
                                                    <span>{formatPrice(finalOrderAmount)}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-sm text-gray-500">Payment Mode</span>
                                                    <span className="text-xs font-bold text-gray-700 uppercase bg-white px-2 py-1 rounded border border-gray-200">
                                                        {order.paymentMethod}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BUTTONS */}
                                    <div className="mt-8 space-y-3">
                                        <button 
                                            onClick={() => handleDownloadInvoice(order)}
                                            className="w-full bg-white border border-gray-300 text-gray-800 py-3 rounded-md font-bold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Download size={16} /> Download Invoice
                                        </button>
                                        
                                        <button 
                                            onClick={() => navigate('/')}
                                            className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-md font-bold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            Shop more from FlipZon <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
              </div>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No orders found matching "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-2 text-blue-600 font-bold text-sm hover:underline">Clear Search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
