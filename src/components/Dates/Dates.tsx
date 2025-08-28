import React, { useState, useRef, useEffect } from "react";
import styles from "./Dates.module.scss";
import { TimePoint } from "./types";
import { timePoints } from "./data";
import gsap from "gsap";

const TARGET_ANGLE = -60;
const POINT_ANGLE_STEP = 60;
const CIRCLE_DIAMETER = 530;

const Dates: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const circleRef = useRef<HTMLDivElement>(null);
    const pointRefs = useRef<HTMLDivElement[]>([]);

    // Initial rotation of the circle
    const rotationRef = useRef(0);

    useEffect(() => {
        gsap.to(circleRef.current, { rotation: TARGET_ANGLE, duration: 0 });
        rotationRef.current = TARGET_ANGLE;
    }, []);

    const rotateCircle = (index: number) => {
        if (!circleRef.current) return;

        const currentPointAngle = index * POINT_ANGLE_STEP;
        const targetRotation = TARGET_ANGLE - currentPointAngle;

        // Calculate the shortest path using wrap()
        const delta = gsap.utils.wrap(
            -180,
            180,
            targetRotation - rotationRef.current
        );

        // Animate the rotation relatively
        gsap.to(circleRef.current, {
            rotation: `+=${delta}`,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
                rotationRef.current = gsap.getProperty(
                    circleRef.current,
                    "rotation"
                ) as number;
            },

            onComplete: () => {
                gsap.to(pointRefs.current, { scale: 1, duration: 0.3 });
                gsap.to(pointRefs.current[index], {
                    scale: 1.2,
                    duration: 0.3,
                });
            },
        });
    };

    const handlePointClick = (index: number) => {
        setActiveIndex(index);
        rotateCircle(index);
    };

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
                    &nbsp;&nbsp;
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
                                }deg) translate(${
                                    CIRCLE_DIAMETER / 2
                                }px) rotate(${-rotationRef.current}deg)`,
                            }}
                            onClick={() => handlePointClick(index)}
                            aria-label={`Выбрать ${point.subject} (${point.startYear}–${point.endYear})`}
                        >
                            {point.subject}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Dates;
