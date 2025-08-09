import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

// The AssetCard component is now imported from its own file.
// For this to work, make sure AssetCard.jsx is in the same folder.
import AssetCard from './AssetCard';

export default function MyAssets() {
  const { currentUser } = useSelector((state) => state.user);
  
  const [userAssets, setUserAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!currentUser || !currentUser._id) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      try {
        setLoading(true);
        // Corrected API endpoint to match the provided curl command and backend code.
        const res = await fetch(`/api/asset/myasset/${currentUser._id}`);
        const data = await res.json();
        
        if (res.ok) {
          // The fix: The backend API returns the array directly, not nested under a 'data' key.
          setUserAssets(data); 
          setError(null);
        } else {
          setError(data.message || "Failed to fetch assets.");
          setUserAssets([]);
        }
      } catch (error) {
        setError("Network error: Could not connect to the server.");
        console.error("Failed to fetch assets:", error.message);
        setUserAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [currentUser]);

  return (
    <div className='p-3 w-full max-w-6xl mx-auto'>
      <h2 className='text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white'>My Assets</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : userAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAssets.map((asset) => (
            <AssetCard key={asset._id} asset={asset} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">You have not created any assets yet.</p>
      )}
    </div>
  );
}