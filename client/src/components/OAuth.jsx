// Removed Button import from flowbite-react
// import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        // Replaced Flowbite Button with a native HTML button for full Tailwind control
        <button
            type='button'
            onClick={handleGoogleClick}
            // Applying yellow-400 background with white text, and yellow-500 on hover
            className='w-full py-2 rounded-lg 
                       bg-yellow-400 text-white font-semibold 
                       hover:bg-yellow-500 
                       transition-colors duration-200 
                       flex items-center justify-center gap-2' // Added flex for icon alignment
        >
            <AiFillGoogleCircle className='w-6 h-6' />
            Continue with Google
        </button>
    );
}