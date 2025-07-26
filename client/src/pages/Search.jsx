import { Select, TextInput, Label, Checkbox } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AssetCard from '../components/AssetCard';
import { useSelector } from 'react-redux';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    city: '',
    type: '',
    minCapacity: undefined,
    maxCapacity: undefined,
    features: [],
    amenities: [],
    startDate: '', // New state for start date
    endDate: '',   // New state for end date
  });

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false); // Unused, can be removed if not implemented

  const location = useLocation();
  const navigate = useNavigate();

  const { theme } = useSelector((state) => state.theme);

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

  const prominentIndianCities = [
    'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Aligarh', 'Allahabad', 'Amravati',
    'Amritsar', 'Aurangabad', 'Bareilly', 'Bengaluru', 'Bhopal', 'Bhubaneswar',
    'Bikaner', 'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack', 'Dehradun',
    'Delhi', 'Dhanbad', 'Durgapur', 'Faridabad', 'Ghaziabad', 'Gorakhpur',
    'Guwahati', 'Gwalior', 'Howrah', 'Hubli-Dharwad', 'Hyderabad', 'Imphal',
    'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 'Jamshedpur',
    'Jhansi', 'Jodhpur', 'Kanpur', 'Kochi', 'Kolkata', 'Kota', 'Kozhikode',
    'Lucknow', 'Ludhiana', 'Madurai', 'Malappapuram', 'Mangalore', 'Meerut',
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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const cityFromUrl = urlParams.get('city');
    const typeFromUrl = urlParams.get('type');
    const featuresFromUrl = urlParams.get('features')?.split(',').filter(Boolean) || [];
    const amenitiesFromUrl = urlParams.get('amenities')?.split(',').filter(Boolean) || [];
    const minCapacityFromUrl = urlParams.get('minCapacity');
    const maxCapacityFromUrl = urlParams.get('maxCapacity');
    const startDateFromUrl = urlParams.get('startDate');
    const endDateFromUrl = urlParams.get('endDate');

    setSidebarData({
      city: cityFromUrl || '',
      type: typeFromUrl || '',
      features: featuresFromUrl,
      amenities: amenitiesFromUrl,
      minCapacity: minCapacityFromUrl ? parseInt(minCapacityFromUrl) : undefined,
      maxCapacity: maxCapacityFromUrl ? parseInt(maxCapacityFromUrl) : undefined,
      startDate: startDateFromUrl || '',
      endDate: endDateFromUrl || '',
    });

    fetchAssets();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'features' || id === 'amenities') {
      let updatedList = [];
      if (checked) {
        updatedList = [...sidebarData[id], value];
      } else {
        updatedList = sidebarData[id].filter((item) => item !== value);
      }
      setSidebarData({ ...sidebarData, [id]: updatedList });
    } else if (id === 'minCapacity' || id === 'maxCapacity') {
      setSidebarData({ ...sidebarData, [id]: value === '' ? undefined : parseInt(value) });
    } else {
      setSidebarData({ ...sidebarData, [id]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    Object.entries(sidebarData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if ((key === 'minCapacity' || key === 'maxCapacity') && isNaN(value)) {
          return;
        }
        urlParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });

    navigate(`/search?${urlParams.toString()}`);
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const searchQuery = location.search || '';
      const res = await fetch(`/api/asset${searchQuery}`);
      const data = await res.json();
      setAssets(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${theme === 'dark' ? 'dark bg-gray-950 text-white' : 'bg-gray-50'}`}>
      <div className={`md:w-72 p-6 md:p-8 border-b md:border-r md:border-b-0 shadow-lg md:shadow-xl transition-all duration-300
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
          Filter Assets
        </h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>

          <div className='flex flex-col gap-2'>
            <Label value='City' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <Select
              id='city'
              value={sidebarData.city}
              onChange={handleChange}
              className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:border-yellow-400' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'}`}
            >
              <option value=''>All Cities</option>
              {prominentIndianCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label value='Asset Type' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <Select
              id='type'
              value={sidebarData.type}
              onChange={handleChange}
              className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:border-yellow-400' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'}`}
            >
              <option value=''>All Types</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label value='Capacity Range' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <div className='flex gap-3 items-center'>
              <TextInput
                id='minCapacity'
                type='number'
                placeholder='Min'
                value={sidebarData.minCapacity === undefined ? '' : sidebarData.minCapacity}
                onChange={handleChange}
                className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'}`}
              />
              <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>-</span>
              <TextInput
                id='maxCapacity'
                type='number'
                placeholder='Max'
                value={sidebarData.maxCapacity === undefined ? '' : sidebarData.maxCapacity}
                onChange={handleChange}
                className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'}`}
              />
            </div>
          </div>

          {/* New two-row layout for Dates */}
          <div className='flex flex-col gap-2'>
            <Label value='Dates' className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            <div className='flex flex-col gap-2'> {/* This div creates the vertical stacking */}
              <div className='flex items-center gap-2'> {/* Container for "Start" and its input */}
                <Label htmlFor='startDate' value='Start:' className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} w-1/4`} />
                <TextInput
                  id='startDate'
                  type='date'
                  value={sidebarData.startDate}
                  onChange={handleChange}
                  className={`w-3/4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'}`}
                />
              </div>
              <div className='flex items-center gap-2'> {/* Container for "End" and its input */}
                <Label htmlFor='endDate' value='End:' className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} w-1/4`} />
                <TextInput
                  id='endDate'
                  type='date'
                  value={sidebarData.endDate}
                  onChange={handleChange}
                  className={`w-3/4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'}`}
                />
              </div>
            </div>
          </div>

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
                    className={`rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-yellow-400 focus:ring-yellow-400' : 'border-gray-300 text-yellow-400 focus:ring-yellow-400'}`}
                  />
                  <Label htmlFor={`feature-${feature}`} className={`text-sm cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

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
                    className={`rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-yellow-400 focus:ring-yellow-400' : 'border-gray-300 text-yellow-400 focus:ring-yellow-400'}`}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className={`text-sm cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {amenity.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <button
            type='submit'
            className='w-full mt-4 py-2 text-lg font-semibold rounded-lg shadow-md
                         bg-yellow-400 text-white
                         hover:bg-yellow-500 hover:shadow-lg
                         transition-all duration-300'
          >
            Apply Filters
          </button>
        </form>
      </div>

      <div className={`flex-1 p-6 md:p-8 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className='mb-8'>
          <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
            Available Assets {assets.length > 0 && <span className={`text-gray-500 ${theme === 'dark' ? 'text-gray-400' : ''}`}>({assets.length})</span>}
          </h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center items-stretch max-w-full mx-auto'>
          {loading ? (
            <div className='col-span-full flex flex-col justify-center items-center h-48'>
              <svg className={`animate-spin h-10 w-10 ${theme === 'dark' ? 'text-blue-600' : 'text-blue-800'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className='col-span-full flex flex-col justify-center items-center h-48'>
              <svg className={`h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No assets found matching your criteria.</p>
              <button
                onClick={() => navigate('/search')}
                className="mt-6 px-6 py-2 text-md font-semibold rounded-lg shadow-md
                               bg-yellow-400 text-white
                               hover:bg-yellow-500 hover:shadow-lg
                               transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            assets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}