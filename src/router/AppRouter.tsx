import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import DashboardPage from '@/features/home/pages/HomePage';
import TravelRequestPage from '@/features/travel-request/pages/RequestPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/travel-request'
          element={
            <ProtectedRoute>
              <TravelRequestPage />
            </ProtectedRoute>
          }
        />
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
