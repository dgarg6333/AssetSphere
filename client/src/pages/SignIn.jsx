import { Alert, Label, Spinner, TextInput } from 'flowbite-react'; // Removed Button from import
import { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Check if the HTTP response was NOT successful (status code is not in the 200-299 range)
      if (!res.ok) {
        // Dispatch the failure action with the message from the API response
        dispatch(signInFailure(data.message));
        return; // Exit the function to prevent further execution
      }

      // If the HTTP response was successful, proceed to check the API's 'success' property
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        // If both HTTP and API-level success checks pass, dispatch the success action
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='text-yellow-400'>
              ATI
            </span>
            <span className='text-blue-800'>
              CTI
            </span>
          </Link>
          <p className='text-sm mt-5'>
            This is an asset app. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='***********'
                id='password'
                onChange={handleChange}
              />
            </div>
            {/* Replaced Flowbite Button with a native HTML button */}
            <button
              className='w-full py-2 rounded-lg 
                         bg-blue-800 text-white font-semibold 
                         hover:bg-blue-900 
                         transition-colors duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' className='mr-2' /> {/* Added margin for spacing */}
                  <span>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Do not have an account?</span>
            <Link to='/sign-up' className='text-blue-800'>
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}