'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from '@/app/components/combos/ComboCard.module.css';
import { useCart } from '@/app/context/CartContext';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

interface Combo {
  id: number;
  name: string;
  mainTitle: string;
  subTitle: string;
  price: number | string;
  mrp: number | string;
  discount: number;
  image_url: string | null;
  rating: number | string;
  reviews: number;
  weight: string;
  category: string;
  product1_name: string;
  product1_price: number | string;
  product1_image: string | null;
  product2_name: string;
  product2_price: number | string;
  product2_image: string | null;
}

export default function ComboCard({ combo }: { combo: Combo }) {
  const { addToCart, syncCartWithServer } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          const rootElement = document.body;
          if (rootElement) {
            Modal.setAppElement(rootElement);
            setModalReady(true);
          }
        } catch (error) {
          console.error("Error setting up react-modal:", error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  const getUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  const handleAddToCart = async () => {
    try {
      const user = getUser();
      await addToCart({
        id: combo.id,
        name: combo.name,
        price: Number(combo.price),
        image: combo.image_url || null,
        type: 'combo',
        weight: combo.weight,
      });

      if (user) {
        const result = await syncCartWithServer(user.id);
        if (result?.success) {
          toast.success(`${combo.name} added to cart successfully!`);
        }
      } else {
        toast.success(`${combo.name} added to cart successfully!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add combo to cart');
    }
  };

  const openProductModal = () => {
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

  const getImageUrl = (url: string | null, isCombo: boolean = false) => {
    if (isCombo && !url) return '/salty.jpg';
    if (!url) return null;
    // Local paths (e.g. /uploads/combo-xxx.jpg from backend uploads) - use as-is
    if (url.startsWith('/')) return url;
    // External URLs - proxy through our API
    if (url.startsWith('http')) return `/api/proxy?url=${encodeURIComponent(url)}`;
    // Relative paths without leading slash - treat as local
    return `/${url}`;
  };

  const images = {
    combo: getImageUrl(combo.image_url, true),
    product1: getImageUrl(combo.product1_image),
    product2: getImageUrl(combo.product2_image),
  };

  const renderStars = () => {
    const ratingValue = Number(combo.rating) || 0;
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.filledStar}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={styles.halfStar}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.emptyStar}>★</span>);
      }
    }

    return stars;
  };

  const price = Number(combo.price) || 0;
  const mrp = Number(combo.mrp) || 0;
  const product1Price = Number(combo.product1_price) || 0;
  const product2Price = Number(combo.product2_price) || 0;
  const rating = Number(combo.rating) || 0;

  return (
    <div className={styles.comboCard}>
      <div className={styles.comboImageContainer}>
        <Image
          src={images.combo}
          alt={combo.name}
          width={300}
          height={200}
          className={styles.comboImage}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {combo.discount > 0 && (
          <div className={styles.discountBadge}>
            {combo.discount}% OFF
          </div>
        )}
      </div>

      <div className={styles.comboDetails}>
        <h3 className={styles.comboName}>{combo.name}</h3>
        {combo.mainTitle && <h4 className={styles.mainTitle}>{combo.mainTitle}</h4>}
        {combo.subTitle && <p className={styles.subTitle}>{combo.subTitle}</p>}

        {combo.weight && (
          <p className={styles.weightText}>Weight: {combo.weight}</p>
        )}

        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>₹{price.toFixed(2)}</span>
          {mrp > price && (
            <span className={styles.originalPrice}>₹{mrp.toFixed(2)}</span>
          )}
        </div>

        <div className={styles.ratingContainer}>
          <div className={styles.stars}>{renderStars()}</div>
          <span className={styles.ratingValue}>
            {rating.toFixed(1)} / 5
          </span>
          <span className={styles.reviews}>
            ({combo.reviews} reviews)
          </span>
        </div>
        <div className={styles.productsContainer}>
          <h4>Includes:</h4>
          <div className={styles.productsGrid}>
            <div className={styles.productItem}>
              <div className={styles.productBox}>
                <span className={styles.productName}>{combo.product1_name}</span>
                <span className={styles.productPrice}>₹{product1Price.toFixed(2)}</span>
              </div>
              <div className={styles.productBox}>
                <span className={styles.productName}>{combo.product2_name}</span>
                <span className={styles.productPrice}>₹{product2Price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className={styles.infoButton}
            onClick={openProductModal}
            aria-label="View combo details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M450-290h60v-230h-60v230Zm30-298.46q13.73 0 23.02-9.29t9.29-23.02q0-13.73-9.29-23.02-9.29-9.28-23.02-9.28t-23.02 9.28q-9.29 9.29-9.29 23.02t9.29 23.02q9.29 9.29 23.02 9.29Zm.07 488.46q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
          </button>
        </div>
      </div>

      {modalReady && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeProductModal}
          className={styles.comboModal}
          overlayClassName={styles.modalOverlay}
        >
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeProductModal}>
              &times;
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalImages}>
                <div className={styles.mainImage}>
                  <Image
                    src={images.combo}
                    alt={combo.name}
                    width={500}
                    height={300}
                    className={styles.image}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <div className={styles.modalProductsGrid}>
                  <div className={styles.modalProductItem}>
                    <Image
                      src={images.product1}
                      alt={combo.product1_name}
                      width={150}
                      height={150}
                      className={styles.productImage}
                      onError={(e) => {
                        e.currentTarget.src = '/salty.jpg';
                      }}
                    />
                    <span>{combo.product1_name}</span>
                  </div>

                  <div className={styles.modalProductItem}>
                    <Image
                      src={images.product2}
                      alt={combo.product2_name}
                      width={150}
                      height={150}
                      className={styles.productImage}
                      onError={(e) => {
                        e.currentTarget.src = '/salty.jpg';
                      }}
                    />
                    <span>{combo.product2_name}</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalDetails}>
                <h2>{combo.name}</h2>
                {combo.mainTitle && <h3>{combo.mainTitle}</h3>}
                {combo.subTitle && <p className={styles.description}>{combo.subTitle}</p>}

                <div className={styles.priceContainer}>
                  <span className={styles.currentPrice}>₹{price.toFixed(2)}</span>
                  {mrp > price && (
                    <span className={styles.originalPrice}>₹{mrp.toFixed(2)}</span>
                  )}
                  {combo.discount > 0 && (
                    <span className={styles.discountTag}>
                      {combo.discount}% OFF
                    </span>
                  )}
                </div>

                <div className={styles.ratingContainer}>
                  <div className={styles.stars}>{renderStars()}</div>
                  <span>{rating.toFixed(1)} / 5 ({combo.reviews} reviews)</span>
                </div>

                <div className={styles.specs}>
                  <p><strong>Weight:</strong> {combo.weight}</p>
                  <p><strong>Category:</strong> {combo.category}</p>
                </div>

                <div className={styles.comboSavings}>
                  <h4>Individual Products:</h4>
                  <p>{combo.product1_name}: ₹{product1Price.toFixed(2)}</p>
                  <p>{combo.product2_name}: ₹{product2Price.toFixed(2)}</p>
                  <div className={styles.totalLine}>
                    <span>Total Individual Price:</span>
                    <span>₹{(product1Price + product2Price).toFixed(2)}</span>
                  </div>
                  <div className={styles.savingsLine}>
                    <span>Your Savings:</span>
                    <span>₹{Math.max(0, (product1Price + product2Price) - price).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className={styles.addToCartButton}
                  onClick={() => {
                    handleAddToCart();
                    closeProductModal();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}