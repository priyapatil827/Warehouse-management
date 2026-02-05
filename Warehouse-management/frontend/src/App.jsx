import './App.css'
import { Routes, Route } from "react-router-dom";
import SignUp from './components/Manager/SignUp/SignUp'
import SignIn from './components/Manager/SignIn/SignIn'
import VerifyOtp from './components/Manager/VerifyOtp/VerifyOtp';
import FirstPage from './components/FirstPage/FirstPage';
import SelectPage from './components/Manager/SelectPage/selectPage';
import Navbar from './components/Manager/Navbar/Navbar';
import Dashboard from './components/Manager/Dashboard/Dashboard';
import Profile from './components/Manager/Profile/Profile';
import ProductManagement from './components/Manager/Products/ProductManagement/ProductManagement';
import StockControl from './components/Manager/StockControl/StockControl';
import OrderManagement from './components/Manager/OrderManagement/OrderManagement';
import Supplier from './components/Manager/Supplier/Supplier';
// import Employee from './components/Manager/Employee/Employee';
import Report from './components/Manager/Report/Report';
import Setting from './components/Manager/Setting/Setting';
import Employees from './components/Manager/EmployeeManagement/Employee/Employees';
// import AddProduct from './components/Manager/AddProduct/AddProduct';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/" element={<FirstPage />} />
      <Route path="/select-page" element={< SelectPage />} />
      <Route path='/navbar' element={<Navbar />}></Route>
      <Route path='/dashboard' element={<Dashboard />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/product' element={<ProductManagement />}></Route>
   <Route path='/stock-control' element={<StockControl />}></Route>
      <Route path='/order' element={<OrderManagement />}></Route>
      <Route path='/supplier' element={<Supplier />}></Route>
      <Route path='/report' element={<Report />}></Route>
      <Route path='/setting' element={<Setting />}></Route>
      <Route path='/employees' element={<Employees />}></Route>
    </Routes>
  )
}

export default App
