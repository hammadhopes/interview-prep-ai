import { useEffect, useState } from "react";
import "../style/generating.scss";


const STEPS = [
    "Reading your resume and profile",
    "Analyzing the job description",
    "Finding your skill gaps",
    "Writing your interview questions",
    "Building your preparation plan"
];

const STEP_DURATION = 1000;

const GeneratingProgress = ({ startedAt }) => {
    const [ now, setNow ] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 250);

        return () => clearInterval(timer);
    }, []);

    const activeStep = Math.min(
        Math.floor((now - startedAt) / STEP_DURATION),
        STEPS.length - 1
    );

    return (
        <div className="generating"> 
            <div className="generating__spinner"></div>
            <h1 className="generating__title">Building your interview plan</h1>
            <p className="generating__subtitle">
                This usually takes about 10 seconds. You can visit other pages while you wait.
            </p>

            <ul className="generating__steps">
                {STEPS.map((label, index) => (
                    <li
                        key={label}
                        className={`generating__step ${index < activeStep ? "generating__step--done" : ""} ${index === activeStep ? "generating__step--active" : ""}`}
                    >
                        <span className="generating__marker">
                            {index < activeStep ? <i className="fa-solid fa-check"></i> : index + 1}
                        </span>
                        
                        {label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GeneratingProgress;
