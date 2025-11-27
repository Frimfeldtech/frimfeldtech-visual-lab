import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Wrench, 
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Recycle,
  Thermometer,
  VolumeX,
  Lock,
  Flame,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  Award,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

const Header = ({ onContactClick, onQuoteClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-12 w-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#3B82F6" />
            <rect x="20" y="20" width="60" height="60" rx="4" fill="white" />
            <path d="M35 35 L65 35 L65 65 L35 65 Z" stroke="#3B82F6" strokeWidth="3" fill="none" />
            <line x1="50" y1="35" x2="50" y2="65" stroke="#3B82F6" strokeWidth="2" />
          </svg>
          <span className="text-2xl font-bold text-primary">Power Window</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="#inicio" className="hover:text-primary transition-colors">Inicio</a>
          <a href="#seguridad" className="hover:text-primary transition-colors">Seguridad</a>
          <a href="#proceso" className="hover:text-primary transition-colors">Proceso</a>
          <a href="#proyectos" className="hover:text-primary transition-colors">Proyectos</a>
          <a href="#beneficios" className="hover:text-primary transition-colors">Beneficios</a>
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          <Button 
            onClick={onQuoteClick}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Solicitar Cotización
          </Button>
          <Button 
            onClick={onContactClick}
            className="bg-primary hover:bg-blue-600 text-white"
          >
            Contacto
          </Button>
        </div>

        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#inicio" className="text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
            <a href="#seguridad" className="text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Seguridad</a>
            <a href="#proceso" className="text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Proceso</a>
            <a href="#proyectos" className="text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Proyectos</a>
            <a href="#beneficios" className="text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Beneficios</a>
            <Button onClick={() => { onQuoteClick(); setMobileMenuOpen(false); }} variant="outline" className="w-full">
              Solicitar Cotización
            </Button>
            <Button onClick={() => { onContactClick(); setMobileMenuOpen(false); }} className="w-full bg-primary">
              Contacto
            </Button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

const HeroCarousel = ({ onQuoteClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/778378e6cf1db848318f078ffaacae11.jpg',
      title: 'Ventanas Herméticas de Alta Tecnología',
      subtitle: 'Máxima seguridad, aislación térmica y acústica para tu hogar'
    },
    {
      image: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/c048418391bfff495b759d3de760300d.jpg',
      title: 'Instalación Sin Obra',
      subtitle: 'Transformá tu espacio de manera limpia, rápida y profesional'
    },
    {
      image: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/8bda6d917431eff48ca3345c59181356.jpg',
      title: 'Perfiles PVC VEKA',
      subtitle: 'Calidad europea con garantía total y servicio integral'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-20 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onQuoteClick}
                size="lg"
                className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-lg"
              >
                Solicitar Cotización
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg"
                onClick={() => document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Proyectos
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

const ProjectsCarousel = () => {
  const projects = [
    { 
      before: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/b95370a3deefd833cadcae846ac1ffe2.jpg', 
      after: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/e1459d631cd1e2b1e907557652429237.jpg',
      title: 'Proyecto Residencial 1'
    },
    { 
      before: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/d32ef961b666d4d3023519e989a54f1f.jpg', 
      after: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/d7aaeb87ee5310a37bbc058494855d90.jpg',
      title: 'Proyecto Residencial 2'
    },
    { 
      before: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/c44833a35a2c829642bfaa78f7b270f8.jpg', 
      after: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/76214e8c498730a4649954103666b029.jpg',
      title: 'Proyecto Residencial 3'
    },
    { 
      before: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/218fea8b8a6e8b4b0a4dcbca9ca3d274.jpg', 
      after: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/4386b1f1acabb319867b3bd63d467713.jpg',
      title: 'Proyecto Residencial 4'
    },
    { 
      before: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/ed61a2e876c44342e1fc27302c741272.jpg', 
      after: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/77adf396161dc62033c6a2f82837eb6a.jpg',
      title: 'Proyecto Residencial 5'
    },
    { 
      before: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/a70742fd98baf38ccd1b5ebcedac5f27.jpg', 
      after: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/365ecd8a7db5b943813f292eaf2addeb.jpg',
      title: 'Proyecto Residencial 6'
    },
    { 
      before: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/e1e7f9111cf1b1d77f789c32ea20c2a3.jpg', 
      after: 'https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/396188651df9cd4bc4eea9530f3f1cd6.jpg',
      title: 'Proyecto Residencial 7'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  return (
    <section id="proyectos" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Proyectos Terminados</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">La transformación en imágenes. Mirá el antes y después de nuestros trabajos.</p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-6 md:gap-8"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-gray-300">
                <img src={projects[currentIndex].before} alt="Antes" className="w-full h-64 md:h-96 object-cover" />
                <div className="absolute top-4 left-4 bg-gray-900/80 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm">
                  ANTES
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-primary">
                <img src={projects[currentIndex].after} alt="Después" className="w-full h-64 md:h-96 object-cover" />
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
                  DESPUÉS
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={prevProject} 
            className="absolute top-1/2 -left-4 md:-left-16 transform -translate-y-1/2 bg-white hover:bg-primary text-primary hover:text-white p-3 md:p-4 rounded-full shadow-lg transition-all z-10 border-2 border-primary"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={nextProject} 
            className="absolute top-1/2 -right-4 md:-right-16 transform -translate-y-1/2 bg-white hover:bg-primary text-primary hover:text-white p-3 md:p-4 rounded-full shadow-lg transition-all z-10 border-2 border-primary"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                  currentIndex === index ? 'bg-primary w-6 md:w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoVentana: '',
    mensaje: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "¡Solicitud recibida! 🎉",
      description: "Nos contactaremos a la brevedad para coordinar tu visita técnica.",
      duration: 5000,
    });
    setFormData({ nombre: '', telefono: '', email: '', tipoVentana: '', mensaje: '' });
  };
  
  const contactRef = useRef(null);
  const quoteRef = useRef(null);

  const handleContactClick = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuoteClick = () => {
    quoteRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Power Window | Ventanas Herméticas de PVC - Seguridad y Confort</title>
        <meta name="description" content="Power Window: Especialistas en ventanas herméticas de PVC con perfiles VEKA. Máxima seguridad, aislación térmica y acústica. Instalación sin obra. Garantía total." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header onContactClick={handleContactClick} onQuoteClick={handleQuoteClick} />
        
        <HeroCarousel onQuoteClick={handleQuoteClick} />

        {/* Stats Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Clock className="w-12 h-12 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">15+</div>
                <div className="text-sm opacity-90">Años de Experiencia</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Users className="w-12 h-12 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">2000+</div>
                <div className="text-sm opacity-90">Clientes Satisfechos</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Award className="w-12 h-12 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm opacity-90">Garantía Total</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <ShieldCheck className="w-12 h-12 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">VEKA</div>
                <div className="text-sm opacity-90">Calidad Europea</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Seguridad */}
        <section id="seguridad" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">¿Es Segura una Abertura de PVC?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Sí, su alta tecnología supera a otros materiales sin perder estética.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Lock className="w-10 h-10" />, title: "Cierres Multipunto", desc: "Múltiples anclajes que hacen casi imposible forzar la abertura desde el exterior." },
                { icon: <ShieldCheck className="w-10 h-10" />, title: "Vidrios Laminados", desc: "Lámina de PVB que impide la rotura del vidrio ante golpes o intentos de intrusión." },
                { icon: <Wrench className="w-10 h-10" />, title: "Refuerzo de Acero", desc: "Estructura interna de Acero Galvanizado que proporciona una robustez superior." },
                { icon: <Flame className="w-10 h-10" />, title: "Resistentes al Fuego", desc: "Material difícilmente inflamable y autoextinguible. No propaga el fuego." },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl border-2 border-gray-200 text-center hover:border-primary hover:shadow-xl transition-all"
                >
                  <div className="text-primary mb-4 inline-block">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Proceso sin Obra */}
        <section id="proceso" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Cambia tus Ventanas <span className="text-primary">Sin Obra</span></h2>
                <p className="text-lg text-gray-600 mb-8">Transforma tu casa de manera limpia, rápida y sin roturas. Nuestro sistema de reemplazo es la solución definitiva.</p>
                <div className="space-y-6">
                  {[
                    {title: "Cotización Inicial", desc: "Envianos las medidas aproximadas para una cotización de referencia."},
                    {title: "Medición y Relevamiento", desc: "Visitamos tu domicilio para tomar medidas exactas y relevar los marcos."},
                    {title: "Fabricación a Medida", desc: "Producimos tus aberturas en nuestro taller con la más alta precisión."},
                    {title: "Instalación Profesional", desc: "Montamos el nuevo marco, sellamos con poliuretano y dejamos todo impecable."},
                  ].map((step, index) => (
                    <div className="flex items-start gap-4" key={index}>
                      <div className="bg-primary text-white rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center font-bold text-lg">{index + 1}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative h-[600px] rounded-xl overflow-hidden shadow-2xl"
              >
                <img src="https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/8bda6d917431eff48ca3345c59181356.jpg" alt="Instalación de ventana" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        <ProjectsCarousel />

        {/* Beneficios */}
        <section id="beneficios" className="py-24 bg-white">
           <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">¿Qué tener en cuenta al elegir?</h2>
              <p className="text-lg text-gray-600">Una decisión clave para el confort y la eficiencia de tu hogar.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl"
              >
                 <img src="https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/c048418391bfff495b759d3de760300d.jpg" alt="Interior confortable con ventana de PVC" className="w-full h-full object-cover"/>
              </motion.div>
              <motion.div
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.7 }}
              >
                <div className="space-y-8">
                    <div className="flex items-start gap-6">
                        <div className="bg-blue-50 p-4 rounded-full"><Thermometer className="w-8 h-8 text-primary"/></div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Aislación Térmica Superior</h3>
                            <p className="text-gray-600 mt-2">Las aberturas de PVC con DVH funcionan como una barrera que mantiene la temperatura ideal y genera un importante ahorro en servicios.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="bg-blue-50 p-4 rounded-full"><VolumeX className="w-8 h-8 text-primary"/></div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">El Silencio También es Confort</h3>
                            <p className="text-gray-600 mt-2">El ruido es invasivo. Nuestras aberturas con Doble Vidrio ayudan a disminuir drásticamente los sonidos molestos del exterior.</p>
                        </div>
                    </div>
                </div>
              </motion.div>
            </div>
           </div>
        </section>

        {/* Garantia */}
        <section id="garantia" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Garantía Total: <span className="text-primary">Cero Problemas</span></h2>
                        <p className="text-lg text-gray-600 mb-8">Comprar a empresas que tercerizan la instalación puede traer dolores de cabeza. Con nosotros, contás con un servicio integral y una garantía real.</p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0"/> Asesoramiento personalizado desde el inicio.</li>
                            <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0"/> Fabricación en nuestro propio taller con máquinas europeas.</li>
                            <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0"/> Instalación por personal propio, no terceros.</li>
                            <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0"/> Tranquilidad de no lidiar con demoras o malas instalaciones.</li>
                            <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0"/> Garantía de producto + garantía de excelente instalación.</li>
                        </ul>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7 }}
                      className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl"
                    >
                        <img src="https://horizons-cdn.hostinger.com/2c232068-1323-42d2-95d0-038a883f6f8c/5910b073827677271fedfdf19d852041.jpg" alt="Trabajador instalando ventana con garantía" className="w-full h-full object-cover" />
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Sostenibilidad */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">PVC VEKA: Sostenible y Ecológico</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Un material con bajo impacto medioambiental y una dilatada vida útil.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                  {icon: <Leaf className="w-10 h-10" />, title: "Sal Común como Base", desc: "Compuesto en un 57% de sal común, un recurso abundante y natural."},
                  {icon: <Recycle className="w-10 h-10" />, title: "100% Reciclable", desc: "Al final de su vida útil, el material puede ser completamente reciclado."},
                  {icon: <ShieldCheck className="w-10 h-10" />, title: "Inerte y Saludable", desc: "No emite compuestos orgánicos volátiles y es insensible a hongos y contaminación."}
              ].map((item, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="bg-white p-8 rounded-xl border-2 border-gray-200 text-center hover:border-primary hover:shadow-xl transition-all"
                >
                    <div className="text-green-500 mb-4 inline-block">{item.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para transformar tu hogar?</h2>
            <p className="text-xl mb-8 opacity-90">Solicitá tu visita técnica sin cargo y recibí un presupuesto personalizado</p>
            <Button 
              onClick={handleQuoteClick}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 px-10 py-6 text-lg"
            >
              Pedir Visita Técnica Gratis
            </Button>
          </div>
        </section>
        
        {/* Contacto */}
        <section ref={contactRef} className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contactanos</h2>
              <p className="text-lg text-gray-600">Estamos para asesorarte en todo momento.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Dirección</p>
                        <p className="text-gray-600">Diagonal Pavón 4352, Florida Oeste</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Teléfono</p>
                        <a href="tel:47743333" className="text-primary hover:underline">4774-3333</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Departamento Comercial</p>
                        <p className="text-gray-600">Gustavo: <a href="tel:1165081522" className="text-primary hover:underline">11-6508-1522</a></p>
                        <p className="text-gray-600">Diego: <a href="tel:1130537521" className="text-primary hover:underline">11-3053-7521</a></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <a href="mailto:info@mailcorp.com" className="text-primary hover:underline block">info@mailcorp.com</a>
                        <a href="mailto:marcelo@mailcorp.com" className="text-primary hover:underline block">marcelo@mailcorp.com</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-80">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.0234567890123!2d-58.5!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzAwLjAiUyA1OMKwMzAnMDAuMCJX!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Ubicación Power Window"
                  ></iframe>
                </div>
              </div>

              <div ref={quoteRef} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Solicitar Cotización</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                    <input
                      type="text" 
                      required 
                      value={formData.nombre} 
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                    <input
                      type="tel" 
                      required 
                      value={formData.telefono} 
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="11-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de abertura *</label>
                    <select
                      required 
                      value={formData.tipoVentana} 
                      onChange={(e) => setFormData({...formData, tipoVentana: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="corrediza">Corrediza</option>
                      <option value="de-abrir">De Abrir / Oscilobatiente</option>
                      <option value="paño-fijo">Paño Fijo</option>
                      <option value="puerta">Puerta</option>
                      <option value="no-se">No estoy seguro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                    <textarea
                      value={formData.mensaje} 
                      onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Contanos sobre tu proyecto..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-primary hover:bg-blue-600 text-white py-6 text-lg"
                  >
                    Enviar Solicitud
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="h-10 w-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="80" rx="8" fill="#3B82F6" />
                    <rect x="20" y="20" width="60" height="60" rx="4" fill="white" />
                    <path d="M35 35 L65 35 L65 65 L35 65 Z" stroke="#3B82F6" strokeWidth="3" fill="none" />
                    <line x1="50" y1="35" x2="50" y2="65" stroke="#3B82F6" strokeWidth="2" />
                  </svg>
                  <span className="text-xl font-bold text-white">Power Window</span>
                </div>
                <p className="text-sm">Especialistas en ventanas herméticas de PVC con perfiles VEKA. Calidad europea, servicio local.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#inicio" className="hover:text-primary transition-colors">Inicio</a></li>
                  <li><a href="#seguridad" className="hover:text-primary transition-colors">Seguridad</a></li>
                  <li><a href="#proceso" className="hover:text-primary transition-colors">Proceso</a></li>
                  <li><a href="#proyectos" className="hover:text-primary transition-colors">Proyectos</a></li>
                  <li><a href="#beneficios" className="hover:text-primary transition-colors">Beneficios</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Contacto</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:47743333" className="hover:text-primary transition-colors">4774-3333</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:info@mailcorp.com" className="hover:text-primary transition-colors">info@mailcorp.com</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>Diagonal Pavón 4352, Florida Oeste</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>© 2025 Power Window. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;