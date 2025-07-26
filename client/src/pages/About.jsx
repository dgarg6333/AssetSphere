import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector

export default function About() {
  const { theme } = useSelector((state) => state.theme); // Get theme from Redux store

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 sm:p-10 ${theme === 'dark' ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-4xl mx-auto p-8 sm:p-10 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105
        ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
      `}>
        <div className="flex flex-col items-center">
          <h1 className={`text-4xl sm:text-5xl font-extrabold text-center mb-6 sm:mb-8 leading-tight text-blue-800`}> {/* Applied text-blue-800 directly to the h1 */}
            About <span className="text-blue-800">ATI CTI</span> {/* Ensured span also uses text-blue-800 for full consistency */}
          </h1>
          <div className={`text-lg sm:text-xl flex flex-col gap-6 sm:gap-8 leading-relaxed
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
          `}>
            <p className="text-justify font-normal">
              Welcome to <span className="font-bold text-lg">ATI CTI</span>, a pioneering platform designed to revolutionize resource management within government training institutions. Our mission is to transform how valuable assets—ranging from specialized halls and state-of-the-art laboratories to comfortable hostels, modern classrooms, and expert faculty—are utilized across various departments and ministries.
            </p>

            <p className="text-justify font-normal">
              <span className="font-bold text-lg">The Core Problem:</span> Many government training institutions possess a wealth of resources that often remain underutilized. This inefficiency stems from a lack of visibility and fragmented coordination between different departments. A department in need of a specific lab for a workshop, or a hall for a seminar, often struggles to discover available resources within other institutions, leading to unnecessary external expenditure and missed opportunities for collaboration.
            </p>

            <p className="text-justify font-normal">
              <span className="font-bold text-lg">Our Solution:</span> ATI CTI provides a <span className="font-bold text-lg">centralized, intuitive platform</span> that addresses this critical challenge head-on. Institutions can easily <span className="font-bold text-lg">register</span> their diverse assets, providing detailed information about their features, capacity, and availability. Simultaneously, other departments and ministries gain the power to effortlessly <span className="font-bold text-lg">discover, filter, and book</span> these resources based on their precise requirements.
            </p>

            <p className="text-justify font-normal">
              This system fosters unprecedented transparency and efficiency. By enabling seamless discovery and booking, ATI CTI ensures that every valuable resource is optimally utilized, reducing redundant expenditures, enhancing inter-departmental collaboration, and ultimately contributing to more effective and economical government operations.
            </p>

            <p className="text-justify font-normal">
              Join us in building a future where government assets are managed with unparalleled efficiency, supporting a more connected and productive public sector. ATI CTI is not just an application; it's a commitment to smarter resource allocation and collaborative growth.
            </p>
          </div>
          {/* Updated button to yellow background with white text */}
          <div className="mt-8">
            <Link to="/search"> {/* Adjust '/search' if your asset listing page has a different route */}
              <button
                type="button"
                className="px-8 py-3 rounded-lg bg-yellow-400 text-white font-semibold text-lg {/* Changed text color to white */}
                           hover:bg-yellow-500 transition-colors duration-300 shadow-lg
                           transform hover:scale-105"
              >
                Explore Available Assets
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}