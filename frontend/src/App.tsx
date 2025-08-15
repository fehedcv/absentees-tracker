import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MarkAttendance from './components/MarkAttendance';
import ViewAttendance from './components/ViewAttendance';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
          <Route path="/view-attendance" element={<ViewAttendance />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;