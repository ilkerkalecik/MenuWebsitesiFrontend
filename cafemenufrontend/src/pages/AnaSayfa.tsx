import React from 'react';
import { useState, useEffect } from 'react';

import espresso from '../assets/espresso.jpeg';
import espresso2 from '../assets/espresso2.jpeg';
import kekikli from '../assets/kekikli.jpeg';
import serpme from '../assets/serpme.jpeg';
import icelatte from '../assets/icelatte.jpeg';
import piraye from '../assets/piraye.jpeg';



const AnaSayfa = () => {

  return (
    <div className='relative w-full h-svh'>
      {/* Background Image */}
      <div
        className=' h-full bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${espresso})` }}
      ></div>

      {/* Overlay with darker image */}
      <div className='absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center px-4 space-y-5 z-10'>
        <h1 className='text-neutral-200  font-thin text-5xl lg:text-8xl'>Kahveperest’e  Hoş Geldiniz</h1>
        <h1 className=' text-sm lg:text-2xl font-thin text-neutral-300 font-sans tracking-widest'>Tutkunuza tat katın!</h1>

        <button className='bg-mainColor text-neutral-50 lg:text-lg p-3 rounded-full font-bold text-sm w-auto'>
          <a href='/menu'>Menümüzü Keşfet</a>
        </button>
      </div>

      <div className="w-full  py-16 container mx-auto p-4 ">
        <div className=" mx-auto flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Metin Bölümü */}
          <div className="flex-1 space-y-6 text-neutral-900">
            <h2 className=" text-4xl lg:text-6xl  font-thin tracking-widest">
              Hakkımızda
            </h2>
            <p className="text-lg lg:text-xl font-extralight text-neutral-600 ">
              Kahveperest’in hikayesi, tutkuyla başladı. Amacımız, gerçek kahve
              tutkunlarına özel lezzetler sunarak kafe kültürünü yaşatmaktır.
            </p>
            <p className="text-lg lg:text-xl font-extralight text-neutral-600 ">
              Özenle seçilmiş kahve çekirdekleri, modern demleme teknikleri ve sıcak
              atmosferimizle sizi bir kahve deneyimine davet ediyoruz.
            </p>
          </div>

          {/* Görsel Bölümü */}
          <div className="flex-1 ">
            <img
              src={espresso2} // Buraya kafe konseptinizi anlatan bir görsel ekleyin
              alt="Kafe Konsepti"
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-950 py-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto text-center ">
          {/* Başlık */}
          <h2 className="text-4xl lg:text-5xl font-thin tracking-widest text-neutral-200 mb-8">
            Öne Çıkan Ürünler
          </h2>

          {/* Ürünler Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
            {/* Ürün 1 */}
            <div className="bg-neutral-950 rounded-lg shadow-lg overflow-hidden">
              <img
                src={piraye} // Buraya ürün görseli ekleyin
                alt="Piraye"
                className="w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-200 mb-2">Piraye</h3>
                <p className="text-neutral-300 font-thin text-sm">
                  Piraye, taze meyvelerle hazırlanmış lezzetli bir tatlıdır. Şık ve lezzetli bir tat deneyimi sunar.          </p>
              </div>
            </div>

            {/* Ürün 2 */}
            <div className="bg-neutral-950 rounded-lg shadow-lg overflow-hidden">
              <img
                src={serpme} // Buraya ürün görseli ekleyin
                alt="Serpme Kahvaltı"
                className="w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-200 mb-2">Serpme Kahvaltı</h3>
                <p className="text-neutral-300 font-thin text-sm">
                  Zengin bir serpme kahvaltı, çeşitli peynirler, zeytinler ve daha fazlasıyla sunulur. Davetkar bir kahvaltı deneyimi.                </p>
              </div>
            </div>

            {/* Ürün 3 */}
            <div className="bg-neutral-950 rounded-lg shadow-lg overflow-hidden">
              <img
                src={icelatte} // Buraya ürün görseli ekleyin
                alt="Ice Latte"
                className="w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-200 mb-2">Ice Latte</h3>
                <p className="text-neutral-300 font-thin text-sm">
                  Iced Latte, soğutulmuş espresso ve bolca buharlaştırılmış süt ile hazırlanır. Hafif ve ferahlatıcı bir içecek.                </p>
              </div>
            </div>

            {/* Ürün 4 */}
            <div className="bg-neutral-950 rounded-lg shadow-lg overflow-hidden">
              <img
                src={kekikli} // Buraya ürün görseli ekleyin
                alt="Kekikli Tavuk"
                className="w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-200 mb-2">Kekikli Tavuk</h3>
                <p className="text-neutral-300 font-thin text-sm">
                  Taze kekik ve baharatlarla marine edilmiş, ızgarada pişirilmiş lezzetli tavuk. Sağlıklı ve doyurucu bir seçenek.                </p>
              </div>
            </div>
          </div>

          {/* Tüm Menüyü Gör Butonu */}
          <div className="mt-12">
            <a
              href="/menu"
              className="bg-mainColor text-neutral-50 px-8 py-3 rounded-full font-semibold text-lg hover:bg-mainColor/90 transition-colors"
            >
              Tüm Menüyü Gör
            </a>
          </div>
        </div>
      </div>
      <div className="w-full py-16 px-4 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Google Maps */}
          <div className="flex-1 w-full h-96 lg:h-auto">
            <iframe className='w-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.14107020323!2d27.883575999999998!3d39.6465396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b7004bde6eb6c5%3A0x1d515642b80dc608!2sKahveperest%20%7C%20Merkez%20%C5%9Fub!5e0!3m2!1str!2str!4v1741641753833!5m2!1str!2str"  height="300" loading="lazy" ></iframe>
          </div>

          {/* İletişim Bilgileri */}
          <div className="flex-1 space-y-6 text-neutral-800">
            <h2 className="text-4xl lg:text-5xl font-thin tracking-widest">
              Konum & İletişim
            </h2>

            {/* Adres */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Adres</h3>
              <p className="text-neutral-700 font-thin">
                Eski Kuyumcular, Mekik Sk. No:23, 10010 Karesi/Balıkesir        </p>
            </div>

            {/* Telefon & E-posta */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Telefon & E-posta</h3>
              <p className="text-neutral-700 font-thin">+90 545 224 20 07</p>
              <p className="text-neutral-700 font-thin">info@kahveperest.com.tr</p>
            </div>

            {/* Açılış-Kapanış Saatleri */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Açılış-Kapanış Saatleri</h3>
              <p className="text-neutral-700 font-thin">Pazartesi - Cuma: 08:00 - 24:00</p>
              <p className="text-neutral-700 font-thin">Hafta Sonu: 08:00 - 24:00</p>
            </div>
          </div>
        </div>
      </div>
      

      <footer className='w-full bg-neutral-950 text-neutral-50 py-6 mt-16'>
        <div className='flex justify-end space-y-8 md:space-y-0 px-6'>
          {/* Links Section */}



          {/* Signature */}
          <div className=''>
            <p className='text-sm text-neutral-400'>
              Designed and Developed by <span className='font-thin tracking-widest text-neutral-50'>İlker Kalecik</span>
            </p>
          </div>
        </div>

        {/* Copyright Section */}

      </footer>

    </div>
  );
};

export default AnaSayfa;
