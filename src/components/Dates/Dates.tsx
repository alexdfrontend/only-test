// src/components/Dates/Dates.tsx
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./Dates.module.scss";
import { TimePoint } from "./types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"; // if you need navigation buttons
import "swiper/css/pagination"; // if you need pagination dots
import type { Swiper as SwiperCore } from "swiper";

interface Props {
    timePoints: TimePoint[];
}

const Dates: React.FC<Props> = ({ timePoints }) => {
    const TARGET_ANGLE = -60;
    const POINT_ANGLE_STEP = 360 / timePoints.length; // 60° для 6 точек
    const CIRCLE_DIAMETER = 530;

    const [activeIndex, setActiveIndex] = useState(0);
    const circleRef = useRef<HTMLDivElement>(null);
    const pointRefs = useRef<HTMLDivElement[]>([]);
    const textRefs = useRef<HTMLSpanElement[]>([]); // Для текста в точках
    const rotationRef = useRef(TARGET_ANGLE);

    useEffect(() => {
        // Начальная установка вертикального текста
        pointRefs.current.forEach((_, index) => {
            const pointAngle = index * POINT_ANGLE_STEP;
            gsap.set(textRefs.current[index], {
                rotate: -pointAngle - rotationRef.current,
            });
        });

        // Установить начальное вращение круга
        gsap.to(circleRef.current, { rotation: TARGET_ANGLE, duration: 0 });
    }, []);

    const rotateCircle = (index: number) => {
        if (!circleRef.current) return;

        const currentPointAngle = index * POINT_ANGLE_STEP;
        const targetRotation = TARGET_ANGLE - currentPointAngle;
        const delta = gsap.utils.wrap(
            -180,
            180,
            targetRotation - rotationRef.current
        );

        console.log(`Rotating to index ${index}, delta: ${delta}`); // Дебаг

        gsap.to(circleRef.current, {
            rotation: `+=${delta}`,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
                rotationRef.current = gsap.getProperty(
                    circleRef.current,
                    "rotation"
                ) as number;
                // Обновляем вращение текста для вертикальности
                pointRefs.current.forEach((_, i) => {
                    const pointAngle = i * POINT_ANGLE_STEP;
                    gsap.to(textRefs.current[i], {
                        rotate: -pointAngle - rotationRef.current,
                        duration: 0,
                    });
                });
            },
            onComplete: () => {
                gsap.to(pointRefs.current, { scale: 1, duration: 0.3 });
            },
        });
    };

    const handlePointClick = (index: number) => {
        setActiveIndex(index);
        rotateCircle(index);
    };

    if (!timePoints.length) {
        return <div>Нет доступных точек времени</div>;
    }

    return (
        <section className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.headingDecoration}></div>
                <div className={styles.horizontalDivider}></div>
                <div className={styles.verticalDivider}></div>
                <h2 className={styles.heading}>Исторические даты</h2>
                <div className={styles.years}>
                    <span className={styles.startYear}>
                        {timePoints[activeIndex].startYear}
                    </span>
                    <span>&nbsp;&nbsp;</span>
                    <span className={styles.endYear}>
                        {timePoints[activeIndex].endYear}
                    </span>
                </div>
                <div className={styles.circle} ref={circleRef}>
                    {timePoints.map((point: TimePoint, index: number) => (
                        <div
                            key={point.id}
                            ref={(el) => {
                                if (el) pointRefs.current[index] = el;
                            }}
                            className={`${styles.point} ${
                                activeIndex === index ? styles.active : ""
                            }`}
                            style={{
                                transform: `rotate(${
                                    index * POINT_ANGLE_STEP
                                }deg) translate(${CIRCLE_DIAMETER / 2}px)`,
                            }}
                            onClick={() => handlePointClick(index)}
                            aria-label={`Выбрать ${point.subject} (${point.startYear}–${point.endYear})`}
                        >
                            <div
                                ref={(el) => {
                                    if (el) textRefs.current[index] = el;
                                }}
                                className={styles.pointContent}
                            >
                                <div className={styles.pointContentText}>
                                    {point.id}
                                </div>
                                <div className={styles.pointTitle}>
                                    {point.subject}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.sliderContainer}>
                <Swiper
                    // Pass modules as a prop
                    modules={[Navigation, Pagination]}
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    onSwiper={(swiper: SwiperCore) => console.log(swiper)}
                >
                    {timePoints[activeIndex].events.map((event) => (
                        <SwiperSlide>
                            <h3>{event.year}</h3>
                            <p>{event.text}</p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Dates;
