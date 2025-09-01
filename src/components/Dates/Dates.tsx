// src/components/Dates/Dates.tsx
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./Dates.module.scss";
import { TimePoint } from "./types";
import ArrowButton from "../ui/ArrowButton/ArrowButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
    const textRefs = useRef<HTMLSpanElement[]>([]);
    const rotationRef = useRef(TARGET_ANGLE);
    const startYearRef = useRef<HTMLSpanElement>(null);
    const endYearRef = useRef<HTMLSpanElement>(null);
    // Объекты для анимации GSAP
    const startYearValue = useRef({ value: timePoints[0].startYear });
    const endYearValue = useRef({ value: timePoints[0].endYear });

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

        // Анимация годов
        gsap.to(startYearValue.current, {
            duration: 1,
            ease: "power2.inOut",
            value: timePoints[index].startYear,
            roundProps: "value",
            onUpdate: function () {
                if (startYearRef.current) {
                    startYearRef.current.textContent = Math.round(
                        startYearValue.current.value
                    ).toString();
                }
            },
        });

        gsap.to(endYearValue.current, {
            duration: 1,
            ease: "power2.inOut",
            value: timePoints[index].endYear,
            roundProps: "value",
            onUpdate: function () {
                if (endYearRef.current) {
                    endYearRef.current.textContent = Math.round(
                        endYearValue.current.value
                    ).toString();
                }
            },
        });

        // Анимация круга
        gsap.to(circleRef.current, {
            rotation: `+=${delta}`,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
                rotationRef.current = gsap.getProperty(
                    circleRef.current,
                    "rotation"
                ) as number;
                pointRefs.current.forEach((_, i) => {
                    const pointAngle = i * POINT_ANGLE_STEP;
                    gsap.to(textRefs.current[i], {
                        rotate: -pointAngle - rotationRef.current,
                        duration: 0,
                    });
                });
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
                    <span className={styles.startYear} ref={startYearRef}>
                        {timePoints[activeIndex].startYear}
                    </span>
                    <span>&nbsp;&nbsp;</span>
                    <span className={styles.endYear} ref={endYearRef}>
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
                        ><div className={styles.pointInner}>

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
                        </div>
                    ))}
                </div>
                <div className={styles.sliderContainer}>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={25}
                        slidesOffsetBefore={0}
                        slidesOffsetAfter={0}
                        slidesPerView={1.5}
                        navigation={{
                            nextEl: ".swiper-button-next-custom",
                            prevEl: ".swiper-button-prev-custom",
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 60,
                                slidesOffsetBefore: 60,
                                slidesOffsetAfter: 60,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 80,
                                slidesOffsetBefore: 60,
                                slidesOffsetAfter: 60,
                            },
                        }}
                    >
                        {timePoints[activeIndex].events.map((event) => (
                            <SwiperSlide key={event.id}>
                                <div className={styles.slideContent}>
                                    <h3>{event.year}</h3>
                                    <p>{event.text}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button className="swiper-button-prev-custom">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41,16.59L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.59Z" />
                        </svg>
                    </button>
                    <button className="swiper-button-next-custom">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.59Z" />
                        </svg>
                    </button>
                    <div className={styles.customPagination}></div>
                </div>
                <div className={styles.circleControls}>
                    <div className={styles.activePointIndicator}>
                        0{activeIndex + 1}/0{timePoints.length}
                    </div>
                    <div className={styles.buttons}>
                        <ArrowButton
                            direction="prev"
                            onClick={() => {
                                const newIndex =
                                    (activeIndex - 1 + timePoints.length) %
                                    timePoints.length;
                                setActiveIndex(newIndex);
                                rotateCircle(newIndex);
                            }}
                            disabled={activeIndex === 0}
                        />
                        <ArrowButton
                            direction="next"
                            onClick={() => {
                                const newIndex =
                                    (activeIndex + 1) % timePoints.length;
                                setActiveIndex(newIndex);
                                rotateCircle(newIndex);
                            }}
                            disabled={activeIndex === timePoints.length - 1}
                        />
                    </div>
                </div>
            </div>
            
        </section>
    );
};

export default Dates;
