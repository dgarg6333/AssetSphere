import { Link } from 'react-router-dom';
import { FaUsers, FaMapMarkerAlt } from 'react-icons/fa'; // Added FaMapMarkerAlt for location icon
import { useSelector } from 'react-redux';

export default function AssetCard({ asset }) {
  const { theme } = useSelector((state) => state.theme);

  // Theme-based styling
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-800';
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const descriptionColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const capacityLocationColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';


  const defaultImage = 'https://placehold.co/600x400?text=No+Image';

  const getStatusColor = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 border border-green-500';
      case 'BOOKED':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800 border border-red-500';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-400';
    }
  };

  return (
    <div
      className={`
        rounded-lg shadow-md overflow-hidden border ${borderColor} ${bgColor} max-w-md w-full
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-xl
        ${textColor}
      `}
    >
      {/* Image with status badge */}
      <div className="relative h-56 w-full">
        <img
          src={asset.image && asset.image !== '' ? asset.image : defaultImage}
          alt={asset.name || 'Asset'}
          className="object-cover w-full h-full"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
        />

        {/* Rectangular Status Badge */}
        {asset.status && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-md ${getStatusColor(asset.status)}`}
          >
            {asset.status}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-3"> {/* Increased space-y for slightly more breathing room */}
        <h3 className="text-xl font-bold truncate">{asset.name || 'Unnamed Asset'}</h3> {/* Slightly larger font for name */}

        {/* Description */}
        {asset.description && (
          <p className={`text-sm ${descriptionColor} line-clamp-2`}>{asset.description}</p>
        )}

        {/* Capacity and Location */}
        <div className={`flex items-center justify-between text-sm ${capacityLocationColor}`}>
          <div className="flex items-center">
            <FaUsers className="mr-2 text-blue-500 text-lg" /> {/* Slightly larger icon */}
            <span>{asset.capacity || 'N/A'} people</span>
          </div>
          <div className="flex items-center text-right">
            {asset.address?.city && (
              <>
                <FaMapMarkerAlt className="mr-1 text-red-500 text-md" /> {/* Location icon */}
                <span className="text-sm">{asset.address.city}</span> {/* Consistent text size */}
              </>
            )}
          </div>
        </div>

        {/* View Button */}
        <Link
          to={`/asset/${asset._id}`}
          className="block mt-4 text-center bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out" // Slightly more padding and smoother transition
        >
          View Details
        </Link>
      </div>
    </div>
  );
}