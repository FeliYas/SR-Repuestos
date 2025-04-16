import { useEffect, useState } from 'react';

const BrandSlider = () => {
  // Array de ejemplo con logos (puedes reemplazar estos con tus propias imágenes)
  const logos = [
    { id: 1, name: 'Molas Marchetti', src: '/api/placeholder/200/80', alt: 'Molas Marchetti Logo' },
    { id: 2, name: 'Frasle', src: '/api/placeholder/200/80', alt: 'Frasle Logo' },
    { id: 3, name: 'Master', src: '/api/placeholder/200/80', alt: 'Master Logo' },
    { id: 4, name: 'Suspensys', src: '/api/placeholder/200/80', alt: 'Suspensys Logo' },
    { id: 5, name: 'Logo 5', src: '/api/placeholder/200/80', alt: 'Logo 5' },
    { id: 6, name: 'Logo 6', src: '/api/placeholder/200/80', alt: 'Logo 6' },
    { id: 7, name: 'Logo 7', src: '/api/placeholder/200/80', alt: 'Logo 7' },
    { id: 8, name: 'Logo 8', src: '/api/placeholder/200/80', alt: 'Logo 8' },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 4;
  const totalPages = Math.ceil((logos.length - itemsPerPage) + 1);
  
  // Calcular la página actual basada en el índice de inicio
  const currentPage = Math.min(Math.floor(startIndex / 1), logos.length - itemsPerPage);
  
  // Función para mover a la siguiente página
  const nextSlide = () => {
    if (isAnimating || startIndex >= logos.length - itemsPerPage) return;
    
    setIsAnimating(true);
    setStartIndex(prev => Math.min(prev + 1, logos.length - itemsPerPage));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Función para mover a la página anterior
  const prevSlide = () => {
    if (isAnimating || startIndex <= 0) return;
    
    setIsAnimating(true);
    setStartIndex(prev => Math.max(prev - 1, 0));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Función para cambiar a una página específica
  const goToPage = (page) => {
    if (isAnimating) return;
    
    const newIndex = Math.min(page, logos.length - itemsPerPage);
    
    setIsAnimating(true);
    setStartIndex(newIndex);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Calcular el estilo de transformación basado en el índice de inicio
  const getTransformStyle = () => {
    // Ancho aproximado de cada elemento + gap
    const itemWidth = 25; // 25% para 4 elementos
    return {
      transform: `translateX(-${startIndex * itemWidth}%)`,
      transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none',
      display: 'grid',
      gridTemplateColumns: `repeat(${logos.length}, 1fr)`,
      width: `${logos.length * 25}%`,
    };
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      {/* Contenedor del slider con ancho fijo y overflow hidden */}
      <div className="w-full overflow-hidden relative">
        <div 
          className="w-full"
          style={getTransformStyle()}
        >
          {logos.map((logo) => (
            <div key={logo.id} className="flex items-center justify-center p-4 bg-white rounded shadow mx-2">
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className="max-h-20 max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicadores de página y controles */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button 
          onClick={prevSlide}
          disabled={startIndex === 0 || isAnimating}
          className="text-blue-600 font-bold px-2 py-1 rounded disabled:opacity-30"
        >
          &lt;
        </button>
        
        {/* Indicadores de página */}
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`h-2 w-8 rounded-full ${
                startIndex === index ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              aria-label={`Página ${index + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
        
        <button 
          onClick={nextSlide}
          disabled={startIndex >= logos.length - itemsPerPage || isAnimating}
          className="text-blue-600 font-bold px-2 py-1 rounded disabled:opacity-30"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BrandSlider;




