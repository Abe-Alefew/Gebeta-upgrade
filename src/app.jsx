import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import './styles/global.css';
import './styles/variable.css';

// Import pages
import Home from './pages/Home/Home';
import About from './pages/About/about';
import Delivery from './pages/Delivery/Delivery';
import Reviews from './pages/Reviews/Reviews';
import CustomerReview from './pages/CustomerReview/CustomerReview';
import SubmitReview from './pages/SubmitReview/SubmitReview';
import Login from './pages/Login/Login';
import MenuItemDetail from './pages/MenuItemDetail/MenuItemDetail';


function Layout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login';

  return (
    <div className="app">
      {!hideHeaderFooter && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/customer-review" element={<CustomerReview />} />
          <Route path="/submit-review" element={<SubmitReview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu-item" element={<MenuItemDetail />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
export default App;