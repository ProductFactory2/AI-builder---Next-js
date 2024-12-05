'use client';

import React from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ['latin'] 
});

export default function LoaderPage() {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-transparent">
      <div className="absolute inset-0 backdrop-blur-[6px]" />
      <div className="relative z-10">
        {/* <style jsx>{`
          @keyframes dot1 {
            3%, 97% {
              width: 160px;
              height: 100px;
              margin-top: -50px;
              margin-left: -80px;
            }
            30%, 36% {
              width: 80px;
              height: 120px;
              margin-top: -60px;
              margin-left: -40px;
            }
            63%, 69% {
              width: 40px;
              height: 80px;
              margin-top: -40px;
              margin-left: -20px;
            }
          }

          @keyframes dot2 {
            3%, 97% {
              height: 90px;
              width: 150px;
              margin-left: -75px;
              margin-top: -45px;
            }
            30%, 36% {
              width: 70px;
              height: 96px;
              margin-left: -35px;
              margin-top: -48px;
            }
            63%, 69% {
              width: 32px;
              height: 60px;
              margin-left: -16px;
              margin-top: -30px;
            }
          }

          @keyframes dot3 {
            3%, 97% {
              height: 20px;
              width: 40px;
              margin-left: -20px;
              margin-top: 50px;
            }
            30%, 36% {
              width: 8px;
              height: 8px;
              margin-left: -5px;
              margin-top: 49px;
              border-radius: 8px;
            }
            63%, 69% {
              width: 16px;
              height: 4px;
              margin-left: -8px;
              margin-top: -37px;
              border-radius: 10px;
            }
          }
        `}</style> */}
                  <div className={`text-[#FF5722] text-lg mt-60 text-center text-[20px] font-semibold px-4 py-2 rounded-lg ${poppins.className}`}>
                    Your response is being generated...
                  </div>
                  <div className={`bg-[#FF5722]  mt-2 text-center text-[30px] font-bold  text-[#1e3f57] px-4 py-2 rounded-lg ${poppins.className}`}>
                    Irung Bhai.....
                  </div>
        <div 
          className="absolute top-1/2 left-1/2 z-10 w-40 h-24 -ml-20 -mt-12 
                     bg-[#1e3f57] rounded-md"
          style={{
            animation: 'dot1 3s cubic-bezier(0.55,0.3,0.24,0.99) infinite'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 z-20 w-[150px] h-[90px] -ml-[75px] -mt-[45px] 
                     bg-[#3c517d] rounded-sm"
          style={{
            animation: 'dot2 3s cubic-bezier(0.55,0.3,0.24,0.99) infinite'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 z-30 w-10 h-5 -ml-5 mt-12 
                     bg-[#FF5722] rounded-b-md"
          style={{
            animation: 'dot3 3s cubic-bezier(0.55,0.3,0.24,0.99) infinite'
          }}
        ></div>

      </div>
    </div>
  );
}