import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashProfile';
// import DashAssets from '../components/DashAssets'; // Keep commented as per your original code
import DashSidebar from '../components/DashSidebar'

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar - This is where the primary theme styling will be applied */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* assets... (uncomment when DashAssets is ready) */}
      {/* {tab === 'assets' && <DashAssets />} */}
    </div>
  );
}