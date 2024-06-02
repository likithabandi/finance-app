import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home.jsx';
import Partners from './components/Partners';
import AddPartner from './components/AddPartner';
import EditPartner from './components/EditPartner';
import Products from './components/Products';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Invoices from './components/Invoices';
import AddInvoice from './components/AddInvoice';
import InvoiceReport from './components/InvoiceReport';
import Transactions from './components/Transactions';
import AddTransaction from './components/AddTransaction';
import Ledger from './components/Ledger';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Partners partnerType={"customer"} />} />
        <Route path="/customers/add" element={<AddPartner partnerType={"customer"} />} />
        <Route path="/customers/edit" element={<EditPartner partnerType={"customer"} />} />
        <Route path="/vendors" element={<Partners partnerType={"vendor"} />} />
        <Route path="/vendors/add" element={<AddPartner partnerType={"vendor"} />} />
        <Route path="/vendors/edit" element={<EditPartner partnerType={"vendor"} />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/edit" element={<EditProduct />} />
        <Route path="/salesinvoices" element={<Invoices invoiceType={"sales"}/>} />
        <Route path="/salesinvoices/add" element={<AddInvoice invoiceType={"sales"} />} />
        <Route path="/salesinvoices/view" element={<InvoiceReport invoiceType={"sales"} />} />
        <Route path="/purchaseinvoices" element={<Invoices invoiceType={"purchase"}/>} />
        <Route path="/purchaseinvoices/add" element={<AddInvoice invoiceType={"purchase"} />} />
        <Route path="/purchaseinvoices/view" element={<InvoiceReport invoiceType={"purchase"} />} />
        <Route path="/payments" element={<Transactions transactionType={"payment"}/>} />
        <Route path="/payments/add" element={<AddTransaction transactionType={"payment"}/>} />
        <Route path="/receipts" element={<Transactions transactionType={"receipt"}/>} />
        <Route path="/receipts/add" element={<AddTransaction transactionType={"receipt"}/>} />
        <Route path="/ledger" element={<Ledger />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;