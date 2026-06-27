import React from 'react';
import { Phone, Mail } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section className="py-16 md:py-20 px-4 bg-brand-light">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[300px] md:min-h-[400px]">
        <h2 className="flex flex-col items-center font-sans font-black leading-[0.9] text-brand-brown uppercase mb-6 md:mb-8 tracking-normal">
          <span className="text-4xl md:text-[6.5rem]">Want to</span>
          <span className="text-5xl md:text-[8.5rem] mt-2">Connect?</span>
        </h2>
        <p className="font-sans font-medium text-sm md:text-2xl text-brand-brown uppercase mb-8 md:mb-12 tracking-wide max-w-3xl">Order Fresh Mushrooms in Delhi | Call or WhatsApp Now</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-24 w-full">
          <a href="tel:+918826986127" className="flex items-center gap-3 md:gap-4 group no-underline transition-transform hover:scale-105 duration-300">
            <Phone className="w-6 h-6 md:w-10 md:h-10 text-brand-text group-hover:text-brand-brown transition-colors duration-300" strokeWidth={2.5} />
            <span className="font-sans font-bold text-xl md:text-4xl text-brand-text group-hover:text-brand-brown transition-colors duration-300">+91-8826986127</span>
          </a>
          <a href="mailto:vinayaggarwal271@gmail.com" className="flex items-center gap-3 md:gap-4 group no-underline transition-transform hover:scale-105 duration-300 max-w-[90vw]">
            <Mail className="w-6 h-6 md:w-10 md:h-10 text-brand-text group-hover:text-brand-brown transition-colors duration-300 shrink-0" strokeWidth={2.5} />
            <span className="font-sans font-bold text-sm sm:text-lg md:text-4xl text-brand-text group-hover:text-brand-brown transition-colors duration-300 uppercase text-left">
              VINAYAGGARWAL271@GMAIL.COM
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
