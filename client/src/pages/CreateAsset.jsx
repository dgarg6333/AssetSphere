import { Alert, FileInput, Select, TextInput, Label, Checkbox, Spinner, Textarea } from 'flowbite-react'; // Removed Button from import
import { useState, useEffect } from 'react';
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate , useLocation } from 'react-router-dom';

export default function CreateAsset() {
  // State variables for form data, UI feedback, and loading states
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loadingDistrictData, setLoadingDistrictData] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- Enums/Lists for dropdowns and checkboxes ---
  const assetTypes = ['Hall', 'Lab', 'Hostel', 'ClassRoom'];
  const categories = ['ATI', 'CTI'];
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

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Lakshadweep', 'Puducherry'
  ].sort();

  const prominentIndianCitiesByState = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'].sort(),
    'Arunachal Pradesh': ['Itanagar'].sort(),
    'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'].sort(),
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'].sort(),
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'].sort(),
    'Goa': ['Panaji', 'Margao'].sort(),
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'].sort(),
    'Haryana': ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Rohtak'].sort(),
    'Himachal Pradesh': ['Shimla', 'Dharamshala'].sort(),
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City'].sort(),
    'Karnataka': ['Bengaluru', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belagavi'].sort(),
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'].sort(),
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'].sort(),
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'].sort(),
    'Manipur': ['Imphal'].sort(),
    'Meghalaya': ['Shillong'].sort(),
    'Mizoram': ['Aizawl'].sort(),
    'Nagaland': ['Kohima', 'Dimapur'].sort(),
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'].sort(),
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'].sort(),
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur'].sort(),
    'Sikkim': ['Gangtok'].sort(),
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'].sort(),
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'].sort(),
    'Tripura': ['Agartala'].sort(),
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj'].sort(),
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'].sort(),
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'].sort(),
    'Andaman and Nicobar Islands': ['Port Blair'].sort(),
    'Chandigarh': ['Chandigarh'].sort(),
    'Dadra and Nagar Haveli and Daman and Diu': ['Silvassa', 'Daman', 'Diu'].sort(),
    'Delhi': ['Delhi'].sort(),
    'Lakshadweep': ['Kavaratti'].sort(),
    'Puducherry': ['Puducherry'].sort(),
  };

  // --- Form Data State ---
  const [formData, setFormData] = useState({
    name: '',
    institutionName: '',
    type: assetTypes[0],
    category : categories[0],
    website: '',
    address: {
      street: '',
      buildingName: '',
      locality: '',
      landmark: '',
      city: '',
      district: '', // This will be auto-filled
      state: '',
      pincode: '', // This will be manually added
    },
    capacity: 1,
    features: [],
    amenities: [],
    description: '', // This will now hold plain text
    image: '' // Initialized as an empty string
  });

  // Define your default image URL here
  const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/600x400?text=No+Image+Available'; // Example placeholder URL (changed to a more reliable placeholder)

  /**
   * useEffect to check for passed institute details and pre-fill the form.
   */
  useEffect(() => {
    const { instituteDetails } = location.state || {};
      if (instituteDetails) {
      setFormData(prev => ({
      ...prev,
      institutionName: instituteDetails.institutionName,
      }));
    }
  }, [location.state]);
  // --- Helper Functions ---

  /**
   * Fetches the district name based on the selected city and state from a public API.
   * @param {string} city - The selected city.
   * @param {string} state - The selected state.
   */
  const fetchDistrict = async (city, state) => {
    if (!city || !state) {
      // Clear district if city or state is not selected
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          district: '',
        }
      }));
      return;
    }

    setLoadingDistrictData(true);
    try {
      // Using a reliable public API for Indian pincodes by Post Office/City
      const response = await fetch(`https://api.postalpincode.in/postoffice/${city}`);
      const data = await response.json();

      if (data && data.length > 0 && data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        if (postOffices && postOffices.length > 0) {
          // Find a post office that matches the selected state (optional, but good for accuracy)
          // If no specific match, fall back to the first post office found
          const relevantPostOffice = postOffices.find(po => po.State.toLowerCase() === state.toLowerCase()) || postOffices[0];

          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              district: relevantPostOffice.District || '', // Only update district
            }
          }));
        } else {
          console.warn('No post offices found for the selected city.');
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              district: '', // Clear if no data
            }
          }));
        }
      } else {
        console.warn('API call failed or returned no success status:', data);
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            district: '', // Clear if API fails
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching district:', error);
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          district: '', // Clear on error
        }
      }));
    } finally {
      setLoadingDistrictData(false);
    }
  };

  /**
   * Handles changes for all input types (TextInput, Select, Checkbox, Textarea).
   * It intelligently updates the formData state, including nested address.
   * Special handling for state and city changes to trigger district fetching.
   * @param {Event} e - The DOM event object.
   */
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id.startsWith('address.')) {
      const addressField = id.split('.')[1];
      setFormData(prev => {
        const updatedAddress = {
          ...prev.address,
          [addressField]: value
        };

        // Reset city and district when state changes
        if (addressField === 'state') {
          updatedAddress.city = '';
          updatedAddress.district = '';
        } else if (addressField === 'city') {
          // Fetch district when city changes, only if a city is selected
          if (value !== '') {
            fetchDistrict(value, updatedAddress.state);
          } else {
            updatedAddress.district = ''; // Clear district if city is cleared
          }
        }
        return {
          ...prev,
          address: updatedAddress
        };
      });
    }else if (id === 'features' || id === 'amenities') {
      let updatedList = checked
        ? [...formData[id], value]
        : formData[id].filter((item) => item !== value);
      setFormData({ ...formData, [id]: updatedList });
    } else {
      // This now handles 'description' as a simple text input
      setFormData({ ...formData, [id]: value });
    }
  };

  /**
   * Handles image upload to Firebase Storage.
   * Shows upload progress and sets download URL upon completion.
   */
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError('Please select an image to upload.');
      return;
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError('Image upload failed (max 2MB, check file type).');
        setImageUploadProgress(null);
        console.error('Image upload error:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  /**
   * Handles the form submission.
   * Sends the structured asset data to the backend API.
   * @param {Event} e - The DOM event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure numerical values are correctly parsed before sending
      const dataToSend = {
        ...formData,
        capacity: parseInt(formData.capacity) || 1,
        // No change needed for 'image' here as it's already a string in formData
      };

      const res = await fetch('/api/asset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || 'Something went wrong during asset creation.');
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/asset/${data._id}`); // Redirect to the newly created asset page
      }
    } catch (error) {
      setPublishError('Something went wrong during form submission.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold text-gray-800 dark:text-white'>
        Register a New Asset
      </h1>
      <form className='flex flex-col gap-6' onSubmit={handleSubmit}>

        {/* Basic Asset Information */}
        <div className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200'>
            Basic Information
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='name' value='Asset Name' />
              <TextInput
                type='text'
                placeholder='e.g., Main Auditorium'
                required
                id='name'
                onChange={handleChange}
                value={formData.name}
                className='mt-1'
                // Apply custom focus styles for consistency
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='type' value='Asset Type' />
              <Select
                id='type'
                onChange={handleChange}
                value={formData.type}
                className='mt-1'
                theme={{
                  "field": {
                    "select": {
                      "base": "block w-full",
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              >
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor='website' value='Website' />
              <TextInput
                type='url'
                placeholder='www.example.com'
                required
                id='website'
                onChange={handleChange}
                value={formData.website}
                className='mt-1'
                // Apply custom focus styles for consistency
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='category' value='Category' />
              <Select
                id='category'
                onChange={handleChange}
                value={formData.category}
                className='mt-1'
                theme={{
                  "field": {
                    "select": {
                      "base": "block w-full",
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              >
                {categories.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </div>
            <div className='md:col-span-2'>
              <Label htmlFor='institutionName' value='Institution Name' />
              <TextInput
                type='text'
                placeholder='e.g., Delhi University'
                required
                id='institutionName'
                onChange={handleChange}
                value={formData.institutionName}
                readOnly
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='capacity' value='Capacity' />
              <TextInput
                type='number'
                placeholder='Minimum 1'
                required
                id='capacity'
                min='1'
                onChange={handleChange}
                value={formData.capacity}
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200'>
            Address Details
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='address.street' value='Street Address' />
              <TextInput
                type='text'
                placeholder='e.g., 123, Main Street'
                required
                id='address.street'
                onChange={handleChange}
                value={formData.address.street}
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='address.buildingName' value='Building Name (Optional)' />
              <TextInput
                type='text'
                placeholder='e.g., Academic Block A'
                id='address.buildingName'
                onChange={handleChange}
                value={formData.address.buildingName}
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='address.locality' value='Locality' />
              <TextInput
                type='text'
                placeholder='e.g., Nehru Place'
                required
                id='address.locality'
                onChange={handleChange}
                value={formData.address.locality}
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='address.landmark' value='Landmark (Optional)' />
              <TextInput
                type='text'
                placeholder='e.g., Near India Gate'
                id='address.landmark'
                onChange={handleChange}
                value={formData.address.landmark}
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='address.state' value='State' />
              <Select
                id='address.state'
                required
                onChange={handleChange}
                value={formData.address.state}
                className='mt-1'
                theme={{
                  "field": {
                    "select": {
                      "base": "block w-full",
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              >
                <option value=''>Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor='address.city' value='City' />
              <div className="relative">
                <Select
                  id='address.city'
                  required
                  onChange={handleChange}
                  value={formData.address.city}
                  disabled={!formData.address.state || loadingDistrictData}
                  className='mt-1'
                  theme={{
                    "field": {
                      "select": {
                        "base": "block w-full",
                        "colors": {
                          "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                        },
                        "withIcon": {
                          "on": "pr-10",
                          "off": ""
                        },
                        "withAddon": {
                          "on": "rounded-r-lg",
                          "off": "rounded-lg"
                        },
                        "withShadow": {
                          "on": "shadow-sm",
                          "off": ""
                        }
                      }
                    }
                  }}
                >
                  <option value=''>Select City</option>
                  {formData.address.state && prominentIndianCitiesByState[formData.address.state] &&
                    prominentIndianCitiesByState[formData.address.state].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))
                  }
                </Select>
                {loadingDistrictData && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Spinner size="sm" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor='address.district' value='District' />
              <TextInput
                type='text'
                placeholder='Auto-filled from City'
                required
                id='address.district'
                onChange={handleChange}
                value={formData.address.district}
                readOnly={!loadingDistrictData && formData.address.district !== ''}
                disabled={loadingDistrictData}
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor='address.pincode' value='Pincode' />
              <TextInput
                type='text'
                placeholder='e.g., 110001 (6 digits)'
                required
                id='address.pincode'
                pattern='[0-9]{6}'
                title='Pincode must be 6 digits'
                onChange={handleChange}
                value={formData.address.pincode}
                className='mt-1'
                theme={{
                  "field": {
                    "input": {
                      "base": "block w-full",
                      "sizes": {
                        "sm": "p-2 sm:text-xs",
                        "md": "p-2.5 text-sm",
                        "lg": "p-4 sm:text-base"
                      },
                      "colors": {
                        "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                      },
                      "withIcon": {
                        "on": "pr-10",
                        "off": ""
                      },
                      "withAddon": {
                        "on": "rounded-r-lg",
                        "off": "rounded-lg"
                      },
                      "withShadow": {
                        "on": "shadow-sm",
                        "off": ""
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Features Checkboxes */}
        <div className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200'>
            Features
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2'>
            {featuresList.map((feature) => (
              <div key={feature} className='flex items-center gap-2'>
                <Checkbox
                  id='features'
                  value={feature}
                  onChange={handleChange}
                  checked={formData.features.includes(feature)}
                  // Apply custom focus styles for consistency
                  theme={{
                    "root": {
                      "base": "h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-yellow-400 dark:checked:bg-yellow-400",
                      "color": {
                        "default": "text-yellow-400"
                      }
                    }
                  }}
                />
                <Label htmlFor='features' className='text-sm capitalize cursor-pointer dark:text-gray-300'>
                  {feature.replace(/_/g, ' ').toLowerCase()}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Checkboxes */}
        <div className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200'>
            Amenities
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2'>
            {amenitiesList.map((amenity) => (
              <div key={amenity} className='flex items-center gap-2'>
                <Checkbox
                  id='amenities'
                  value={amenity}
                  onChange={handleChange}
                  checked={formData.amenities.includes(amenity)}
                  // Apply custom focus styles for consistency
                  theme={{
                    "root": {
                      "base": "h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-yellow-400 dark:checked:bg-yellow-400",
                      "color": {
                        "default": "text-yellow-400"
                      }
                    }
                  }}
                />
                <Label htmlFor='amenities' className='text-sm capitalize cursor-pointer dark:text-gray-300'>
                  {amenity.replace(/_/g, ' ').toLowerCase()}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200'>
            Asset Image
          </h2>
          {/* Changed border color for consistency */}
          <div className='flex flex-col sm:flex-row gap-4 items-center border-4 border-yellow-400 border-dotted p-3 rounded-lg'>
            <FileInput
              type='file'
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
              className='flex-1'
              theme={{
                "field": {
                  "input": {
                    "base": "block w-full cursor-pointer rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
                    "colors": {
                      "default": "border-gray-300 bg-gray-50 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                    }
                  }
                }
              }}
            />
            {/* Replaced Flowbite Button with a native HTML button */}
            <button
              type='button'
              onClick={handleUploadImage}
              disabled={imageUploadProgress !== null || !file}
              className='min-w-[120px] py-2 px-4 rounded-lg
                         bg-yellow-400 text-white font-semibold
                         hover:bg-yellow-500
                         transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {imageUploadProgress ? (
                <div className='w-16 h-16 mx-auto'> {/* Centering spinner */}
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                    styles={{
                      root: {},
                      path: {
                        stroke: `rgb(37, 99, 235, ${imageUploadProgress / 100})`, // Blue color from original buttons
                      },
                      trail: {
                        stroke: '#d6d6d6',
                      },
                      text: {
                        fill: 'currentColor', // Use current text color
                        fontSize: '16px',
                        fontWeight: 'bold',
                      },
                      background: {
                        fill: '#3e98c7',
                      },
                    }}
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </button>
          </div>
          {imageUploadError && <Alert color='failure' className='mt-4'>{imageUploadError}</Alert>}
          {/* Display the uploaded image or the default placeholder */}
          {formData.image && (
            <img
              src={formData.image}
              alt='Uploaded Asset Image'
              className='w-full h-72 object-cover rounded-lg mt-4'
            />
          )}
          {!formData.image && (
            <div className="w-full h-72 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mt-4 text-gray-500 dark:text-gray-400">
              No image selected. Upload an image above.
            </div>
          )}
        </div>

        {/* Description */}
        <div className='p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200'>
            Description
          </h2>
          <Textarea
            placeholder='Write a detailed description for the asset...'
            required
            id='description'
            onChange={handleChange}
            value={formData.description}
            rows={8}
            className='min-h-[150px] mt-1'
            theme={{
              "field": {
                "input": {
                  "base": "block w-full",
                  "sizes": {
                    "sm": "p-2 sm:text-xs",
                    "md": "p-2.5 text-sm",
                    "lg": "p-4 sm:text-base"
                  },
                  "colors": {
                    "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                  },
                  "withIcon": {
                    "on": "pr-10",
                    "off": ""
                  },
                  "withAddon": {
                    "on": "rounded-r-lg",
                    "off": "rounded-lg"
                  },
                  "withShadow": {
                    "on": "shadow-sm",
                    "off": ""
                  }
                }
              }
            }}
          />
        </div>

        {/* Replaced Flowbite Button with a native HTML button */}
        <button
          type='submit'
          className='w-full py-2 rounded-lg
                     bg-blue-800 text-white text-lg font-semibold
                     hover:bg-blue-900
                     transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Register Asset
        </button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}