import { Alert, Label, Spinner, TextInput } from 'flowbite-react'; // Removed Button from import
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }else{
        if(data.message=="E11000 duplicate key error collection: mern-blog.users index: username_1 dup key: { username: \"12345\" }"){
          data.message="Username already exists"
        }else if(data.message=="E11000 duplicate key error collection: mern-blog.users index: email_1 dup key: { email: \"123456yui12werf1qwedf@gmail.com\" }"){
          data.message="Email already exists"
        }
        setErrorMessage(data.message || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            {/* ATI in yellow, CTI in blue for consistent branding */}
            <span className='text-yellow-400'>
              ATI
            </span>
            <span className='text-blue-800'>
              CTI
            </span>
          </Link>
          <p className='text-sm mt-5'>
            This is an asset app. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
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
                placeholder='Password'
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
                  <Spinner size='sm' className='mr-2' />
                  <span>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            {/* Sign In link color changed to blue-800 for consistency */}
            <Link to='/sign-in' className='text-blue-800'>
              Sign In
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