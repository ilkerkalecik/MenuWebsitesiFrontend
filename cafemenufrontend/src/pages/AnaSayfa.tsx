import React, { useState } from 'react';

const AnaSayfa = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    'https://www.kahveperest.com.tr/resimler/31012024103516.png',
    'https://via.placeholder.com/600x400?text=Slide+2',
    'https://via.placeholder.com/600x400?text=Slide+3',
  ];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className='space-y-12'>
      <div className='px-10 mt-32   justify-center flex-col space-y-7 text-start'>
        <div className='space-y-7'>
          <h1 className='text-4xl  tracking-wider font-semibold  text-mainColor'>
            Kahveperest'e Hoşgeldiniz!
          </h1>
          <p className='text-sm text-neutral-800 font-light tracking-wider'>
            Damak zevkinize en uygun iyi yiyecek ve içecekler için
          </p>
        
          <button className='bg-mainColor text-neutral-50 p-3 rounded-full font-bold text-sm w-auto'>
          <a href="/menu">Menüyü Görüntüle</a>
          </button>
        </div>
      </div>
      {/* Carousel */}
      <div className='relative w-full max-w-4xl mx-auto'>
        <div className='overflow-hidden rounded-lg'>
          <div
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className='w-full flex-shrink-0'>
                <img src={image} alt={`Slide ${index + 1}`} className='w-full' />
              </div>
            ))}
          </div>
        </div>
        {/* Arrows */}
        <button
          onClick={goToPrevious}
          className='absolute left-0 top-1/2 transform -translate-y-1/2  bg-opacity-50 text-white p-3 '
        >
          &#8592;
        </button>
        <button
          onClick={goToNext}
          className='absolute right-0 top-1/2 transform -translate-y-1/2  bg-opacity-50 text-white p-3 rounded-full'
        >
          &#8594;
        </button>
      </div>

    </div>

  );
};

export default AnaSayfa;
