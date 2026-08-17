import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import './DashboardCarousel.css';

const DashboardCarousel: React.FC = () => {
    const slides = [
        { id: 1, title: 'Bienvenido', subtitle: 'Gestión de Rentas', content: 'Administra tus propiedades fácilmente.', color: 'primary' },
        { id: 2, title: 'Pagos al Día', subtitle: 'Resumen Financiero', content: 'Revisa quién ha pagado este mes.', color: 'success' },
        { id: 3, title: 'Mantenimiento', subtitle: 'Alertas', content: 'No olvides registrar los gastos de mantenimiento.', color: 'warning' }
    ];

    return (
        <div className="dashboard-carousel-container">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1.1}
                centeredSlides={true}
                loop={true}
            >
                {slides.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <IonCard color={slide.color} className="carousel-card">
                            <IonCardHeader>
                                <IonCardSubtitle>{slide.subtitle}</IonCardSubtitle>
                                <IonCardTitle>{slide.title}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {slide.content}
                            </IonCardContent>
                        </IonCard>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default DashboardCarousel;
