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


  const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/mern-blog-5bc38.appspot.com/o/1753370322944-premium_photo-1679547202918-bf37285d3caf.avif?alt=media&token=ae868477-bdf6-4cf0-8cd4-87bda8c27421';


  return (
    <div
      className={`
        rounded-lg shadow-md overflow-hidden border ${borderColor} ${bgColor} max-w-md w-full
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-xl
        ${textColor}
      `}
    >
      {/* Image */}
      <div className="relative h-56 w-full">
        <img
          src={asset.image && asset.image !== '' ? asset.image : defaultImage}
          alt={asset.name || 'Asset'}
          className="object-cover w-full h-full"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
        />
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

        {/* View Button - Updated Style */}
        <Link
          to={`/asset/${asset._id}`}
          className={`
            block mt-4 text-center py-2.5 rounded-md text-white font-semibold
            bg-gradient-to-r from-purple-600 to-pink-600
            shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
            transform hover:scale-105 active:scale-100
          `}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}