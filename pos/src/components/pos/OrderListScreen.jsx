import React from 'react';

const OrderListScreen = () => {
  return (
    <div className="h-full bg-white shadow-sm p-8 flex items-center justify-center animate-in fade-in">
      <div className="text-center text-gray-500">
        <h3 className="text-xl font-medium mb-2">No Active Orders</h3>
        <p>Select a table to start a new order.</p>
      </div>
    </div>
  );
};

export default OrderListScreen;
