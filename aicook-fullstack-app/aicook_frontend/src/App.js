import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from './pages/Authentication/LoginPage';
import LogoutPage from './pages/Authentication/LogoutPage';
import RegisterPage from './pages/Authentication/RegisterPage';
import ResetPasswordPage from './pages/Authentication/ResetPasswordPage';
import ResetPasswordConfirmPage from './pages/Authentication/ResetPasswordConfirmPage';
import VerifyEmailPage from './pages/Authentication/VerifyEmailPage'
import HomePage from "./pages/Dashboard/HomePage";
import UserEdit from "./pages/Dashboard/UserEdit";
import UserChangePassword from "./pages/Dashboard/UserChangePassword";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ArticlePage from './pages/Dashboard/ArticlesPage';
import FavoriteRecipes from "./pages/Dashboard/FavoriteRecipes";
import HistoryRecipes from "./pages/Dashboard/HistoryRecipes";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login/Register sayfaları ayrı layout’ta */}
          <Route path="/authentication/login" element={<LoginPage />} />
          <Route path="/authentication/logout" element={<LogoutPage />} />
          <Route path="/authentication/register" element={<RegisterPage />} />
          <Route path="/authentication/reset-password" element={<ResetPasswordPage />} />
          <Route path="/authentication/reset-password-confirm" element={<ResetPasswordConfirmPage />} />
          <Route path="/authentication/verify-email" element={<VerifyEmailPage />} />
          <Route path="/articles" element={<ArticlePage />}/>
          
          
          {/* Diğer tüm sayfalar MainLayout içinde */}
          <Route element={ <ProtectedRoute> <MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />     
            <Route path="/user/edit" element={<UserEdit />} />
            <Route path="/user/change-password" element={<UserChangePassword />} />
            <Route path="/favorites" element={<FavoriteRecipes />} />
            <Route path="/histories" element={<HistoryRecipes />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
