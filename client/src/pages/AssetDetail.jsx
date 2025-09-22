import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUsers, FaBuilding, FaTag, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope , FaGlobe, FaLayerGroup } from 'react-icons/fa';

// Booking Modal Component
function BookingModal({ isOpen, onClose, assetName, assetId, theme }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Theme-dependent styles for the modal
  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const successColor = 'text-green-500';
  const errorColor = 'text-red-500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!startDate || !endDate || !purpose || !attendeeCount) {
      setError('Please fill in all required fields (Start Date, End Date, Purpose, Attendee Count).');
      setLoading(false);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('End Date cannot be before Start Date.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/booking/${assetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          purpose,
          attendeeCount: Number(attendeeCount),
          specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to create booking.');
      }

      setSuccess(data.message || 'Booking created successfully!');
      
      // Clear form fields after successful booking
      setStartDate('');
      setEndDate('');
      setPurpose('');
      setAttendeeCount('');
      setSpecialRequests('');

      // Close the modal after a short delay to allow success message to be seen
      setTimeout(() => {
        onClose();
        setSuccess(''); // Clear success message when modal closes
      }, 1500); // Close after 1.5 seconds

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className={`${modalBg} rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto my-8 relative ${textColor}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-bold z-10"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Book {assetName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                id="startDate"
                // Changed focus ring and border color to yellow-400 for consistency
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring focus:ring-yellow-400 focus:border-yellow-400`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                id="endDate"
                // Changed focus ring and border color to yellow-400 for consistency
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring focus:ring-yellow-400 focus:border-yellow-400`}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium mb-1">Purpose</label>
            <input
              type="text"
              id="purpose"
              // Changed focus ring and border color to yellow-400 for consistency
              className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring focus:ring-yellow-400 focus:border-yellow-400`}
              placeholder="e.g., Team meeting, Workshop"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="attendeeCount" className="block text-sm font-medium mb-1">Attendee Count</label>
            <input
              type="number"
              id="attendeeCount"
              // Changed focus ring and border color to yellow-400 for consistency
              className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring focus:ring-yellow-400 focus:border-yellow-400`}
              placeholder="e.g., 10"
              min="1"
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              rows="3"
              // Changed focus ring and border color to yellow-400 for consistency
              className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring focus:ring-yellow-400 focus:border-yellow-400`}
              placeholder="Any specific needs like projector, catering, etc."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            ></textarea>
          </div>

          {error && <p className={`${errorColor} text-sm mt-2`}>{error}</p>}
          {success && <p className={`${successColor} text-sm mt-2`}>{success}</p>}

          <button
            type="submit"
            className={`
              w-full py-3 rounded-lg text-lg font-semibold text-white
              bg-yellow-400 hover:bg-yellow-500 // Changed from gradient to solid yellow
              shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
              transform hover:scale-105 active:scale-100
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}


export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // State for modal visibility

  const { theme } = useSelector((state) => state.theme);

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
    // Filter out any empty strings or null/undefined values before joining
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

  if (loading) return <div className={`text-center mt-20 text-lg ${textColor}`}>Loading...</div>;
  if (error) return <div className={`text-center text-red-500 mt-20 ${textColor}`}>{error}</div>;

  // Corrected Image fallback logic:
  const displayImage = asset?.image && asset.image !== ''
    ? asset.image
    : 'https://firebasestorage.googleapis.com/v0/b/mern-blog-5bc38.appspot.com/o/1753370322944-premium_photo-1679547202918-bf37285d3caf.avif?alt=media&token=ae868477-bdf6-4cf0-8cd4-87bda8c27421';

  const handleBookNow = () => {
    setIsBookingModalOpen(true); // Open the modal
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false); // Close the modal
  };

  // Add a check for asset being null after loading and error checks
  if (!asset) {
    return <div className={`text-center mt-20 ${textColor}`}>Asset not found.</div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-12`}>
      <div className={`max-w-6xl mx-auto px-4 ${containerBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden`}>
        {/* Image Section */}
        <div className="relative h-96 w-full pt-4">
          <img
            src={displayImage}
            alt={asset.name}
            className="w-full h-full object-cover rounded-t-xl"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/1200x600/F3F4F6/9CA3AF?text=No+Image+Available'; }}
          />
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <h2 className={`text-4xl font-extrabold ${headingColor}`}>
            {asset.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`flex items-center ${subTextColor}`}>
              <FaMapMarkerAlt className="mr-3 text-xl text-red-500" />
              <p className="text-lg">
                <strong>Address:</strong> {getFullAddress(asset.address)}
              </p>
            </div>

            <div className={`flex items-center ${subTextColor}`}>
              <FaBuilding className="mr-3 text-xl text-indigo-500" />
              <p className="text-lg">
                <strong>Institution:</strong> {asset.institutionName}
              </p>
            </div>

            <div className={`flex items-center ${subTextColor}`}>
              <FaTag className="mr-3 text-xl text-purple-500" />
              <p className="text-lg">
                <strong>Type:</strong> {asset.type}
              </p>
            </div>

            <div className={`flex items-center ${subTextColor}`}>
              <FaUsers className="mr-3 text-xl text-blue-700" />
              <p className="text-lg">
                <strong>Capacity:</strong> {asset.capacity} people
              </p>
            </div>

            {asset.website && (
              <div className={`flex items-center ${subTextColor}`}>
                <FaGlobe className="mr-3 text-xl text-green-600" />
                <p className="text-lg">
                  <strong>Website:</strong>{' '}
                  <a
                    href={asset.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {asset.website}
                  </a>
                </p>
              </div>
            )}

            {asset.category && (
              <div className={`flex items-center ${subTextColor}`}>
                <FaLayerGroup className="mr-3 text-xl text-pink-500" />
                <p className="text-lg">
                  <strong>Category:</strong> {asset.category}
                </p>
              </div>
            )}
          </div>
         
          <hr className={`border-t ${borderColor}`} />

          {/* Description Section */}
          <div>
            <h3 className={`text-2xl font-bold mb-3 ${headingColor}`}>Description</h3>
            <div
              className={`prose prose-lg max-w-none ${textColor} ${theme === 'dark' ? 'prose-invert' : ''}`}
              dangerouslySetInnerHTML={{ __html: asset.description || 'No description available.' }}
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

          {/* Owner Details Section */}
          {asset.ownerId && asset.ownerId.email && (
            <div className="pt-6">
              <h3 className={`text-2xl font-bold mb-3 ${headingColor}`}>Owner Email</h3>
              <div className="space-y-2">
                <p className={`flex items-center text-lg ${textColor}`}>
                  <FaEnvelope className={`mr-3 text-xl ${subTextColor}`} />
                  <strong className={textColor}>Email:</strong> <a href={`mailto:${asset.ownerId.email}`} className="text-blue-500 hover:underline">{asset.ownerId.email}</a>
                </p>
              </div>
            </div>
          )}
          
          <div className="pt-6">
            <button
              onClick={handleBookNow}
              className={`
                w-full flex items-center justify-center py-3 rounded-lg text-xl font-bold text-white
                bg-yellow-400 hover:bg-yellow-500 // Changed from gradient to solid yellow
                shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
                transform hover:scale-105 active:scale-100
              `}
            >
              <FaCalendarAlt className="mr-3" />
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal Component */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        assetName={asset.name}
        assetId={asset._id}
        theme={theme}
      />
    </div>
  );
}