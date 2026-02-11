'use client';

import { useState } from "react";
import axios from "axios";
import Image from 'next/image';
import styles from '@/app/components/Footer.module.css';
import Link from 'next/link';


const Footer = () => {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const [partnerData, setPartnerData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    description: ''
  });

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    description: ''
  });

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/queries/partner", partnerData);
      if (response.data.success) {
        alert("Partner query submitted successfully!");
        setPartnerData({ name: '', email: '', phone: '', state: '', city: '', description: '' });
        setShowPartnerModal(false);
      } else {
        alert(response.data.message || "Failed to submit partner query");
      }
    } catch (err: any) {
      console.error("Error submitting partner query:", err);
      if (err.response) {
        alert(err.response.data.message || "Failed to submit partner query");
      } else if (err.request) {
        alert("Server not responding. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactData.name || !contactData.email || !contactData.description) {
      alert('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post("/api/queries/contact", contactData);

      if (response.data.success) {
        alert("Message sent successfully!");
        setContactData({ name: '', email: '', description: '' });
        setShowContactModal(false);
      } else {
        alert(response.data.message || "Failed to send message");
      }
    } catch (err: any) {
      let errorMessage = "Failed to send message. Please try again.";

      if (err.response) {
        errorMessage = err.response.data.message ||
          err.response.data.error ||
          errorMessage;
      }

      alert(errorMessage);
      console.error("Submission error:", err);
    }
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <p>ShreeBandhu - Made Better, Tastes Better.
              We believe that good food should make people feel good about eating it. That's why we are dedicated to selecting only the finest ingredients and crafting each recipe with expertise and care. Because at the end of the day, food that's made better, taste's better.</p>
            <p className={styles.contactInfo}>Contact Us:<br />9.30 AM to 6.30 PM - Mon to Fri<br />
              18008332015<br />www.shreebandhu.com <br /> care@shreebandhu.com</p>

          </div>

          <div className={styles.footerSection}>
            <h3>Policies</h3>
            <ul>

              <li><Link href="/footerpages/privacypolicy">Privacy Policy</Link></li>
              <li><Link href="/footerpages/termsofuse">Terms of Use</Link></li>
              <li><Link href="/footerpages/refundpolicy">Refund Policy</Link></li>
            </ul>

          </div>

          <div className={styles.footerSection}>
            <h3>Shop for products</h3>
            <ul>
              <li><a href="">Fruit Powders</a></li>
              <li><a href="">Vegetable Powders</a></li>
              <li><a href="">Namkeens</a></li>
              <li><a href="">Spices</a></li>
              <li><a href="">All Products</a></li>
              <li><a href="">Bulk Orders/Samples</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Useful Links</h3>
            <ul>
              <li><a href="">About Shreebandhu</a></li>
              <li><a href="">How to use the products</a></li>
              <li><a href="">Our Story</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowPartnerModal(true); }}>Partner Queries</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowContactModal(true); }}>Contact us</a></li>
            </ul>
          </div>
        </div>
      </footer>

      <div className={styles.footerExtraBar}>
        <div className={styles.leftSide}>
          <Image
            src='/89154ab8-7640-4e08-97f9-12e2ef49d3be.jpeg'
            alt="ISO 9001 Logo"
            className={styles.licenseLogo}
            width={80}
            height={80}
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/en/e/e2/FSSAI_logo.png"
            alt="FSSAI Logo"
            className={styles.licenseLogo}
            width={80}
            height={80}
          />
        </div>
        <div className={styles.rightSide}>
          {/* Available On Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Available On:</span>
            <a title="none" href="https://www.jiomart.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="https://upload.wikimedia.org/wikipedia/en/thumb/5/54/JioMart_logo.svg/800px-JioMart_logo.svg.png"
                alt="Jiomart"
                width={40}
                height={40}
              />
            </a>
            <a title="none" href="https://www.amazon.in" target="_blank" rel="noopener noreferrer">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
                width={60}
                height={20}
              />
            </a>
            <a title="Flipkart" href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Flipkart_logo.svg/300px-Flipkart_logo.svg.png"
                alt="Flipkart"
                width="90"
                height="25"
                style={{ objectFit: 'contain' }}
              />
            </a>
            <a title="IndiaMart" href="https://www.indiamart.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Indiamart_Logo.svg"
                alt="IndiaMart"
                width="80"
                height="40"
                style={{ objectFit: 'contain' }}
              />
            </a>
          </div>

          <div style={{ height: '40px', width: '1px', background: '#ddd', margin: '0 20px' }}></div>

          {/* Accepted Payments Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Accepted Payments:</span>
            <div style={{ position: 'relative', width: '50px', height: '30px' }}>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div style={{ position: 'relative', width: '50px', height: '30px' }}>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                alt="Mastercard"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div style={{ position: 'relative', width: '50px', height: '30px' }}>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                alt="UPI"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div style={{ position: 'relative', width: '50px', height: '30px' }}>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png"
                alt="RuPay"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p className={styles.copyright}>
            © 2025 Shree Bandhu. All rights reserved.

          </p>
          <div className="omo-footer">
            <div>Powered by</div>
            <a href="https://omodigital.io" className="omo-link">
              <div
                style={{
                  width: '120px',
                  height: '60px',
                  position: 'relative',
                  overflow: 'hidden',
                  // Add these to prevent layout shift:
                  minWidth: '120px',
                  minHeight: '60px'
                }}
              >
                <Image
                  src="/logo.jpg"
                  alt="OMO Logo"
                  fill
                  sizes="120px"
                  priority={true}  // Add this

                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                />
              </div>
            </a>
          </div>
        </div>
      </div>

      {showPartnerModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.partnerModal}>
            <h2>Partner Queries</h2>
            <form onSubmit={handlePartnerSubmit}>
              <input
                type="text"
                placeholder="Name"
                required
                value={partnerData.name}
                onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={partnerData.email}
                onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={partnerData.phone}
                onChange={(e) => setPartnerData({ ...partnerData, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="State"
                required
                value={partnerData.state}
                onChange={(e) => setPartnerData({ ...partnerData, state: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                required
                value={partnerData.city}
                onChange={(e) => setPartnerData({ ...partnerData, city: e.target.value })}
              />
              <textarea
                placeholder="Description"
                required
                value={partnerData.description}
                onChange={(e) => setPartnerData({ ...partnerData, description: e.target.value })}
              ></textarea>
              <div className={styles.modalActions}>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowPartnerModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.contactModal}>
            <h2>Contact Us</h2>
            <form onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Name"
                required
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              />
              <textarea
                placeholder="Description"
                required
                value={contactData.description}
                onChange={(e) => setContactData({ ...contactData, description: e.target.value })}
              ></textarea>
              <div className={styles.modalActions}>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowContactModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;