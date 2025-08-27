import React, {useState} from "react";
import styles from "./Dates.module.scss";
import { TimePoint } from "./types";
import { timePoints } from "./data";

const Dates: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <section className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.headingDecoration}></div>
                <div className={styles.horizontalDivider}></div>
                <div className={styles.verticalDivider}></div>
                <h2 className={styles.heading}>Исторические даты</h2>
                <div className={styles.circle}></div>
                <div className={styles.years}>
                    <span className={styles.startYear}>2015</span>
                    &nbsp;&nbsp;
                    <span className={styles.endYear}>2022</span>
                </div>
            </div>
        </section>
    );
};

export default Dates;
