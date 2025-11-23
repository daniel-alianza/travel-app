import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import DashboardPage from '@/features/home/pages/HomePage';
import TravelRequestPage from '@/features/travel-request/pages/RequestPage';
import ReviewPage from '@/features/travel-request-review/pages/ReviewPage';
import DispersionPage from '@/features/travel-dispersion/pages/DispersionPage';
import ManagementCardPage from '@/features/travel-management-card/pages/ManagementCardPage';
import { TravelPage } from '@/features/travel-checks/pages/TravelPage';
import EmployeeChecksPage from '@/features/travel-employee-checks/pages/Employee-checks';

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
        <Route
          path='/travel-request-review'
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/travel-dispersion'
          element={
            <ProtectedRoute>
              <DispersionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/travel-management-card'
          element={
            <ProtectedRoute>
              <ManagementCardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/travel-checks'
          element={
            <ProtectedRoute>
              <TravelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/travel-employee-checks'
          element={
            <ProtectedRoute>
              <EmployeeChecksPage />
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
