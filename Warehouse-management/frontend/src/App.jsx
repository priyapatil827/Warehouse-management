import './App.css'
import { Routes, Route } from "react-router-dom";
import SignUp from './components/Manager/SignUp/SignUp'
import SignIn from './components/Manager/SignIn/SignIn'
import VerifyOtp from './components/VerifyOtp/VerifyOtp';
import FirstPage from './components/FirstPage/FirstPage';
import SelectPage from './components/Manager/SelectPage/selectPage';
import Navbar from './components/Manager/Navbar/Navbar';
import Dashboard from './components/Manager/Dashboard/Dashboard';
import Profile from './components/Manager/Profile/Profile';
import ProductManagement from './components/Manager/Products/ProductManagement/ProductManagement';
import StockControl from './components/Manager/StockControl/StockControl';
// import Order from './components/Manager/Order/Order';
import Supplier from './components/Manager/Supplier/Supplier';
// import Employee from './components/Manager/Employee/Employee';
import Report from './components/Manager/Report/Report';
import Setting from './components/Manager/Setting/Setting';
import Employees from './components/Manager/EmployeeManagement/Employee/Employees';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ChangePassword from './components/ChangePassword/ChangePassword';
import EMPSignIn from './components/Employee/SignIn/EMPSignIn';
// import AddProduct from './components/Manager/AddProduct/AddProduct';
// import EmpDashboard from './components/Employee/empDashboard/empDashboard';
import EmpNavbar from './components/Employee/EmpNavbar/EmpNavbar';
import EmpProduct from './components/Employee/EmpProduct/EmpProduct';
import EmpBilling from './components/Employee/EmpBilling/EmpBilling';
import ForgetVerifyOtp from './components/ForgetVerifyOtp/ForgetVerifyOtp';
import EmpBillsHistory from './components/Employee/EmpBillHistory/EmpBillHistory';
import EmpReport from './components/Employee/EmpReport/EmpReport';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/select-page" element={< SelectPage />} />
      <Route path='/navbar' element={<Navbar />}></Route>
      <Route path='/dashboard' element={<Dashboard />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/product' element={<ProductManagement />}></Route>
      <Route path='/stock-control' element={<StockControl />}></Route>
      {/* <Route path='/order' element={<Order />}></Route> */}
      <Route path='/supplier' element={<Supplier />}></Route>
      <Route path='/report' element={<Report />}></Route>
      <Route path='/setting' element={<Setting />}></Route>
      <Route path='/employees' element={<Employees />}></Route>
      <Route path='/forget-password' element={<ForgetPassword />}></Route>
      <Route path='/forget-verify-otp' element={<ForgetVerifyOtp/>}></Route>
      <Route path='/change-password' element={<ChangePassword />}></Route>

      {/* Employee routes */}
      <Route path='/employee-signin' element={<EMPSignIn />}></Route>
      {/* <Route path='/empDashboard' element={<EmpDashboard />}></Route> */}
      <Route path='/empNavbar' element={<EmpNavbar />}></Route>
      <Route path='/empProduct' element={<EmpProduct />}></Route>
      <Route path='/empBilling' element={<EmpBilling/>}></Route>
      <Route path='/empBillHistory' element={<EmpBillsHistory/>}></Route>
      <Route path='/empReport' element={<EmpReport/>}></Route>
    </Routes>
  )
}

export default App;
