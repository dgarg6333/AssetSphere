import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

/**
 * A React component to display the current user's bookings.
 * It fetches bookings, allows cancellation, and displays their status.
 */
export default function MyBookings() {
  const { currentUser } = useSelector((state) => state.user);
  
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to determine the booking status and styling.
  const getBookingStatus = (booking) => {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    // Corrected to use `booking.bookingStatus`
    if (booking.bookingStatus === 'CANCELLED') {
      return { text: 'Cancelled', color: 'text-red-500 font-semibold' };
    }
    
    if (startDate <= now && endDate >= now) {
      return { text: 'Active', color: 'text-green-500 font-semibold' };
    }
    
    if (endDate < now) {
      return { text: 'Completed', color: 'text-purple-500 font-semibold' };
    }

    return { text: 'Pending', color: 'text-blue-500 font-semibold' };
  };

  // Effect to fetch all bookings for the current user when the component mounts or user changes
  useEffect(() => {
    const fetchBookings = async () => {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      if (!currentUser || !currentUser._id) {
        setLoading(false);
        setErrorMessage("User not authenticated.");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/booking/${currentUser._id}`);
        const data = await res.json();
        
        if (res.ok) {
          setUserBookings(data.data); 
          setErrorMessage(null);
        } else {
          setErrorMessage(data.message || "Failed to fetch bookings.");
          setUserBookings([]);
        }
      } catch (error) {
        setErrorMessage("Network error: Could not connect to the server.");
        console.error("Failed to fetch bookings:", error.message);
        setUserBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  // Function to handle the cancellation of a booking
  const handleCancelBooking = async () => {
    if (!bookingIdToCancel) return;

    setIsCancelling(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // Corrected to send `bookingStatus` in the request body
      const res = await fetch(`/api/booking/cancel/${bookingIdToCancel}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingStatus: 'CANCELLED' }), 
      });

      const data = await res.json();

      if (res.ok) {
        // Update the local state to reflect the change without a full re-fetch
        setUserBookings(prevBookings => prevBookings.map(booking => 
          booking._id === bookingIdToCancel ? { ...booking, bookingStatus: 'CANCELLED' } : booking
        ));
        setSuccessMessage("Booking cancelled successfully.");
      } else {
        setErrorMessage(data.message || "Failed to cancel the booking.");
      }
    } catch (error) {
      setErrorMessage("Network error: Could not connect to the server.");
      console.error("Failed to cancel booking:", error.message);
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
      setBookingIdToCancel(null);
    }
  };

  // --- Main Component Render ---
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <h2 className='text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white'>My Bookings</h2>

      {successMessage && (
        <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <HiCheckCircle className="flex-shrink-0 w-4 h-4 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <HiExclamationCircle className="flex-shrink-0 w-4 h-4 mr-2" />
          <span>{errorMessage}</span>
        </div>
      )}

      {userBookings.length > 0 ? (
        <Table hoverable className='shadow-md rounded-lg'>
          <Table.Head className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <Table.HeadCell>Date Booked</Table.HeadCell>
            <Table.HeadCell>Asset</Table.HeadCell>
            <Table.HeadCell>Institution</Table.HeadCell>
            <Table.HeadCell>Start Date</Table.HeadCell>
            <Table.HeadCell>End Date</Table.HeadCell>
            <Table.HeadCell>Purpose</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>

          <Table.Body className='divide-y'>
            {userBookings.map((booking) => {
              const now = new Date();
              const startDate = new Date(booking.startDate);
              // Check if the booking is not cancelled AND if the start date is in the future (more than 24 hours away)
              const isCancellable = booking.bookingStatus !== 'CANCELLED' && startDate > now && (startDate.getTime() - now.getTime()) > (24 * 60 * 60 * 1000);
              const { text: statusText, color: statusColor } = getBookingStatus(booking);

              return (
                <Table.Row key={booking._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{formatDate(booking.createdAt)}</Table.Cell>
                  <Table.Cell className='font-medium text-gray-900 dark:text-white'>
                    {booking.assetId?.name}
                  </Table.Cell>
                  <Table.Cell>
                    {booking.assetId?.institutionName}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(booking.startDate)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(booking.endDate)}
                  </Table.Cell>
                  <Table.Cell>{booking.purpose}</Table.Cell>
                  <Table.Cell className={statusColor}>
                    {statusText}
                  </Table.Cell>
                  <Table.Cell>
                    {isCancellable && (
                      <button
                        className='bg-yellow-400 text-white font-semibold py-1 px-3 rounded-lg hover:bg-yellow-500 transition-colors duration-200'
                        onClick={() => {
                          setShowCancelModal(true);
                          setBookingIdToCancel(booking._id);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-center">You have no bookings yet!</p>
      )}

      {showCancelModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4'>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg font-medium text-gray-500 dark:text-gray-400'>
                Are you sure you want to cancel this booking?
              </h3>
              <div className='flex justify-center gap-4'>
                <button
                  className='bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200'
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                >
                  {isCancelling ? <Spinner size="sm" /> : "Yes, I'm sure"}
                </button>
                <button
                  className='bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200'
                  onClick={() => setShowCancelModal(false)}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}