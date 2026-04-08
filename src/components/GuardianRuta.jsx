import { Navigate } from 'react-router-dom';

function GuardianRuta({ logeado, children }) {
  if (!logeado) {
    return <Navigate to="/store" />;
  }
  return children;
}

export default GuardianRuta;
