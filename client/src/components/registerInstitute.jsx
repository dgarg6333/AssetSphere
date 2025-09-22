import { useState } from 'react';
import { Modal, Label, TextInput } from 'flowbite-react';

export default function RegisterInstituteModal() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: '',
    ownerEmail: '',
    ownerphone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic form validation
    if (!formData.institutionName || !formData.ownerEmail) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // API call to the backend endpoint
      const res = await fetch('/api/institute/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Institute registered successfully!');
      setFormData({
        institutionName: '',
        ownerEmail: '',
        ownerphone: '',
      });
      setLoading(false);

      // Optionally, close the modal after a short delay
      setTimeout(() => {
        setOpenModal(false);
      }, 2000);

    } catch (err) {
      setError(err.message || 'Network error. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* This button opens the modal */}
      <button onClick={() => setOpenModal(true)} className="ml-4 px-4 py-2 text-sm font-semibold rounded-md text-white bg-blue-800 hover:bg-blue-900 transition-colors duration-200">
        Register/Approve Institute
      </button>

      {/* The Modal itself */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Register a New Institute</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="institutionName" value="Institution Name" />
              </div>
              <TextInput
                id="institutionName"
                type="text"
                placeholder="e.g., ABC College of Technology"
                value={formData.institutionName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="ownerEmail" value="Institute Email" />
              </div>
              <TextInput
                id="ownerEmail"
                type="email"
                placeholder="name@company.com"
                value={formData.ownerEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="ownerphone" value="Institute Phone No." />
              </div>
              <TextInput
                id="ownerphone"
                type="text"
                placeholder="e.g., +1234567890"
                value={formData.ownerphone}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            <div className="w-full">
              <button type="submit" disabled={loading} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                {loading ? 'Registering...' : 'Register Institute'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
