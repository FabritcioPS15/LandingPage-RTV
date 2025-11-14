import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { X, ChevronDown, Stethoscope, Gauge, Check, Phone, Mail } from 'lucide-react';
import popupImage from './Imagenes/Pop-Up.jpeg';
import { MdCheckCircle } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import BrandButton from './components/BrandButton';
import { Skeleton, SkeletonText } from './components/Skeleton.tsx';

type DocumentType = 'dni' | 'carnet';

type FormData = {
  documentType: DocumentType;
  nombres: string;
  apellidos: string;
  documento: string;
  celular: string;
  placa: string;
  fromEmpresa: boolean;
  empresa: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
};

function App() {
  const [formData, setFormData] = useState<FormData>({
    documentType: 'dni',
    nombres: '',
    apellidos: '',
    documento: '',
    celular: '',
    placa: '',
    fromEmpresa: false,
    empresa: ''
  });
  
  const [servicesOpen, setServicesOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [benefitIndex, setBenefitIndex] = useState<number>(0);
  const [plantIndex, setPlantIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [brandAlt, setBrandAlt] = useState<boolean>(false);
  const [brandPulse, setBrandPulse] = useState<boolean>(false);
  const [formInView, setFormInView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Nuevos estados para el efecto de máquina de escribir
  const [displayText, setDisplayText] = useState<string>('RTV SAN CRISTOBAL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const contacts: { title: string; description: string; href: string; icon: JSX.Element }[] = [
    { 
      title: 'WhatsApp', 
      description: 'Chatea con nosotros', 
      href: 'https://wa.me/51955403509',
      icon: <FaWhatsapp className="text-green-500" size={24} />
    },
    { 
      title: 'Teléfono', 
      description: 'Llámanos ahora mismo', 
      href: 'tel:+51955403509',
      icon: <Phone className="text-blue-500" size={24} />
    },
    { 
      title: 'Correo', 
      description: 'Escríbenos tus consultas', 
      href: 'mailto:contacto@rtvsancristobal.pe',
      icon: <Mail className="text-red-500" size={24} />
    }
  ];

  const services: Service[] = [
    {
      icon: Stethoscope,
      title: 'Policlínico',
      description: 'Atención médica integral para conductores y pasajeros',
      features: ['Éxamenes médicos',  'Equipo especializado']
    },
    {
      icon: Gauge,
      title: 'Escuela de Conductores',
      description: 'Capacitación profesional y segura para todos los niveles',
      features: ['Cursos certificados','Prácticas en ruta']
    }
  ];

  // Efecto para la animación de máquina de escribir mejorada
  useEffect(() => {
    const texts = ['RTV SAN CRISTOBAL', 'RTP SAN CRISTOBAL'];
    let currentTextIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150; // Velocidad base de escritura (ms)
    let deleteSpeed = 400; // Velocidad de borrado (ms)
    let pauseBetweenWords = 2000; // Pausa entre palabras (ms)
    let pauseAtEnd = 1500; // Pausa al terminar de escribir (ms)

    const typeWriter = () => {
      const currentText = texts[currentTextIndex];
      
      if (isDeleting) {
        // Efecto de borrado
        setDisplayText(currentText.substring(0, charIndex - 1));
        charIndex--;
        
        // Tiempo de pausa después de borrar
        if (charIndex === 0) {
          isDeleting = false;
          currentTextIndex = (currentTextIndex + 1) % texts.length;
          setTimeout(typeWriter, pauseBetweenWords);
          return;
        }
      } else {
        // Efecto de escritura
        setDisplayText(currentText.substring(0, charIndex + 1));
        charIndex++;
        
        // Si terminamos de escribir, iniciamos el borrado después de una pausa
        if (charIndex === currentText.length) {
          isDeleting = true;
          setTimeout(typeWriter, pauseAtEnd);
          return;
        }
      }
      
      // Velocidad de escritura/borrado con variación aleatoria para efecto más natural
      const speed = isDeleting ? 
        deleteSpeed + Math.random() * 50 : // Variación en la velocidad de borrado
        typeSpeed + (Math.random() * 50 - 25); // Pequeña variación en la velocidad de escritura
      
      setTimeout(typeWriter, speed);
    };
    
    // Iniciar la animación con un pequeño retraso inicial
    const timer = setTimeout(() => {
      setIsTyping(true);
      typeWriter();
    }, 1000);
    
    // Limpiar el temporizador al desmontar el componente
    return () => {
      clearTimeout(timer);
      setIsTyping(false);
    };
  }, []);

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    
    if (!formData.nombres.trim()) errors.nombres = 'Los nombres son requeridos';
    if (!formData.apellidos.trim()) errors.apellidos = 'Los apellidos son requeridos';
    
    // Validación de documento según el tipo seleccionado
    if (!formData.documento.trim()) {
      errors.documento = `El ${formData.documentType === 'dni' ? 'DNI' : 'Carnet de Extranjería'} es requerido`;
    } else {
      if (formData.documentType === 'dni') {
        if (!/^\d{8}$/.test(formData.documento)) {
          errors.documento = 'El DNI debe tener exactamente 8 dígitos';
        }
      } else {
        if (!/^[A-Z0-9]{1,20}$/i.test(formData.documento)) {
          errors.documento = 'El Carnet de Extranjería debe tener hasta 20 caracteres alfanuméricos';
        }
      }
    }
    
    // Validación de celular: exactamente 9 dígitos y que comience con 9
    if (!formData.celular.trim()) {
      errors.celular = 'El celular es requerido';
    } else if (!/^9\d{8}$/.test(formData.celular)) {
      errors.celular = 'El celular debe comenzar con 9 y tener 9 dígitos';
    }
    
    // Validación de placa: exactamente 6 caracteres alfanuméricos
    if (!formData.placa.trim()) {
      errors.placa = 'La placa es requerida';
    } else if (!/^[A-Z0-9]{6}$/i.test(formData.placa)) {
      errors.placa = 'La placa debe tener exactamente 6 caracteres (letras y números)';
    }
    
    return errors;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const errors = validateForm();
  
  if (Object.keys(errors).length === 0) {
    setIsSubmitting(true);
    
    try {
      // URL actualizada con la nueva implementación
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFzaGAyOZ4xF5UWEuDkOeNm8LW7UBxvQSTYHp_qTGdKTac1yxiGXdOAE6cRiVzN8sj/exec';
      
      console.log('Enviando datos al servidor...', formData);
      
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          debug: true  // Agregamos un flag de depuración
        })
      });

      console.log('Solicitud enviada. Verifica la hoja de cálculo.');
      
      // Mostrar mensaje de éxito
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      // Resetear formulario
      setFormData({
        documentType: 'dni',
        nombres: '',
        apellidos: '',
        documento: '',
        celular: '',
        placa: '',
        fromEmpresa: false,
        empresa: ''
      });
      setFormErrors({});
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      // Mostrar mensaje de éxito aunque haya error (por el modo no-cors)
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  } else {
    setFormErrors(errors);
  }
};

  const isFilled = (v: string) => v.trim().length > 0;

  // Autoplay del carrusel de contacto
  useEffect(() => {
    const id = setInterval(() => {
      setBenefitIndex((i) => (i + 1) % contacts.length);
    }, 3500);
    return () => clearInterval(id);
  }, [contacts.length]);

  // Efecto para la animación del formulario
  useEffect(() => {
    const formElement = document.querySelector('#contact-form');
    if (!formElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFormInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(formElement);
    return () => observer.disconnect();
  }, []);

  const nextContact = () => setBenefitIndex((i) => (i + 1) % contacts.length);
  const prevContact = () => setBenefitIndex((i) => (i - 1 + contacts.length) % contacts.length);

  // Datos de la planta
  const plant = {
    name: 'Planta RTV Ica',
    phone: '955403509',
    address: 'Ctra. Panamericana Sur 299, 11004'
  };

  // Importar imágenes para producción
  const plantImage1 = new URL('./Imagenes/3.jpeg', import.meta.url).href;
  const plantImage2 = new URL('./Imagenes/5.jpeg', import.meta.url).href;

  // Imágenes de la planta RTV Ica
  const plantImages = [
    plantImage1,
    plantImage2
  ];

  // Efecto para cambiar las imágenes automáticamente con transición suave
  useEffect(() => {
    const interval = setInterval(() => {
      setPlantIndex((prevIndex) => (prevIndex + 1) % plantImages.length);
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [plantImages.length]);

  // Oscilar texto RTV/RTP con pulsación cada ~5s (mantenido para compatibilidad)
  useEffect(() => {
    const id = setInterval(() => {
      setBrandAlt((v) => !v);
      setBrandPulse(true);
      setTimeout(() => setBrandPulse(false), 800);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let processedValue = value;
    
    switch (name) {
      case 'documentType':
        // Al cambiar el tipo de documento, limpiar el campo documento
        setFormData((prev) => ({
          ...prev,
          [name]: value as DocumentType,
          documento: '' // Limpiar el campo documento cuando se cambie el tipo
        }));
        // Limpiar error del documento
        if (formErrors.documento) {
          setFormErrors((prev) => ({
            ...prev,
            documento: ''
          }));
        }
        return;
      
      case 'documento':
        if (formData.documentType === 'dni') {
          // Solo números, exactamente 8 dígitos para DNI
          processedValue = value.replace(/\D/g, '').substring(0, 8);
        } else {
          // Carnet de extranjería: hasta 20 caracteres alfanuméricos, mayúsculas
          processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 20);
        }
        break;
      
      case 'placa':
        // Convertir a mayúsculas y limitar a exactamente 6 caracteres alfanuméricos
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
        break;
      
      case 'celular':
        // Solo números, máximo 9 dígitos, debe comenzar con 9
        processedValue = value.replace(/\D/g, '').substring(0, 9);
        // Si ya hay un 9 como primer dígito, no permitir cambiarlo
        if (processedValue.length > 0 && processedValue[0] !== '9') {
          processedValue = '9' + processedValue.substring(1);
        }
        break;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    const field = name as keyof FormData;
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-x-hidden">
      <header className="bg-[#ec8035] text-white shadow-lg sticky top-0 z-50">
        <div className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">RTV San Cristóbal</h1>
          {/* Toast */}
          <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="bg-white shadow-2xl rounded-xl p-6 border border-gray-100 w-80 max-w-[90vw] relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ec8035] to-[#f8b26a]"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <MdCheckCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">¡Gracias por tu registro!</h4>
                  <p className="text-sm text-gray-600 mb-3">Has obtenido <span className="font-bold text-[#ec8035]">S/10 de descuento</span> en:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 flex-shrink-0" size={16} />
                      Revisión Técnica
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 flex-shrink-0" size={16} />
                      Curso de Actualización
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 flex-shrink-0" size={16} />
                      Examen Médico
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowToast(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                <div 
                  className="h-full bg-[#ec8035] transition-all duration-500 ease-linear"
                  style={{ width: showToast ? '0%' : '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white w-full overflow-x-hidden">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full mx-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 z-10 bg-black text-white rounded-full p-1.5 hover:opacity-90"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              <img
                src={popupImage}
                alt="Promoción RTV San Cristóbal"
                className="w-full h-auto max-h-[400px] object-contain"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-black">Bienvenido a RTV San Cristóbal</h3>
                <p className="text-sm text-gray-700 mt-1">Aprovecha nuestras promociones y participa en una revisión técnica gratis.</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 inline-flex items-center justify-center bg-[#ec8035] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#d4692a]"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
          <div className="flex-1 w-full px-4 py-4 md:py-14">
            <div className="max-w-6xl mx-auto w-full">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-visible mb-6 md:mb-8 border border-black/5 w-full">
                {/* Pill fuera de la card, esquina superior izquierda */}
                <div className="absolute -top-4 -left-4 z-30 bg-black text-white shadow-xl rounded-full px-3 py-1 border border-white/10 flex items-center">
                  <span className="text-xs font-semibold whitespace-nowrap">Regístrate ahora</span>
                  <span className="ml-1.5 inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-[#ec8035] text-white">Tiempo limitado</span> 
                </div>
                <div className="grid lg:grid-cols-2 gap-0 w-full">
                  <div className="p-6 md:p-8 lg:p-10 w-full">
                    {/* Componente con efecto de máquina de escribir */}
                    <div className={`text-black text-xs font-semibold tracking-widest flex items-center gap-2 mb-3 md:mb-4 ${brandPulse ? 'animate-pulse' : ''}`}>
                      <span className="typewriter-text">{displayText}</span>
                      <span className="w-2 h-2 bg-black rounded-full typing-cursor animate-pulse" />
                    </div>
                    
                    {/* Título principal mejorado para móvil */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight mb-4 md:mb-6">
                      ¡Llena tus datos y obtén s/.10 de descuento en tu revisión técnica!
                    </h2>
                    
                    <div className="text-gray-700 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 space-y-4">
                      <div className="flex items-start gap-2">
                        <span className="leading-snug font-medium">Además, tienes descuentos en:</span>
                      </div>

                      <div className="flex items-start gap-3">
                        <MdCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                        <span className="text-base sm:text-lg leading-snug">
                          Curso de actualización de normativa de transporte y tránsito
                          <span className="block sm:inline"> (mercancías o personas)</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <MdCheckCircle className="text-green-500 -mt-0 sm:mt-1 flex-shrink-0" size={24} />
                        <span className="text-base sm:text-lg leading-snug">
                          Examen médico para brevetes
                        </span>
                      </div>
                    </div>
                    
                    {/* Sección de íconos de contacto simplificados */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-4 mb-0 md:mb-6 w-full">
                      {contacts.map((contact, index) => (
                        <a 
                          key={index}
                          href={contact.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/80 hover:bg-white transition-all duration-300 border border-gray-200 hover:border-[#ec8035]/50 hover:shadow-md group h-full"
                          aria-label={contact.title}
                        >
                          <div className="p-2 rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300">
                            {React.cloneElement(contact.icon, {
                              size: 24,
                              className: `${contact.icon.props.className} transition-colors duration-300`
                            })}
                          </div>
                          <span className="text-xs font-medium text-gray-700 text-center">
                            {contact.title}
                          </span>
                        </a>
                      ))}
                    </div>
                    
                    <div className="hidden lg:block h-40 w-40 bg-black opacity-5 rotate-12 absolute -right-8 bottom-6" />
                  </div>

                  <div 
                    id="contact-form"
                    className={`relative bg-white/95 p-5 md:p-8 lg:p-10 w-full transition-all duration-700 ease-out transform ${
                      formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 w-full">
                      <div className="grid grid-cols-1 gap-4 md:gap-5 w-full">
                        <div className="relative w-full">
                          <input
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                            placeholder="Nombres *"
                            className={`w-full border ${formErrors.nombres ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-sm md:text-base rounded-md px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`} 
                          />
                          {formErrors.nombres && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.nombres}</p>
                          )}
                          {isFilled(formData.nombres) && !formErrors.nombres && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={16} /> 
                          )}
                        </div>
                        
                        <div className="relative w-full">
                          <input
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                            placeholder="Apellidos *"
                            className={`w-full border ${formErrors.apellidos ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-sm md:text-base rounded-md px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`} 
                          />
                          {formErrors.apellidos && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.apellidos}</p>
                          )}
                          {isFilled(formData.apellidos) && !formErrors.apellidos && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={16} /> 
                          )}
                        </div>

                        {/* Fila: Tipo Documento + Número Documento + Celular - MEJORADO PARA MÓVIL */}
                        <div className="grid grid-cols-12 gap-2 w-full">
                          {/* Selector de tipo de documento */}
                          <div className="col-span-3 md:col-span-2 relative w-full">
                            <select
                              name="documentType"
                              value={formData.documentType}
                              onChange={handleChange}
                              className="w-full border border-gray-300 bg-white text-gray-800 text-xs md:text-sm rounded-md px-2 md:px-5 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] focus:border-[#ec8035] transition-colors appearance-none cursor-pointer h-[52px] md:h-[60px]" 
                            >
                              <option value="dni">DNI</option>
                              <option value="carnet">CE</option>
                            </select>
                            {/* Flecha personalizada */}
                            <div className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                              <ChevronDown size={14} className="text-gray-500" /> 
                            </div>
                          </div>
                          
                          {/* Número de documento */}
                          <div className="col-span-5 md:col-span-6 relative w-full">
                            <input
                              type="text"
                              name="documento"
                              value={formData.documento}
                              onChange={handleChange}
                              required
                              placeholder={formData.documentType === 'dni' ? 'DNI *' : 'Carnet *'}
                              className={`w-full border ${formErrors.documento ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-sm md:text-base rounded-md px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors h-[52px] md:h-[60px]`} 
                            />
                            {formErrors.documento && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.documento}</p>
                            )}
                            {isFilled(formData.documento) && !formErrors.documento && (
                              <Check className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={16} /> 
                            )}
                          </div>

                          {/* Celular */}
                          <div className="col-span-4 relative w-full">
                            <input
                              type="tel"
                              name="celular"
                              value={formData.celular}
                              onChange={handleChange}
                              required
                              placeholder="Celular *"
                              className={`w-full border ${formErrors.celular ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-sm md:text-base rounded-md px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors h-[52px] md:h-[60px]`} 
                            />
                            {formErrors.celular && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.celular}</p>
                            )}
                            {isFilled(formData.celular) && !formErrors.celular && (
                              <Check className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={16} /> 
                            )}
                          </div>
                        </div>

                        {/* Fila: Placa */}
                        <div className="w-full">
                          <div className="relative w-full">
                            <input
                              type="text"
                              name="placa"
                              value={formData.placa}
                              onChange={handleChange}
                              required
                              placeholder="Placa (6 caracteres) *"
                              className={`w-full border ${formErrors.placa ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-sm md:text-base rounded-md px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`} 
                            />
                            {formErrors.placa && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.placa}</p>
                            )}
                            {isFilled(formData.placa) && !formErrors.placa && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={16} />
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 md:space-y-5 w-full">
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              name="fromEmpresa"
                              checked={formData.fromEmpresa}
                              onChange={handleChange}
                              className="accent-[#ec8035]"
                            />
                            <span>¿Vienes de alguna empresa?</span>
                          </label>
                          {formData.fromEmpresa && (
                            <input
                              type="text"
                              name="empresa"
                              value={formData.empresa}
                              onChange={handleChange}
                              placeholder="Nombre de la empresa (opcional)"
                              className="w-full border border-gray-300 bg-white text-gray-800 text-sm rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors"
                            />
                          )}
                        </div>

                        <div className="flex justify-center pt-2 w-full">
                          <BrandButton
                            type="submit"
                            disabled={isSubmitting}
                            label={isSubmitting ? 'Procesando...' : 'Enviar'}
                          />
                        </div>
                        
                        <p className="text-[11px] text-gray-500 leading-relaxed text-center w-full">
                          Al registrarte, aceptas nuestros términos y condiciones y la política de privacidad.
                        </p>
                      </div>
                    </form>
                    
                    {/* Indicador de scroll */}
                    <div className="flex justify-center pt-4 pb-2">
                      <div className="flex flex-col items-center animate-bounce">
                        <span className="text-xs text-gray-500 mb-1">Desliza para ver más</span>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="servicios" className="animate-fade-in w-full">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="w-full bg-[#ec8035] text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg hover:bg-[#d4692a] transition-all duration-300 shadow-lg flex items-center justify-between group" 
                >
                  <span className="text-sm md:text-lg">Conoce nuestros otros servicios</span> 
                  <ChevronDown
                    size={20} 
                    className={`transform transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {servicesOpen && (
                  <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 animate-slide-up w-full">
                    {services.map((service, idx) => {
                      const IconComponent = service.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full" 
                        >
                          <div className="flex gap-3 md:gap-4 items-start w-full">
                            <div className="bg-[#ec8035]/10 rounded-lg p-2 md:p-3 flex-shrink-0">
                              <IconComponent className="text-[#ec8035]" size={24} /> 
                            </div>
                            <div className="flex-1 min-w-0 w-full">
                              <h4 className="font-bold text-gray-900 text-base md:text-lg mb-1 md:mb-2">{service.title}</h4> 
                              <p className="text-gray-600 text-xs md:text-base mb-2 md:mb-3">{service.description}</p> 
                              <div className="flex flex-wrap gap-1 md:gap-2 w-full">
                                {service.features.map((feature, featureIdx) => (
                                  <span
                                    key={featureIdx}
                                    className="text-xs bg-[#ec8035]/10 text-[#ec8035] px-2 md:px-3 py-1 rounded-full font-medium" 
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sección de la planta con imágenes cambiantes */}
              <section className="mt-8 md:mt-12 w-full">
                <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4 text-center md:text-left">NUESTRA PLANTA</h3>
                
                <div className="relative w-full h-64 md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                  {/* Imágenes con transición suave */}
                  {plantImages.map((img, index) => (
                    <div 
                      key={index}
                      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                        index === plantIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                    {/* Botón de navegación - Móvil */}
                    <button 
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plant.address)}`;
                        window.open(mapsUrl, '_blank');
                      }}
                      className="absolute top-3 right-3 md:hidden flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                      aria-label="Ver en mapa"
                    >
                      <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                      </svg>
                    </button>

                    {/* Contenido */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                        {/* Información de la planta */}
                        <div className="flex-1">
                          <h4 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 drop-shadow-md">{plant.name}</h4>
                          <div className="bg-black/40 backdrop-blur-md inline-block px-3 py-2 md:px-4 md:py-3 rounded-lg max-w-md">
                            <p className="text-xs md:text-sm mb-1">
                              <span className="font-medium">Teléfono:</span> {plant.phone}
                            </p>
                            <p className="text-xs md:text-sm">
                              <span className="font-medium">Dirección:</span> {plant.address}
                            </p>
                          </div>
                        </div>
                        
                        {/* Botón de navegación - Desktop */}
                        <button 
                          onClick={() => {
                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plant.address)}`;
                            window.open(mapsUrl, '_blank');
                          }}
                          className="hidden md:flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2.5 text-sm rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          <span className="font-medium">
                            Ver en mapa
                          </span>
                          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;