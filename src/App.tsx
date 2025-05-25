import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TimerPage from './pages/timer';
import Homepage from './pages/homepage';
import Register from './pages/register';
import Operations from './pages/operations';
import Login from './pages/login';
import RequireAuth from './components/requireAuth';   // 👈 thêm dòng này
import './App.css';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/"           element={<Homepage />} />
          <Route path="/timerpage"  element={<TimerPage />} />
          <Route path="/operations" element={<Operations />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </Router>
    
  );
}

export default App;
