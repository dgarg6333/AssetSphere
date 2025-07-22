import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector for theme
import { FaUsers, FaBuilding, FaTag, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'; // Added more icons

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { theme } = useSelector((state) => state.theme); // Get theme from Redux store

  // Define theme-dependent styles
  const containerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const fetchAsset = async () => {
    try {
      const res = await fetch(`/api/asset/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch asset');
      }
      setAsset(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const getFullAddress = (address) => {
    if (!address) return 'N/A';
    return [
      address.buildingName,
      address.street,
      address.locality,
      address.city,
      address.district,
      address.state,
      address.pincode,
    ].filter(Boolean).join(', ');
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    let bgColorClass, textColorClass, icon;

    switch (s) {
      case 'AVAILABLE':
        bgColorClass = 'bg-green-600';
        textColorClass = 'text-white';
        icon = <FaCheckCircle className="mr-1" />;
        break;
      case 'BOOKED':
        bgColorClass = 'bg-yellow-500';
        textColorClass = 'text-white';
        icon = <FaClock className="mr-1" />;
        break;
      case 'UNAVAILABLE':
        bgColorClass = 'bg-red-600';
        textColorClass = 'text-white';
        icon = <FaTimesCircle className="mr-1" />;
        break;
      default:
        bgColorClass = 'bg-gray-500';
        textColorClass = 'text-white';
        icon = null;
    }

    return (
      <div className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold ${bgColorClass} ${textColorClass}`}>
        {icon}
        <span>{s}</span>
      </div>
    );
  };

  if (loading) return <div className={`text-center mt-20 text-lg ${textColor}`}>Loading...</div>;
  if (error) return <div className={`text-center text-red-500 mt-20 ${textColor}`}>{error}</div>;

  // Fallback for image if asset.image is null or empty
  let displayImage = "https://firebasestorage.googleapis.com/v0/b/mern-blog-5bc38.appspot.com/o/1753182643840-download.jpg?alt=media&token=a3069427-679c-4ea7-b9e4-da20a4f4d025";
  if(asset.image !=""){
    displayImage = asset.image
  }


  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-12`}>
      <div className={`max-w-6xl mx-auto px-4 ${containerBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden`}>
        {/* Image Section */}
        <div className="relative h-96 w-full">
          <img
            src={displayImage}
            className="w-full h-full object-cover rounded-t-xl"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/1200x600/F3F4F6/9CA3AF?text=No+Image+Available'; }}
          />
          <div className="absolute top-6 left-6">
            {getStatusBadge(asset.status)}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <h2 className={`text-4xl font-extrabold ${headingColor}`}>{asset.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`flex items-center ${subTextColor}`}>
              <FaMapMarkerAlt className="mr-3 text-xl text-blue-500" />
              <p className="text-lg">{getFullAddress(asset.address)}</p>
            </div>
            <div className={`flex items-center ${subTextColor}`}>
              <FaBuilding className="mr-3 text-xl text-indigo-500" />
              <p className="text-lg"><strong>Institution:</strong> {asset.institutionName}</p>
            </div>
            <div className={`flex items-center ${subTextColor}`}>
              <FaTag className="mr-3 text-xl text-purple-500" />
              <p className="text-lg"><strong>Type:</strong> {asset.type}</p>
            </div>
            <div className={`flex items-center ${subTextColor}`}>
              <FaUsers className="mr-3 text-xl text-teal-500" />
              <p className="text-lg"><strong>Capacity:</strong> {asset.capacity} people</p>
            </div>
          </div>

          <hr className={`border-t ${borderColor}`} />

          {/* Description Section */}
          <div>
            <h3 className={`text-2xl font-bold mb-3 ${headingColor}`}>Description</h3>
            <div
              className={`prose prose-lg max-w-none ${textColor} ${theme === 'dark' ? 'prose-invert' : ''}`}
              dangerouslySetInnerHTML={{ __html: asset.description }}
            />
          </div>

          {/* Features Section */}
          {asset.features?.length > 0 && (
            <div>
              <h3 className={`text-2xl font-bold mb-3 ${headingColor}`}>Features</h3>
              <div className="flex flex-wrap gap-3">
                {asset.features.map((f, idx) => (
                  <span
                    key={idx}
                    className={`bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full font-medium ${theme === 'dark' ? 'dark:bg-blue-900 dark:text-blue-200' : ''}`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Section */}
          {asset.amenities?.length > 0 && (
            <div>
              <h3 className={`text-2xl font-bold mb-3 ${headingColor}`}>Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {asset.amenities.map((a, idx) => (
                  <span
                    key={idx}
                    className={`bg-green-100 text-green-700 text-sm px-4 py-2 rounded-full font-medium ${theme === 'dark' ? 'dark:bg-green-900 dark:text-green-200' : ''}`}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}