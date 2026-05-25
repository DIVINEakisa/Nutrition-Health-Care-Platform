import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './components/sections/HomePage.jsx';
import CoursesPage from './components/sections/CoursesPage.jsx';
import AppointmentsPage from './components/sections/AppointmentsPage.jsx';
import AuthPage from './components/sections/AuthPage.jsx';
import DashboardPage from './components/dashboard/DashboardPage.jsx';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const navigate = (page) => {
    setActivePage(page);
    if (page !== 'courses') {
      setSelectedCourse(null);
    }
  };

  const openCourse = (course) => {
    setSelectedCourse(course);
    setActivePage('courses');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedCourse?.id]);

  return (
    <div className="min-h-screen text-ink">
      <Navbar activePage={activePage} onNavigate={navigate} />
      {activePage === 'home' && <HomePage onNavigate={navigate} onCourseSelect={openCourse} />}
      {activePage === 'courses' && (
        <CoursesPage
          selectedCourse={selectedCourse}
          onCourseSelect={openCourse}
          onBackToCatalog={() => setSelectedCourse(null)}
        />
      )}
      {activePage === 'appointments' && <AppointmentsPage />}
      {activePage === 'dashboard' && <DashboardPage />}
      {activePage === 'auth' && <AuthPage />}
      <Footer onNavigate={navigate} />
    </div>
  );
}

