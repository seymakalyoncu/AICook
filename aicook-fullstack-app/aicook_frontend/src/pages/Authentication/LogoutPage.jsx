import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  logout();
  navigate('/');

};

export default LogoutPage;
