"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    src: "/imgs/isometric-ilustration.png",
    alt: "Ilustração de agendamentos - 1",
  },
  {
    src: "/imgs/isometric-ilustration-2.png",
    alt: "Ilustração de agendamentos - 2",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative group w-full">
      {/* Imagens do Carrossel - sem container/branco, fundo transparente */}
      <div className="relative overflow-hidden bg-transparent">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full flex items-center justify-center bg-transparent">
              <Image
                src={image.src}
                alt={image.alt}
                width={1200}
                height={700}
                className="w-full h-auto object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Setas de Navegação (aparecem no hover) - sem fundo branco, discretas */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
        aria-label="Imagem anterior"
        style={{ background: 'rgba(0,0,0,0.25)' }}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
        aria-label="Próxima imagem"
        style={{ background: 'rgba(0,0,0,0.25)' }}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores (bolinhas) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-emerald-600"
                : "w-2.5 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
