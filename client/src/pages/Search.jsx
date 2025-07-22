import { Button, Select, TextInput, Label, Checkbox } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AssetCard from '../components/AssetCard'; // Assuming AssetCard is in ../components/AssetCard.jsx
import { useSelector } from 'react-redux'; // Import useSelector

export default function Search() {
  // State to manage the filter criteria from the sidebar
  const [sidebarData, setSidebarData] = useState({
    city: '',
    type: '',
    minCapacity: 0,
    maxCapacity: 500,
    features: [],
    amenities: []
  });

  // State to store the fetched assets
  const [assets, setAssets] = useState([]);
  // State to manage the loading status during API calls
  const [loading, setLoading] = useState(false);
  // State for "show more" functionality (can be used for pagination) - currently not implemented
  const [showMore, setShowMore] = useState(false);

  // Hooks for navigation and accessing URL parameters
  const location = useLocation();
  const navigate = useNavigate();

  // Get the current theme from the Redux store
  const { theme } = useSelector((state) => state.theme);

  // Static lists for asset types, features, and amenities
  const assetTypes = ['Hall', 'Lab', 'Hostel', 'ClassRoom'];
  const featuresList = [
    'AC',
    'INTERNET',
    'PROJECTOR',
    'AUDIO',
    'SMART_BOARD'
  ];
  const amenitiesList = [
    'PARKING',
    'WATER',
    'TECH_SUPPORT',
    'LOCKERS',
    'RESTROOMS',
    'CLEANING',
    'BREAKOUT',
    'COFFEE'
  ];

  // List of prominent Indian cities for the city filter, sorted alphabetically
  const prominentIndianCities = [
    'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Aligarh', 'Allahabad', 'Amravati',
    'Amritsar', 'Aurangabad', 'Bareilly', 'Bengaluru', 'Bhopal', 'Bhubaneswar',
    'Bikaner', 'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack', 'Dehradun',
    'Delhi', 'Dhanbad', 'Durgapur', 'Faridabad', 'Ghaziabad', 'Gorakhpur',
    'Guwahati', 'Gwalior', 'Howrah', 'Hubli-Dharwad', 'Hyderabad', 'Imphal',
    'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 'Jamshedpur',
    'Jhansi', 'Jodhpur', 'Kanpur', 'Kochi', 'Kolkata', 'Kota', 'Kozhikode',
    'Lucknow', 'Ludhiana', 'Madurai', 'Malappuram', 'Mangalore', 'Meerut',
    'Moradabad', 'Mumbai', 'Mysore', 'Nagpur', 'Nanded', 'Nashik', 'Nellore',
    'Noida', 'Panaji', 'Patna', 'Puducherry', 'Pune', 'Raipur', 'Rajkot',
    'Ranchi', 'Salem', 'Solapur', 'Srinagar', 'Surat', 'Thane', 'Thiruvananthapuram',
    'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Udaipur', 'Ujjain',
    'Vadodara', 'Varanasi', 'Visakhapatnam', 'Warangal',
    'Agartala', 'Ambala', 'Asansol', 'Belagavi', 'Berhampur', 'Bhagalpur',
    'Bhavnagar', 'Bhilai', 'Bilaspur', 'Bokaro Steel City', 'Daman', 'Dharamshala',
    'Dibrugarh', 'Dimapur', 'Diu', 'Gaya', 'Guntur', 'Haldwani', 'Haridwar',
    'Itanagar', 'Jorhat', 'Karimnagar', 'Kavaratti', 'Kohima', 'Kollam',
    'Korba', 'Margao', 'Mohali', 'Muzaffarpur', 'Nizamabad', 'Panipat',
    'Patiala', 'Port Blair', 'Prayagraj', 'Rohtak', 'Roorkee', 'Rourkela',
    'Shillong', 'Silchar', 'Siliguri', 'Silvassa', 'Vijayawada'
  ].sort();

  // useEffect to parse URL parameters and fetch assets on component mount or URL change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // Extract filter values from URL parameters
    const cityFromUrl = urlParams.get('city');
    const typeFromUrl = urlParams.get('type');
    // Split comma-separated strings for features/amenities, filter out empty strings
    const featuresFromUrl = urlParams.get('features')?.split(',').filter(Boolean) || [];
    const amenitiesFromUrl = urlParams.get('amenities')?.split(',').filter(Boolean) || [];
    const minCapacityFromUrl = urlParams.get('minCapacity');
    const maxCapacityFromUrl = urlParams.get('maxCapacity');

    // Update sidebarData state with values from URL or default values
    setSidebarData({
      city: cityFromUrl || '',
      type: typeFromUrl || '',
      features: featuresFromUrl,
      amenities: amenitiesFromUrl,
      minCapacity: minCapacityFromUrl ? parseInt(minCapacityFromUrl) : 0,
      maxCapacity: maxCapacityFromUrl ? parseInt(maxCapacityFromUrl) : 500
    });

    // Fetch assets based on the updated filter criteria
    fetchAssets();
  }, [location.search]); // Dependency array: re-run effect when location.search changes

  // Handler for changes in form inputs (Select, TextInput, Checkbox)
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'features' || id === 'amenities') {
      // Handle checkbox changes for features and amenities
      let updatedList = [];
      if (checked) {
        updatedList = [...sidebarData[id], value]; // Add value if checked
      } else {
        updatedList = sidebarData[id].filter((item) => item !== value); // Remove value if unchecked
      }
      setSidebarData({ ...sidebarData, [id]: updatedList });
    } else {
      // Handle changes for Select and TextInput
      setSidebarData({ ...sidebarData, [id]: value });
    }
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const urlParams = new URLSearchParams(); // Create new URLSearchParams object

    // Iterate over sidebarData and set URL parameters
    Object.entries(sidebarData).forEach(([key, value]) => {
      // Only add parameters if the value is not empty, not 0 (for numbers), and not an empty array
      if (value !== '' && value !== 0 && !(Array.isArray(value) && value.length === 0)) {
        urlParams.set(key, Array.isArray(value) ? value.join(',') : value); // Join array values with comma
      }
    });

    // Navigate to the search page with updated URL parameters
    navigate(`/search?${urlParams.toString()}`);
  };

  // Function to fetch assets from the API
  const fetchAssets = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const searchQuery = location.search || ''; // Get current search query from URL
      const res = await fetch(`/api/asset${searchQuery}`); // Make API call
      const data = await res.json(); // Parse JSON response
      setAssets(data); // Update assets state
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error(error); // Log any errors
      setLoading(false); // Ensure loading is false even on error
    }
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${theme === 'dark' ? 'dark bg-gray-950 text-white' : 'bg-gray-50'}`}>
      {/* Sidebar for Filters */}
      <div className={`md:w-72 p-6 md:p-8 border-b md:border-r md:border-b-0 shadow-lg md:shadow-xl transition-all duration-300
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Filter Assets
        </h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>

          {/* City Filter Section */}
          <div className='flex flex-col gap-2'>
            <Label value='City' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <Select
              id='city'
              value={sidebarData.city}
              onChange={handleChange}
              className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            >
              <option value=''>All Cities</option>
              {prominentIndianCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
          </div>

          {/* Asset Type Filter Section */}
          <div className='flex flex-col gap-2'>
            <Label value='Asset Type' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <Select
              id='type'
              value={sidebarData.type}
              onChange={handleChange}
              className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            >
              <option value=''>All Types</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>

          {/* Capacity Range Filter Section */}
          <div className='flex flex-col gap-2'>
            <Label value='Capacity Range' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <div className='flex gap-3 items-center'>
              <TextInput
                id='minCapacity'
                type='number'
                placeholder='Min'
                value={sidebarData.minCapacity}
                onChange={handleChange}
                className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
              />
              <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>-</span>
              <TextInput
                id='maxCapacity'
                type='number'
                placeholder='Max'
                value={sidebarData.maxCapacity}
                onChange={handleChange}
                className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
              />
            </div>
          </div>

          {/* Features Filter Section */}
          <div className='flex flex-col gap-2'>
            <Label value='Features' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <div className='grid grid-cols-2 gap-3'>
              {featuresList.map((feature) => (
                <div key={feature} className='flex items-center gap-2'>
                  <Checkbox
                    id='features'
                    value={feature}
                    onChange={handleChange}
                    checked={sidebarData.features.includes(feature)}
                    className={`rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500' : 'border-gray-300 text-blue-600 focus:ring-blue-500'}`}
                  />
                  <Label htmlFor='features' className={`text-sm cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Filter Section */}
          <div className='flex flex-col gap-2'>
            <Label value='Amenities' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <div className='grid grid-cols-2 gap-3'>
              {amenitiesList.map((amenity) => (
                <div key={amenity} className='flex items-center gap-2'>
                  <Checkbox
                    id='amenities'
                    value={amenity}
                    onChange={handleChange}
                    checked={sidebarData.amenities.includes(amenity)}
                    className={`rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500' : 'border-gray-300 text-blue-600 focus:ring-blue-500'}`}
                  />
                  <Label htmlFor='amenities' className={`text-sm cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {amenity.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button type='submit' gradientDuoTone='purpleToPink' className='w-full mt-4 py-2 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Main Content Area for Asset Cards */}
      <div className={`flex-1 p-6 md:p-8 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className='mb-8'>
          <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Available Assets {assets.length > 0 && <span className={`text-gray-500 ${theme === 'dark' ? 'text-gray-400' : ''}`}>({assets.length})</span>}
          </h1>
        </div>

        {/* Grid Layout for Asset Cards (Adjusted for larger cards) */}
        {/* Responsive grid: 1 column on small, 2 on md+, 3 on lg+, 4 on 2xl+ */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center items-stretch max-w-full mx-auto'>
          {loading ? (
            // Loading state: spinner and text
            <div className='col-span-full flex flex-col justify-center items-center h-48'>
              <svg className={`animate-spin h-10 w-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading assets...</p>
            </div>
          ) : assets.length === 0 ? (
            // No assets found state: icon, message, and clear filters button
            <div className='col-span-full flex flex-col justify-center items-center h-48'>
              <svg className={`h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No assets found matching your criteria.</p>
              <Button onClick={() => navigate('/search')} className="mt-6" gradientDuoTone='purpleToPink'>
                Clear Filters
              </Button>
            </div>
          ) : (
            // Display AssetCard components if assets are found
            assets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
