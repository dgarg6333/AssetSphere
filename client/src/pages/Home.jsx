import { Link } from 'react-router-dom';
// Removed Button from flowbite-react as we'll use native button
// import { Button } from 'flowbite-react';
import { HiArrowRight } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function Home() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-950 text-white' : 'bg-orange-50'}`}>
      {/* Hero Section */}
      <div className='relative overflow-hidden py-24 md:py-32'>
        {/* Subtle background gradient for a cleaner look, inspired by the image's warm backdrop */}
        <div className={`absolute inset-0 z-0 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-orange-100 to-orange-200'}`}></div>

        <div className='relative z-10 flex flex-col gap-6 p-4 px-3 max-w-6xl mx-auto text-center md:text-left'>
          {/* Welcome line: Entirely blue as per the last specific request */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md text-blue-800`}>
            Welcome to ATI CTI
          </h1>
          <p className={`text-lg sm:text-xl leading-relaxed max-w-4xl mx-auto md:mx-0 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Your ultimate platform to seamlessly discover, register, and book valuable institutional assets. Optimize resource utilization across government departments and ministries.
          </p>
          <div className="flex justify-center md:justify-start mt-4">
            <Link to='/search'>
              <button
                // Added 'flex', 'items-center', 'justify-center', and 'gap-3' for alignment.
                // Wrapped text in a span with 'whitespace-nowrap' to keep it on one line.
                className='px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 bg-yellow-400 hover:bg-yellow-500 text-white flex items-center justify-center gap-3'
              >
                <span className="whitespace-nowrap">View All Available Assets & Book</span>
                <HiArrowRight className='h-5 w-5' />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 relative pb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Key Features
            {/* Underline: Blue accent color */}
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full ${theme === 'dark' ? 'bg-yellow-400' : 'bg-blue-800'}`}></span>
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <FeatureCard
              theme={theme}
              icon="https://placehold.co/100x100/A78BFA/FFFFFF/svg?text=AC" // Placeholder for AC icon
              title="Climate Control"
              description="Ensure optimal comfort with advanced air conditioning systems in all our facilities."
            />
            <FeatureCard
              theme={theme}
              icon="https://placehold.co/100x100/3B82F6/FFFFFF/svg?text=PROJ" // Placeholder for Projector icon
              title="High-Definition Projection"
              description="Equipped with modern projectors for impactful presentations and visual learning."
            />
            <FeatureCard
              theme={theme}
              icon="https://placehold.co/100x100/10B981/FFFFFF/svg?text=WIFI" // Placeholder for WiFi icon
              title="Seamless Connectivity"
              description="High-speed internet access available across all registered assets for uninterrupted work."
            />
          </div>
        </div>
      </div>

      {/* Asset Types Section */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-950' : 'bg-orange-50'}`}> {/* Subtle background change */}
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 relative pb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Explore Our Asset Types
            {/* Underline: Yellow accent color */}
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full ${theme === 'dark' ? 'bg-blue-800' : 'bg-yellow-400'}`}></span>
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <AssetTypeCard theme={theme} type="Hall" description="Spacious venues for conferences, seminars, and large gatherings." icon="https://placehold.co/100x100/F59E0B/FFFFFF/svg?text=HALL" />
            <AssetTypeCard theme={theme} type="Lab" description="Fully equipped laboratories for scientific research and practical training." icon="https://placehold.co/100x100/EF4444/FFFFFF/svg?text=LAB" />
            <AssetTypeCard theme={theme} type="Hostel" description="Comfortable and secure accommodation facilities for students and trainees." icon="https://placehold.co/100x100/6366F1/FFFFFF/svg?text=HOSTEL" />
            <AssetTypeCard theme={theme} type="ClassRoom" description="Modern classrooms with smart boards and comfortable seating for effective learning." icon="https://placehold.co/100x100/06B6D4/FFFFFF/svg?text=CLASS" />
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 relative pb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Essential Amenities
            {/* Underline: Blue accent color */}
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full ${theme === 'dark' ? 'bg-yellow-400' : 'bg-blue-800'}`}></span>
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <AmenityCard theme={theme} amenity="PARKING" description="Ample and secure parking space for all visitors." icon="https://placehold.co/100x100/8B5CF6/FFFFFF/svg?text=PARK" />
            <AmenityCard theme={theme} amenity="RESTROOMS" description="Clean and well-maintained restroom facilities." icon="https://placehold.co/100x100/EC4899/FFFFFF/svg?text=WC" />
            <AmenityCard theme={theme} amenity="COFFEE" description="On-site coffee and refreshment services for convenience." icon="https://placehold.co/100x100/F97316/FFFFFF/svg?text=COFFEE" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Feature Card Component
const FeatureCard = ({ theme, icon, title, description }) => (
  <div className={`flex flex-col items-center p-6 rounded-xl shadow-md text-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg
    ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
  `}>
    <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4
      ${theme === 'dark' ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-600/10 text-blue-600'}
    `}>
      <img src={icon} alt={title} className="w-8 h-8 object-contain" />
    </div>
    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
  </div>
);

// Reusable Asset Type Card Component
const AssetTypeCard = ({ theme, type, description, icon }) => (
  <div className={`flex flex-col items-center p-6 rounded-xl shadow-md text-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg
    ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
  `}>
    <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4
      ${theme === 'dark' ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-600/10 text-purple-600'}
    `}>
      <img src={icon} alt={type} className="w-8 h-8 object-contain" />
    </div>
    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{type}</h3>
    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
  </div>
);

// Reusable Amenity Card Component
const AmenityCard = ({ theme, amenity, description, icon }) => (
  <div className={`flex flex-col items-center p-6 rounded-xl shadow-md text-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg
    ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
  `}>
    <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4
      ${theme === 'dark' ? 'bg-green-400/20 text-green-300' : 'bg-green-600/10 text-green-600'}
    `}>
      <img src={icon} alt={amenity} className="w-8 h-8 object-contain" />
    </div>
    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{amenity.replace(/_/g, ' ')}</h3>
    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
  </div>
);