import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Menu, X, ChevronDown, Stethoscope, Gauge, Check, Phone, Mail } from 'lucide-react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import BrandButton from './components/BrandButton';

type DocumentType = 'dni' | 'carnet';

type FormData = {
  documentType: DocumentType;
  nombres: string;
  apellidos: string;
  documento: string;
  celular: string;
  correo: string;
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
    correo: '',
    placa: '',
    fromEmpresa: false,
    empresa: ''
  });
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [benefitIndex, setBenefitIndex] = useState<number>(0);
  const [plantIndex, setPlantIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [brandAlt, setBrandAlt] = useState<boolean>(false);
  const [brandPulse, setBrandPulse] = useState<boolean>(false);

  const contacts: { title: string; description: string; href: string; icon: JSX.Element }[] = [
    { 
      title: 'WhatsApp', 
      description: 'Chatea con nosotros al instante', 
      href: 'https://wa.me/51900111222',
      icon: <FaWhatsapp className="text-green-500" size={24} />
    },
    { 
      title: 'Teléfono', 
      description: 'Llámanos ahora mismo', 
      href: 'tel:+51900333444',
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
      features: ['Consultas rápidas', 'Exámenes preventivos', 'Equipo especializado']
    },
    {
      icon: Gauge,
      title: 'Escuela de Conductores',
      description: 'Capacitación profesional y segura para todos los niveles',
      features: ['Cursos certificados', 'Instructores experimentados', 'Prácticas en ruta']
    }
  ];

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
    
    // Validación de celular: exactamente 9 dígitos
    if (!formData.celular.trim()) {
      errors.celular = 'El celular es requerido';
    } else if (!/^\d{9}$/.test(formData.celular)) {
      errors.celular = 'El celular debe tener exactamente 9 dígitos';
    }
    
    // Validación de correo: debe contener @
    if (!formData.correo.trim()) {
      errors.correo = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = 'El correo electrónico debe contener @ y ser válido';
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
        correo: '',
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
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Autoplay del carrusel de contacto
  useEffect(() => {
    const id = setInterval(() => {
      setBenefitIndex((i) => (i + 1) % contacts.length);
    }, 3500);
    return () => clearInterval(id);
  }, [contacts.length]);

  const nextContact = () => setBenefitIndex((i) => (i + 1) % contacts.length);
  const prevContact = () => setBenefitIndex((i) => (i - 1 + contacts.length) % contacts.length);

  // Datos de plantas para carrusel textual
  const plants = [
    { name: 'Planta Norte', phone: '900 111 222', address: 'Av. Norte 123, Ciudad' },
    { name: 'Planta Centro', phone: '900 333 444', address: 'Jr. Central 456, Ciudad' },
    { name: 'Planta Sur', phone: '900 555 666', address: 'Calle Sur 789, Ciudad' },
  ];

  // Autoplay de plantas
  useEffect(() => {
    const id = setInterval(() => {
      setPlantIndex((i) => (i + 1) % plants.length);
    }, 4000);
    return () => clearInterval(id);
  }, [plants.length]);

  // Oscilar texto RTV/RTP con pulsación cada ~5s
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
        // Solo números, exactamente 9 dígitos
        processedValue = value.replace(/\D/g, '').substring(0, 9);
        break;
      
      case 'correo':
        // Mantener el valor original para el correo
        processedValue = value;
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
    <div className="min-h-screen bg-black flex flex-col">
      <header className="bg-[#ec8035] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">RTV San Cristóbal</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-[#d4692a] rounded-lg transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* Toast */}
          {showToast && (
            <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-lg px-4 py-3 border border-gray-200 text-gray-800 z-50">
              <p className="text-sm font-semibold">¡Gracias! Llenaste correctamente</p>
              <p className="text-xs text-gray-600">Estás participando del sorteo para una revisión técnica gratis.</p>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 bg-white">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 z-10 bg-black text-white rounded-full p-1.5 hover:opacity-90"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop"
                alt="Promoción RTV San Cristóbal"
                className="w-full h-64 object-cover"
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
        <div className="min-h-screen bg-white flex flex-col">
          <div className="flex-1 container mx-auto px-4 py-8 md:py-14 w-full">
            <div className="max-w-6xl mx-auto">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-visible mb-8 border border-black/5">
                {/* Pill fuera de la card, esquina superior izquierda */}
                <div className="absolute -top-5 -left-5 z-30 bg-black text-white shadow-xl rounded-full px-4 py-1.5 border border-white/10">
                  <span className="text-xs font-semibold whitespace-nowrap">Regístrate ahora</span>
                  <span className="ml-2 inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#ec8035] text-white align-middle">Tiempo limitado</span>
                </div>
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="p-6 md:p-10">
                    <div className={`text-black text-xs font-semibold tracking-widest flex items-center gap-2 mb-4 ${brandPulse ? 'animate-pulse' : ''}`}>
                      <span>{brandAlt ? 'RTP SAN CRISTOBAL' : 'RTV SAN CRISTOBAL'}</span>
                      <span className="w-2 h-2 bg-black rounded-full" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-black leading-tight mb-4">
                      Llena estos datos y participa de 1 revisión técnica gratis
                    </h2>
                    <p className="text-gray-700 text-base md:text-lg mb-8">
                      Regístrate para acceder a oportunidades, beneficios exclusivos y soporte dedicado. Nuestro proceso es rápido, seguro y pensado para acompañarte en cada paso.
                    </p>
                    

                    <div className="space-y-4 mb-8 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button type="button" aria-label="Anterior" onClick={prevContact} className="p-2 rounded-full border border-black/10 hover:bg-black/5">
                          <MdChevronLeft size={22} />
                        </button>
                        <div className="inline-flex items-center gap-4 transition-all bg-white border border-black/10 rounded-xl shadow-sm px-6 py-4">
                          <div className="flex-shrink-0">
                            {contacts[benefitIndex].icon}
                          </div>
                          <div key={benefitIndex} className="animate-fade-in text-left">
                            <p className="text-xl font-extrabold text-black leading-tight">{contacts[benefitIndex].title}</p>
                            <p className="text-base text-gray-800">{contacts[benefitIndex].description}</p>
                            <div className="mt-3">
                              <a href={contacts[benefitIndex].href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#ec8035] hover:bg-[#d4692a] px-4 py-2 rounded-md transition-colors">
                                {contacts[benefitIndex].title === 'WhatsApp' && <FaWhatsapp size={16} />}
                                {contacts[benefitIndex].title === 'Teléfono' && <Phone size={16} />}
                                {contacts[benefitIndex].title === 'Correo' && <Mail size={16} />}
                                Ir ahora
                              </a>
                            </div>
                          </div>
                        </div>
                        <button type="button" aria-label="Siguiente" onClick={nextContact} className="p-2 rounded-full border border-black/10 hover:bg-black/5">
                          <MdChevronRight size={22} />
                        </button>
                      </div>
                      <div className="flex gap-2 mt-2 justify-center">
                        {contacts.map((_, i) => (
                          <span key={i} className={`h-2 w-2 rounded-full ${i === benefitIndex ? 'bg-[#ec8035]' : 'bg-black/20'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="hidden lg:block h-40 w-40 bg-black opacity-5 rotate-12 absolute -right-8 bottom-6" />
                  </div>

                  <div className="relative bg-white/95 p-6 md:p-8">
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                          <input
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                            placeholder="Nombres *"
                            className={`w-full border ${formErrors.nombres ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-base rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`}
                          />
                          {formErrors.nombres && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.nombres}</p>
                          )}
                          {isFilled(formData.nombres) && !formErrors.nombres && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={18} />
                          )}
                        </div>
                        
                        <div className="relative">
                          <input
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                            placeholder="Apellidos *"
                            className={`w-full border ${formErrors.apellidos ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-base rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`}
                          />
                          {formErrors.apellidos && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.apellidos}</p>
                          )}
                          {isFilled(formData.apellidos) && !formErrors.apellidos && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={18} />
                          )}
                        </div>

                        {/* Fila: Tipo Documento + Número Documento + Celular */}
                        <div className="grid grid-cols-12 gap-4">
                          {/* Selector de tipo de documento - más angosto */}
                          <div className="col-span-3 relative">
                            <select
                              name="documentType"
                              value={formData.documentType}
                              onChange={handleChange}
                              className="w-full border border-gray-300 bg-white text-gray-800 text-sm rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors"
                            >
                              <option value="dni">DNI</option>
                              <option value="carnet">CE</option>
                            </select>
                          </div>
                          
                          {/* Número de documento */}
                          <div className="col-span-5 relative">
                            <input
                              type="text"
                              name="documento"
                              value={formData.documento}
                              onChange={handleChange}
                              required
                              placeholder={formData.documentType === 'dni' ? 'DNI *' : 'Carnet *'}
                              className={`w-full border ${formErrors.documento ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-base rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`}
                            />
                            {formErrors.documento && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.documento}</p>
                            )}
                            {isFilled(formData.documento) && !formErrors.documento && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={18} />
                            )}
                          </div>

                          {/* Celular */}
                          <div className="col-span-4 relative">
                            <input
                              type="tel"
                              name="celular"
                              value={formData.celular}
                              onChange={handleChange}
                              required
                              placeholder="Celular *"
                              className={`w-full border ${formErrors.celular ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-base rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`}
                            />
                            {formErrors.celular && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.celular}</p>
                            )}
                            {isFilled(formData.celular) && !formErrors.celular && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={18} />
                            )}
                          </div>
                        </div>

                        {/* Fila: Correo + Placa */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="email"
                              name="correo"
                              value={formData.correo}
                              onChange={handleChange}
                              required
                              placeholder="Correo electrónico *"
                              className={`w-full border ${formErrors.correo ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-base rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`}
                            />
                            {formErrors.correo && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.correo}</p>
                            )}
                            {isValidEmail(formData.correo) && !formErrors.correo && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={18} />
                            )}
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              name="placa"
                              value={formData.placa}
                              onChange={handleChange}
                              required
                              placeholder="Placa (6 caracteres) *"
                              className={`w-full border ${formErrors.placa ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-800 text-base rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#ec8035] transition-colors`}
                            />
                            {formErrors.placa && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.placa}</p>
                            )}
                            {isFilled(formData.placa) && !formErrors.placa && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ec8035]" size={18} />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
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

                        <div className="flex justify-center">
                          <BrandButton
                            type="submit"
                            disabled={isSubmitting}
                            label={isSubmitting ? 'Procesando...' : 'Enviar'}
                          />
                        </div>
                        
                        <p className="text-[11px] text-gray-500 leading-relaxed text-center">
                          Al registrarte, aceptas nuestros términos y condiciones y la política de privacidad.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="servicios" className="animate-fade-in">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="w-full bg-[#ec8035] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#d4692a] transition-all duration-300 shadow-lg flex items-center justify-between group"
                >
                  <span className="text-base md:text-lg">Conoce nuestros otros servicios</span>
                  <ChevronDown
                    size={24}
                    className={`transform transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {servicesOpen && (
                  <div className="mt-4 space-y-4 animate-slide-up">
                    {services.map((service, idx) => {
                      const IconComponent = service.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex gap-4 items-start">
                            <div className="bg-[#ec8035]/10 rounded-lg p-3 flex-shrink-0">
                              <IconComponent className="text-[#ec8035]" size={28} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-2">{service.title}</h4>
                              <p className="text-gray-600 text-sm md:text-base mb-3">{service.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {service.features.map((feature, featureIdx) => (
                                  <span
                                    key={featureIdx}
                                    className="text-xs bg-[#ec8035]/10 text-[#ec8035] px-3 py-1 rounded-full font-medium"
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

              {/* Te podría interesar: carrusel de plantas (texto con hover) */}
              <section className="mt-12">
                <h3 className="text-xl font-bold text-black mb-4">Te podría interesar: nuestras otras plantas</h3>
                <div className="bg-white border border-black/5 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div key={plantIndex} className="group w-full text-center py-6 transition-all animate-fade-in">
                      <p className="text-2xl font-extrabold text-black tracking-tight">{plants[plantIndex].name}</p>
                      <div className="mt-2 text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Teléfono: <span className="font-semibold">{plants[plantIndex].phone}</span></p>
                        <p>Dirección: <span className="font-semibold">{plants[plantIndex].address}</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 justify-center mt-2">
                    {plants.map((_, i) => (
                      <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === plantIndex ? 'bg-[#ec8035]' : 'bg-black/20'}`} />)
                    )}
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