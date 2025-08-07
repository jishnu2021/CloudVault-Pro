import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

type UserType = {
  id: number;
  name: string;
  email: string;
  image?: string;
  photo?: string; // Add both image and photo fields
  bio?: string;
  credits?: number;
};

const NavbarPage = ({ userdata }: { userdata: string | null }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [editedData, setEditedData] = useState<EditedData>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentCredits, setCurrentCredits] = useState<number>(0);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);
  
  const parsedUser = useMemo<UserType | null>(() => {
      if (!userdata) return null;
      try {
        return JSON.parse(userdata);
      } catch {
        return null;
      }
    }, [userdata]);

  // Login/Register form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    bio: ''
  });

  // Check localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEditedData(userData);
        setCurrentCredits(userData.credits || 0);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Fetch user credits periodically
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!parsedUser) return;
      
      try {
        const response = await fetch(`http://localhost:8080/user/${parsedUser.id}/credits`);
        if (response.ok) {
          const data = await response.json();
          const newCredits = data.credits || 0;
          setCurrentCredits(newCredits);
          
          // Update localStorage with fresh credits
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.credits = newCredits;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user credits:', error);
      }
    };

    // Fetch credits immediately if user exists
    if (parsedUser) {
      fetchUserCredits();
      
      // Set up interval to fetch credits every 30 seconds
      const interval = setInterval(fetchUserCredits, 30000);
      return () => clearInterval(interval);
    }
  }, [parsedUser]);

  // Function to get initials from name
  // interface User {
  //   name: string;
  //   email: string;
  //   password?: string;
  //   phone?: string;
  //   bio?: string;
  //   photo?: string;
  //   image?: string;
  //   credits?: number;
  //   [key: string]: any;
  // }

  interface EditedData {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    bio?: string;
    photo?: string;
    image?: string;
    credits?: number;
    [key: string]: any;
  }

  const getInitials = (name: string | undefined): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user's profile image with fallback logic
  const getUserImage = (userData: UserType | null): string | null => {
    if (!userData) return null;
    
    // Check both photo and image fields
    const imageUrl = userData.photo || userData.image;
    
    // If it's a base64 string, return it directly
    if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('http'))) {
      return imageUrl;
    }
    
    // If it's a file path, construct the full URL
    if (imageUrl && !imageUrl.startsWith('data:') && !imageUrl.startsWith('http')) {
      return `http://localhost:8080${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    return null;
  };

  // Handle Login
  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:8080/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setEditedData(userData);
        setCurrentCredits(userData.credits || 0);
        setLoginData({ email: '', password: '' });
        (document.getElementById('login_modal') as HTMLDialogElement | null)?.close();
      } else {
        const error = await response.text();
        alert('Login failed: ' + error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Handle Register
  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setEditedData(userData);
        setCurrentCredits(userData.credits || 0);
        setRegisterData({ name: '', email: '', password: '', phone: '', bio: '' });
        (document.getElementById('register_modal') as HTMLDialogElement | null)?.close();
      } else {
        const error = await response.text();
        alert('Registration failed: ' + error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setEditedData({});
    setCurrentCredits(0);
    setSelectedImage(null);
    (document.getElementById('logout_modal') as HTMLDialogElement | null)?.close();
    navigate('/'); // Redirect to home page after logout
    alert("User logged out");
  };

  // Handle profile data changes
  interface HandleInputChange {
    (field: keyof EditedData, value: string): void;
  }

  const handleInputChange: HandleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  interface ImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleImageChange = (e: ImageChangeEvent) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      setImageUploadLoading(true);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        if (result) {
          setSelectedImage(result);
          setEditedData(prev => ({
            ...prev,
            photo: result,
            image: result // Set both fields to ensure compatibility
          }));
        }
        setImageUploadLoading(false);
      };
      reader.onerror = () => {
        alert('Error reading the image file.');
        setImageUploadLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      if (!parsedUser) return;
      
      console.log('Saving profile with data:', editedData); // Debug log
      
      const response = await fetch(`http://localhost:8080/user/${parsedUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Updated user received:', updatedUser); // Debug log
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setCurrentCredits(updatedUser.credits || 0);
        setSelectedImage(null); // Clear temporary selected image
        (document.getElementById('profile_modal') as HTMLDialogElement | null)?.close();
        
        // Force a re-render by updating the user state
        setTimeout(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser({ ...userData }); // Force state update
          }
        }, 100);
        
        alert('Profile updated successfully!');
      } else {
        const error = await response.text();
        alert('Failed to update profile: ' + error);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancelProfile = () => {
    setEditedData({ ...user });
    setSelectedImage(null);
    (document.getElementById('profile_modal') as HTMLDialogElement | null)?.close();
  };

  const openProfileModal = () => {
    setEditedData({ ...user });
    setSelectedImage(null);
    (document.getElementById('profile_modal') as HTMLDialogElement | null)?.showModal();
  };

  // Get the current display image
  const currentUserImage = getUserImage(user);
  const modalDisplayImage = selectedImage || getUserImage({ ...user, ...editedData } as UserType);

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl" href="/">CloudVault Pro</a>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              value="dark"
            />
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          {/* Conditional rendering based on user authentication */}
          {!user ? (
            <div className="flex gap-2">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => (document.getElementById('login_modal') as HTMLDialogElement | null)?.showModal()}
              >
                Login
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => (document.getElementById('register_modal') as HTMLDialogElement | null)?.showModal()}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {currentUserImage ? (
                    <img
                      alt="User Avatar"
                      src={currentUserImage}
                      onError={(e) => {
                        // If image fails to load, hide it and show initials
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm">${getInitials(user.name)}</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <button 
                    className="justify-between" 
                    onClick={openProfileModal}
                  >
                    Profile
                    <span className="badge badge-primary">
                      {`${currentCredits} Credits`}
                    </span>
                  </button>
                </li>
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
  
                <li>
                  <button onClick={() => (document.getElementById('logout_modal') as HTMLDialogElement | null)?.showModal()}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <dialog id="login_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Login</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email &nbsp;</span>
              </label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input input-bordered"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
              />
              <div style={{margin:"5px"}}></div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password &nbsp;</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="input input-bordered"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
              />
            </div>
          </div>
          <div className="modal-action">
            <button 
              className="btn btn-outline"
              onClick={() => {
                (document.getElementById('login_modal') as HTMLDialogElement | null)?.close();
                setLoginData({ email: '', password: '' });
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </dialog>

      {/* Register Modal */}
      <dialog id="register_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Register</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name  &nbsp;</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                className="input input-bordered"
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email &nbsp;</span>
              </label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input input-bordered"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password &nbsp;</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="input input-bordered"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({...prev, password: e.target.value}))}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number &nbsp;</span>
              </label>
              <input 
                type="tel" 
                placeholder="Enter your phone number" 
                className="input input-bordered"
                value={registerData.phone}
                onChange={(e) => setRegisterData(prev => ({...prev, phone: e.target.value}))}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio &nbsp;</span>
              </label>
              <textarea 
                placeholder="Tell us about yourself..." 
                className="textarea textarea-bordered"
                value={registerData.bio}
                onChange={(e) => setRegisterData(prev => ({...prev, bio: e.target.value}))}
              />
            </div>
          </div>
          <div className="modal-action">
            <button 
              className="btn btn-outline"
              onClick={() => {
                (document.getElementById('register_modal')as HTMLDialogElement | null)?.close();
                setRegisterData({ name: '', email: '', password: '', phone: '', bio: '' });
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </dialog>

      {/* Profile Modal */}
      <dialog id="profile_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-2xl">Edit Profile</h3>
            <button 
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => (document.getElementById('profile_modal') as HTMLDialogElement | null)?.close()}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Credits Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800">Current Credits</h4>
                  <p className="text-2xl font-bold text-blue-600">{currentCredits}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600 mb-2">Need more credits?</p>
                  <a href="/dashboard" className="btn btn-sm btn-primary">Buy Credits</a>
                </div>
              </div>
            </div>

            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {imageUploadLoading ? (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  ) : modalDisplayImage ? (
                    <img 
                      src={modalDisplayImage} 
                      alt="Profile"
                      onError={(e) => {
                        console.error('Failed to load image:', modalDisplayImage);
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-xl">${getInitials(editedData.name || user?.name)}</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-xl">
                      {getInitials(editedData.name || user?.name)}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                  disabled={imageUploadLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full"
                  value={editedData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  value={editedData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Phone</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="input input-bordered w-full"
                  value={editedData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium" >Bio &nbsp;</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24 resize-none"
                  placeholder="Tell us about yourself..."
                  value={editedData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-action mt-8">
            <button 
              className="btn btn-outline"
              onClick={handleCancelProfile}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSaveProfile}
              disabled={imageUploadLoading}
            >
              {imageUploadLoading ? (
                <span className="loading loading-spinner loading-sm mr-2"></span>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </div>
      </dialog>

      {/* Logout Confirmation Modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to logout?</p>
          <div className="modal-action">
            <button 
              className="btn btn-outline"
              onClick={() => (document.getElementById('logout_modal') as HTMLDialogElement | null)?.close()}
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleLogout}>
              Yes, Logout
            </button>
            </div>
        </div>
      </dialog>
    </>
  );
};

export default NavbarPage;