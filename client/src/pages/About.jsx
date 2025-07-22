import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector

export default function About() {
  const { theme } = useSelector((state) => state.theme); // Get theme from Redux store

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-3xl mx-auto p-8 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105
        ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
      `}>
        <div className="flex flex-col items-center">
          <h1 className={`text-4xl font-extrabold text-center mb-6 leading-tight
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}>
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Asset Sphere</span>
          </h1>
          <div className={`text-lg flex flex-col gap-6 leading-relaxed
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
          `}>
            <p className="text-justify font-normal">
              Welcome to <span className="font-bold text-lg">Asset Sphere</span>, a pioneering platform designed to revolutionize resource management within government training institutions. Our mission is to transform how valuable assets—ranging from specialized halls and state-of-the-art laboratories to comfortable hostels, modern classrooms, and expert faculty—are utilized across various departments and ministries.
            </p>

            <p className="text-justify font-normal">
              <span className="font-bold text-lg">The Core Problem:</span> Many government training institutions possess a wealth of resources that often remain underutilized. This inefficiency stems from a lack of visibility and fragmented coordination between different departments. A department in need of a specific lab for a workshop, or a hall for a seminar, often struggles to discover available resources within other institutions, leading to unnecessary external expenditure and missed opportunities for collaboration.
            </p>

            <p className="text-justify font-normal">
              <span className="font-bold text-lg">Our Solution:</span> Asset Sphere provides a <span className="font-bold text-lg">centralized, intuitive platform</span> that addresses this critical challenge head-on. Institutions can easily <span className="font-bold text-lg">register</span> their diverse assets, providing detailed information about their features, capacity, and availability. Simultaneously, other departments and ministries gain the power to effortlessly <span className="font-bold text-lg">discover, filter, and book</span> these resources based on their precise requirements.
            </p>

            <p className="text-justify font-normal">
              This system fosters unprecedented transparency and efficiency. By enabling seamless discovery and booking, Asset Sphere ensures that every valuable resource is optimally utilized, reducing redundant expenditures, enhancing inter-departmental collaboration, and ultimately contributing to more effective and economical government operations.
            </p>

            <p className="text-justify font-normal">
              Join us in building a future where government assets are managed with unparalleled efficiency, supporting a more connected and productive public sector. Asset Sphere is not just an application; it's a commitment to smarter resource allocation and collaborative growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
