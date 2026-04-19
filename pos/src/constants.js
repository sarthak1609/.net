export const VIEWS = {
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  ORDER_LIST: 'order_list',
  ORDER_DETAIL: 'order_detail',
  PAYMENT_LIST: 'payment_list',
  POS_SESSION: 'pos_session',
  CUSTOMER_LIST: 'customer_list',
  CUSTOMER_DETAIL: 'customer_detail',
  PRODUCT_LIST: 'product_list',
  PRODUCT_DETAIL: 'product_detail',
  CATEGORY_LIST: 'category_list',
  FLOOR_DETAIL: 'floor_detail',
  REPORTING_DASHBOARD: 'reporting_dashboard',
  KITCHEN_DISPLAY: 'kitchen_display',
  CUSTOMER_DISPLAY: 'customer_display' // Added
};

export const MOCK_ORDERS = [
  { id: 1, orderNo: '001', session: '01', date: '5 Jan 2026', total: 350.00, customer: 'Eric', status: 'Draft' },
  { id: 2, orderNo: '002', session: '01', date: '5 Jan 2026', total: 350.00, customer: 'Smith', status: 'Paid' },
  { id: 3, orderNo: '003', session: '01', date: '5 Jan 2026', total: 350.00, customer: 'Jacob', status: 'Paid' },
];

export const MOCK_PAYMENTS = [
  { id: 1, method: 'Card', date: '5 Jan 25', amount: 2000 },
  { id: 2, method: 'Cash', date: '5 Jan 25', amount: 4500 },
  { id: 3, method: 'Cash', date: '4 Jan 25', amount: 500 },
  { id: 4, method: 'Cash', date: '5 Jan 25', amount: 1000 },
  { id: 5, method: 'UPI', date: '5 Jan 25', amount: 15000 },
];

export const MOCK_ORDER_LINES = [
  { id: 101, product: 'Burger', qty: 5, amount: 25, tax: '5%', uom: 'Unit', subTotal: 125, total: 131.25 },
  { id: 102, product: 'Coffee', qty: 5, amount: 25, tax: '5%', uom: 'Unit', subTotal: 125, total: 131.25 },
  { id: 103, product: 'Sandwich', qty: 5, amount: 25, tax: '5%', uom: 'Unit', subTotal: 125, total: 131.25 },
];

export const MOCK_CUSTOMERS = [
  { id: 1, name: 'Eric', email: 'eric@odoo.com', phone: '+91 9898989898', sales: 2000 },
  { id: 2, name: 'Smith', email: 'smith@odoo.com', phone: '+91 9898989898', sales: 1500 },
  { id: 3, name: 'John Doe', email: 'john@odoo.com', phone: '+91 9898989898', sales: 5000 },
  { id: 4, name: 'Jane', email: 'jane@odoo.com', phone: '+91 9898989898', sales: 2000 },
];

export const MOCK_PRODUCTS = [
  { id: 1, name: 'Burger', price: 15, tax: '5%', uom: 'Unit', category: 'Quick Bites' },
  { id: 2, name: 'Pizza', price: 250, tax: '5%', uom: 'Unit', category: 'Quick Bites' },
  { id: 3, name: 'Maggie', price: 70, tax: '5%', uom: 'Unit', category: 'Quick Bites' },
  { id: 4, name: 'Fries', price: 120, tax: '5%', uom: 'Unit', category: 'Quick Bites' },
  { id: 5, name: 'Coffee', price: 50, tax: '5%', uom: 'Unit', category: 'Drinks' },
  { id: 6, name: 'Tea', price: 35, tax: '5%', uom: 'Unit', category: 'Drinks' },
  { id: 7, name: 'Diet Coke', price: 70, tax: '5%', uom: 'Unit', category: 'Drinks' },
  { id: 8, name: 'Fanta', price: 60, tax: '5%', uom: 'Unit', category: 'Drinks' },
  { id: 9, name: 'Milkshake', price: 140, tax: '5%', uom: 'Unit', category: 'Drinks' },
  { id: 10, name: 'Pasta', price: 200, tax: '5%', uom: 'Unit', category: 'Quick Bites' },
  { id: 11, name: 'Water', price: 30, tax: '5%', uom: 'Unit', category: 'Drinks' },
  { id: 12, name: 'Brownie', price: 100, tax: '5%', uom: 'Unit', category: 'Desert' },
];

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Quick Bites', color: 'bg-indigo-600' },
  { id: 2, name: 'Drinks', color: 'bg-amber-700' },
  { id: 3, name: 'Desert', color: 'bg-emerald-700' },
];

export const MOCK_TABLES = [
  { id: 101, number: '1', seats: 5, active: true },
  { id: 102, number: '2', seats: 8, active: true },
  { id: 103, number: '3', seats: 4, active: true },
  { id: 104, number: '4', seats: 2, active: true },
  { id: 105, number: '5', seats: 6, active: true },
  { id: 106, number: '6', seats: 4, active: true },
  { id: 107, number: '7', seats: 2, active: true },
];

export const MOCK_FLOORS = [
  { id: 1, name: 'Main Floor', tables: MOCK_TABLES },
  { id: 2, name: 'Patio', tables: [
      { id: 201, number: 'P1', seats: 4, active: true },
      { id: 202, number: 'P2', seats: 2, active: true },
  ]},
  { id: 3, name: 'Second Floor', tables: [
       { id: 301, number: '201', seats: 8, active: true },
       { id: 302, number: '202', seats: 4, active: true },
  ]}
];