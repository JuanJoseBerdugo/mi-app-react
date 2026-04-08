import { Outlet } from 'react-router-dom';
import MiniCarrito from './MiniCarrito';

function StoreLayout() {
  return (
    <>
      <Outlet />
      <MiniCarrito />
    </>
  );
}

export default StoreLayout;
