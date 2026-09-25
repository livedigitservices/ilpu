import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServiceBookingPage from './pages/ServiceBookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:serviceId" element={<ServiceBookingPage />} />
        <Route path="/booking-success/:bookingId" element={<BookingSuccessPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
