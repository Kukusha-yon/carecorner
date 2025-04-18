import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getNewArrivals } from '../services/newArrivalService';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const NewArrivalSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const swiperRef = useRef(null);

  const { data: newArrivals, isLoading, error } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: getNewArrivals,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Ensure newArrivals is an array
  const arrivalsArray = Array.isArray(newArrivals) ? newArrivals : [];

  const handleButtonClick = (direction) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (direction === 'next') {
        swiperRef.current.swiper.slideNext();
      } else {
        swiperRef.current.swiper.slidePrev();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 mb-4 sm:mb-6">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4 mb-3 sm:mb-4"></div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex space-x-3 sm:space-x-4 overflow-x-auto px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-48 sm:w-64">
                <div className="h-36 sm:h-48 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded mt-2"></div>
                <div className="h-4 bg-gray-200 rounded mt-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading new arrivals:', error);
    return (
      <div className="w-full py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>Unable to load new arrivals. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!arrivalsArray.length) {
    return (
      <div className="w-full py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>No new arrivals available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 mb-4 sm:mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">New Arrivals</h2>
          <Link 
            to="/new-arrivals" 
            className="text-primary hover:text-primary-dark transition-colors text-xs sm:text-sm md:text-base"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>

      <div 
        className="relative w-full group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, Pagination, Navigation, FreeMode]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-primary/50',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary'
          }}
          navigation={false}
          freeMode={{ momentum: true }}
          className="w-full pb-12"
        >
          {arrivalsArray.map((newArrival) => (
            <SwiperSlide key={newArrival._id}>
              <Link
                to={`/new-arrivals/${newArrival._id}`}
                className="block h-full"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={newArrival.image}
                      alt={newArrival.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x200?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2 h-10 sm:h-12 md:h-14">
                        {newArrival.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 h-8 sm:h-10">
                        {newArrival.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-primary font-bold text-xs sm:text-sm md:text-base">
                        ETB {typeof newArrival.price === 'number' 
                          ? newArrival.price.toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
          <button 
            onClick={() => handleButtonClick('prev')}
            className="swiper-button-prev !text-primary !left-2 !bottom-16 sm:!bottom-14 !w-8 sm:!w-10 !h-8 sm:!h-10 !bg-white/80 !rounded-full !transition-opacity !duration-300 !opacity-0 group-hover:!opacity-100 !transform-none hover:!bg-white hover:!shadow-md !z-10 !border-none !outline-none !cursor-pointer"
          />
          <button 
            onClick={() => handleButtonClick('next')}
            className="swiper-button-next !text-primary !right-2 !bottom-16 sm:!bottom-14 !w-8 sm:!w-10 !h-8 sm:!h-10 !bg-white/80 !rounded-full !transition-opacity !duration-300 !opacity-0 group-hover:!opacity-100 !transform-none hover:!bg-white hover:!shadow-md !z-10 !border-none !outline-none !cursor-pointer"
          />
        </Swiper>
      </div>
    </div>
  );
};

export default NewArrivalSection; 