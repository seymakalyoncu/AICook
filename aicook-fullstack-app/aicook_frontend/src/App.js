import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from './pages/Authentication/LoginPage';
import LogoutPage from './pages/Authentication/LogoutPage';
import RegisterPage from './pages/Authentication/RegisterPage';
import ResetPasswordPage from './pages/Authentication/ResetPasswordPage';
import ResetPasswordConfirmPage from './pages/Authentication/ResetPasswordConfirmPage';
import VerifyEmailPage from './pages/Authentication/VerifyEmailPage'
import BabysitterVerifyEmail from "./pages/Authentication/BabysitterVerifyEmail";


import HomePage from "./pages/Dashboard/HomePage";
import Meals from "./pages/Dashboard/Meals";
import Sleep from "./pages/Dashboard/Sleep";
import Physical from "./pages/Dashboard/Physical";
import Cognitive from "./pages/Dashboard/Cognitive";
import Emotional from "./pages/Dashboard/Emotional";
import Motor from "./pages/Dashboard/Motor";
import Illness from "./pages/Dashboard/Illness";
import Vaccine from "./pages/Dashboard/Vaccine";
import DailyEvent from "./pages/Dashboard/DailyEvent";
import Children from "./pages/Dashboard/Children";
import BabySitters from "./pages/Dashboard/BabySitters";
import Reports from "./pages/Dashboard/Reports";
import ChildSuggestions from "./pages/Dashboard/ChildSuggestions"
import UserEdit from "./pages/Dashboard/UserEdit";
import UserChangePassword from "./pages/Dashboard/UserChangePassword";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import ArticlePage from './pages/Dashboard/ArticlesPage';


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
          <Route path="/authentication/babysitter-verify-email" element={<BabysitterVerifyEmail />} />
          <Route path="/articles" element={<ArticlePage />}/>
          
          
          {/* Diğer tüm sayfalar MainLayout içinde */}
          <Route element={ <ProtectedRoute> <MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/physical" element={<Physical />} />
            <Route path="/cognitive" element={<Cognitive />} />
            <Route path="/emotional" element={<Emotional />} />
            <Route path="/motor" element={<Motor />} />
            <Route path="/illness" element={<Illness />} />
            <Route path="/vaccine" element={<Vaccine />} />
            <Route path="/daily-event" element={<DailyEvent />} />
            <Route path="/children" element={<Children />} />
            <Route path="/babysitters" element={<BabySitters />} />
            <Route path="/user/edit" element={<UserEdit />} />
            <Route path="/user/change-password" element={<UserChangePassword />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/child-suggestions" element={<ChildSuggestions />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
