'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import styles from '@/app/components/navbar/Navbar.module.css';

const messages: string[] = [
  "Buy 3, Get ₹100 off | Free Shipping for 15K+ Pincodes",
  "New Arrivals are here – Check them out!",
  "Limited Time Offer: 10% off on all orders above ₹999"
];

const Navbar = () => {
  const { toggleCart, itemCount } = useCart();
  const { user, login, adminLogin, signup, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isAdminLoginMode, setIsAdminLoginMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const profileDropdownRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await axios.get(`/api/products?search=${searchQuery}`);
          setSearchResults(res.data);
          setShowResults(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/search?search=${searchQuery}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (itemName: string) => {
    router.push(`/search?search=${itemName}`);
    setSearchQuery(itemName);
    setShowResults(false);
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !(profileDropdownRef.current as any).contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async () => {
    if (isAdminLoginMode) {
      if (!phoneNumber || !password) {
        setError('Username and password are required');
        return;
      }
    } else {
      if (!phoneNumber) {
        setError('Phone number is required');
        return;
      }
    }

    setIsAuthLoading(true);
    setError('');

    try {
      let result;
      if (isAdminLoginMode) {
        // for admin login, phoneNumber state is used as username
        result = await adminLogin(phoneNumber, password);
      } else {
        result = await login(phoneNumber, password);
      }

      if (result.success) {
        setIsProfileModalOpen(false);
        setPhoneNumber('');
        setPassword('');
        if (isAdminLoginMode) {
          router.push('/admin/dashboard');
        }
      } else if (!isAdminLoginMode && result.error?.includes('not found')) {
        setIsSignupMode(true);
        setError('This number is not registered. Please sign up.');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
  };

  const handleSignup = async () => {
    if (!phoneNumber || !fullName || !email || !password) {
      setError('All fields are required');
      return;
    }

    setIsAuthLoading(true);
    setError('');

    try {
      const result = await signup(fullName, email, phoneNumber, password);

      if (result.success) {
        setIsProfileModalOpen(false);
        setPhoneNumber('');
        setFullName('');
        setEmail('');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignupMode) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.notificationBar}>
        <div className={styles.notificationContent}>
          <span className={styles.offerText}>{messages[currentIndex]}</span>
        </div>
      </div>
      <div className="py-2 px-3" style={{ borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">

            {/* Left: Social Icons */}
            <div>
              <a href="#" className="text-dark me-3">
                <img width="30" height="30" src="https://img.icons8.com/ios/50/facebook-new.png" alt="facebook-new" />
              </a>
              <a href="#" className="text-dark me-3">
                <img width="30" height="30" src="https://img.icons8.com/ios/50/instagram-new--v1.png" alt="instagram-new--v1" />
              </a>
              <a href="#" className="text-dark me-3">
                <img width="30" height="30" src="https://img.icons8.com/ios/50/twitterx--v1.png" alt="twitterx--v1" />
              </a>
              <a href="#" className="text-dark me-3">
                <img width="30" height="30" src="https://img.icons8.com/ios/50/whatsapp--v1.png" alt="whatsapp--v1" />
              </a>
            </div>

            {/* Right: Contact Info */}
            <div className="text-dark">
              Contact us on: <strong>18008332015</strong>
            </div>

          </div>
        </div>
      </div>
      <div className={styles.navbarWrapper}>
        <nav className={styles.mainNav}>
          {!isMobile ? (
            // Desktop Layout
            <div className={styles.navContainer}>
              <div className={styles.leftBanner}>
                <Image src='/Banner.jpg' alt="Promo" width={300} height={80} className={styles.bannerImg} />
              </div>

              <div className={styles.centerLogo}>
                <Image src='/MainLogo.png' alt="Shrihari Logo" width={120} height={50} className={styles.brandLogo} />
              </div>

              <div className={styles.rightSection}>
                <div className={styles.searchAndUser} ref={searchContainerRef} style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search our store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                  />
                  {showResults && searchResults.length > 0 && (
                    <div className={styles.searchResults}>
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          className={styles.searchItem}
                          onClick={() => handleResultClick(item.name)}
                        >
                          <div style={{ width: '40px', height: '40px', position: 'relative', flexShrink: 0 }}>
                            <Image
                              src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : (item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`)) : '/placeholder.jpg'}
                              alt={item.name}
                              fill
                              style={{ objectFit: 'cover', borderRadius: '4px' }}
                            />
                          </div>
                          <div className={styles.searchItemInfo}>
                            <span className={styles.searchItemName}>{item.name}</span>
                            <span className={styles.searchItemPrice}>₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.iconGroup}>
                  <div className={styles.navButtons}>
                    <div className={styles.profileDropdown} ref={profileDropdownRef}>
                      <button
                        type='button'
                        className={styles.loginButton}
                        onClick={() => {
                          if (user) {
                            if (user.role === 'admin' || user.name === 'admin') {
                              router.push('/admin/dashboard');
                            } else {
                              setIsProfileDropdownOpen(!isProfileDropdownOpen);
                            }
                          } else {
                            setIsProfileModalOpen(true);
                          }
                        }}
                      >
                        {user && (
                          <span className={styles.userName}>
                            {user.name.split(' ')[0]}
                          </span>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                          <path d="M240.92-268.31q51-37.84 111.12-59.77Q412.15-350 480-350t127.96 21.92q60.12 21.93 111.12 59.77 37.3-41 59.11-94.92Q800-417.15 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 62.85 21.81 116.77 21.81 53.92 59.11 94.92ZM480.01-450q-54.78 0-92.39-37.6Q350-525.21 350-579.99t37.6-92.39Q425.21-710 479.99-710t92.39 37.6Q610-634.79 610-580.01t-37.6 92.39Q534.79-450 480.01-450Z" />
                        </svg>
                      </button>

                      {user && isProfileDropdownOpen && (
                        <div className={styles.profileDropdownMenu}>
                          <div className={styles.profileInfo}>
                            <div className={styles.profileName}>👤 {user.name}</div>
                            <div className={styles.profileEmail}>{user.email}</div>
                            <div className={styles.profilePhone}>{user.phone}</div>
                          </div>
                          <button
                            className={styles.dropdownButton}
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={styles.cartIcon} onClick={() => toggleCart()}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#1f1f1f">
                        <path d="M180-100v-600h150v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h150v600H180Zm60-60h480v-480h-90v120h-60v-120H390v120h-60v-120h-90v480Z" />
                      </svg>
                      {itemCount > 0 && (
                        <span className={styles.cartBadge}>{itemCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Mobile Layout - Banner on top, Logo in middle, Search + Icons on bottom
            <div className={styles.mobileNavContainer}>
              {/* 1. Top Row - Banner */}
              <div className={styles.mobileBanner}>
                <Image src='/Banner.jpg' alt="Promo" width={300} height={80} className={styles.bannerImg} />
              </div>

              {/* 2. Middle Row - Logo */}
              <div className={styles.mobileLogo}>
                <Image src='/MainLogo.png' alt="Shrihari Logo" width={150} height={50} className={styles.brandLogo} />
              </div>

              {/* 3. Bottom Row - Search + Icons */}
              <div className={styles.mobileBottomRow} style={{ position: 'relative' }}>
                <div style={{ flexGrow: 1, position: 'relative' }}>
                  <input
                    type="text"
                    className={styles.mobileSearchBar}
                    placeholder="Search our store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    style={{ width: '100%' }}
                  />
                  {showResults && searchResults.length > 0 && (
                    <div className={styles.searchResults} style={{ top: '100%', left: 0, width: '100%', maxHeight: '40vh' }}>
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          className={styles.searchItem}
                          onClick={() => handleResultClick(item.name)}
                        >
                          <div style={{ width: '40px', height: '40px', position: 'relative', flexShrink: 0 }}>
                            <Image
                              src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : (item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`)) : '/placeholder.jpg'}
                              alt={item.name}
                              fill
                              style={{ objectFit: 'cover', borderRadius: '4px' }}
                            />
                          </div>
                          <div className={styles.searchItemInfo}>
                            <span className={styles.searchItemName}>{item.name}</span>
                            <span className={styles.searchItemPrice}>₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.mobileIconsGroup}>
                  <div className={styles.profileDropdown} ref={profileDropdownRef}>
                    <button
                      type='button'
                      className={styles.loginButton}
                      onClick={() => {
                        if (user) {
                          setIsProfileDropdownOpen(!isProfileDropdownOpen);
                        } else {
                          setIsProfileModalOpen(true);
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                        <path d="M240.92-268.31q51-37.84 111.12-59.77Q412.15-350 480-350t127.96 21.92q60.12 21.93 111.12 59.77 37.3-41 59.11-94.92Q800-417.15 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 62.85 21.81 116.77 21.81 53.92 59.11 94.92ZM480.01-450q-54.78 0-92.39-37.6Q350-525.21 350-579.99t37.6-92.39Q425.21-710 479.99-710t92.39 37.6Q610-634.79 610-580.01t-37.6 92.39Q534.79-450 480.01-450Z" />
                      </svg>
                    </button>
                    {user && isProfileDropdownOpen && (
                      <div className={styles.profileDropdownMenu}>
                        <div className={styles.profileInfo}>
                          <div className={styles.profileName}>👤 {user.name}</div>
                          <div className={styles.profileEmail}>{user.email}</div>
                          <div className={styles.profilePhone}>{user.phone}</div>
                        </div>
                        <button
                          className={styles.dropdownButton}
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={styles.cartIcon} onClick={() => toggleCart()}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                      <path d="M180-100v-600h150v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h150v600H180Zm60-60h480v-480h-90v120h-60v-120H390v120h-60v-120h-90v480Z" />
                    </svg>
                    {itemCount > 0 && (
                      <span className={styles.cartBadge}>{itemCount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Auth Modal */}
      {isProfileModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {isAdminLoginMode ? 'Admin Login' : isSignupMode ? 'Sign Up' : 'Log In'}
            </h2>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleAuthSubmit}>
              {isSignupMode && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </>
              )}

              <input
                type={isAdminLoginMode ? "text" : "tel"}
                placeholder={isAdminLoginMode ? "Username" : "Phone Number"}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.inputField}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                required
              />

              {!isSignupMode && !isAdminLoginMode && (
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      router.push('/forgot-password');
                    }}
                    style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={styles.authButton}
                disabled={isAuthLoading}
              >
                {isAuthLoading ? 'Processing....' : isAdminLoginMode ? 'Login as Admin' : isSignupMode ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            <p className={styles.authToggle}>
              {isSignupMode ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignupMode(!isSignupMode);
                  setError('');
                }}
                className={styles.toggleButton}
              >
                {isSignupMode ? 'Log In' : 'Sign Up'}
              </button>
            </p>

            {!isSignupMode && (
              <p className={styles.authToggle}>
                <button
                  onClick={() => {
                    setIsAdminLoginMode(!isAdminLoginMode);
                    setError('');
                    setPhoneNumber('');
                    setPassword('');
                  }}
                  className={styles.toggleButton}
                  style={{ fontSize: '0.9rem', marginTop: '10px' }}
                >
                  {isAdminLoginMode ? 'Back to User Login' : 'Login as Admin'}
                </button>
              </p>
            )}

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setError('');
              }}
              className={styles.closeModalButton}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;