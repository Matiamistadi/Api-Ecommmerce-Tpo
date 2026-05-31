import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
