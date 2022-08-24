import styles from "./QuizModal.module.scss";
import { createPortal } from "react-dom";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Questions } from "../../pages";

const QuizModal: FC<{ isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>>; data: Questions }> = ({ isOpen: isModalOpen, setIsOpen: setIsModalOpen, data }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const [isOpen, setIsOpen] = useState(isModalOpen);
    const [rejections, setRejections] = useState<{ [question: string]: { selected: number; isRejected: boolean } }>({});
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const callback = (e: KeyboardEvent) => {
            if (e.key === "Tab") e.preventDefault();
        };

        if (isModalOpen) {
            setRejections({});
            document.addEventListener("keydown", callback);
        }

        setIsBrowser(true);

        const timeout = setTimeout(
            () => {
                setIsOpen(isModalOpen);
                if (!isModalOpen) setIndex(0);
            },
            isModalOpen ? 0 : 500
        );

        return () => {
            document.removeEventListener("keydown", callback);
            clearTimeout(timeout);
        };
    }, [isModalOpen]);

    if (!isBrowser || !isOpen) return null;

    const handleOnClick = (question: string, option: { display: string; value: string; isRejection: boolean }, i: number) => {
        setRejections({ ...rejections, [question]: { selected: i, isRejected: option.isRejection } });
        setIndex(index + 1);
    };

    return createPortal(
        <div className={styles.QuizModal} style={{ animationName: styles[isModalOpen ? "open" : "close"] }}>
            <style jsx>{`
                .${styles.QuizModal} > div > div > div {
                    transform: translateX(-${index * 100}%);
                }
            `}</style>
            <button onClick={() => setIsModalOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z" />
                </svg>
            </button>
            <div>
                <button onClick={() => setIndex(index - 1)} style={{ visibility: index ? "visible" : "hidden" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
                    </svg>
                    BACK
                </button>
                <div>
                    {data.questions.map(({ question, options }, i) => (
                        <div key={i}>
                            <p>{question}</p>
                            <div>
                                {options.map((option, j) => (
                                    <div key={j}>
                                        <button
                                            dangerouslySetInnerHTML={{ __html: option.display }}
                                            className={rejections[question]?.selected === j ? styles.active : undefined}
                                            onClick={() => handleOnClick(question, option, j)}
                                        ></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div>
                        {Object.values(rejections).some(question => question.isRejected) ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#7e0707">
                                    <path d="M256 351.1C218.8 351.1 192.8 369.5 177.6 385.9C168.7 395.6 153.5 396.3 143.7 387.3C133.1 378.3 133.4 363.1 142.4 353.4C164.3 329.5 202.3 303.1 256 303.1C309.7 303.1 347.7 329.5 369.6 353.4C378.6 363.1 378 378.3 368.3 387.3C358.5 396.3 343.3 395.6 334.4 385.9C319.2 369.5 293.2 351.1 256 351.1V351.1zM208.4 208C208.4 225.7 194 240 176.4 240C158.7 240 144.4 225.7 144.4 208C144.4 190.3 158.7 176 176.4 176C194 176 208.4 190.3 208.4 208zM304.4 208C304.4 190.3 318.7 176 336.4 176C354 176 368.4 190.3 368.4 208C368.4 225.7 354 240 336.4 240C318.7 240 304.4 225.7 304.4 208zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                                </svg>
                                <p>
                                    Unfortunately, we are unable to prescribe this medication for you. This is because finasteride can alter the PSA levels, which maybe used to monitor for cancer. You
                                    should discuss this further with your GP or specialist if you would still like this medication.
                                </p>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#6d8a83">
                                    <path d="M256 352C293.2 352 319.2 334.5 334.4 318.1C343.3 308.4 358.5 307.7 368.3 316.7C378 325.7 378.6 340.9 369.6 350.6C347.7 374.5 309.7 400 256 400C202.3 400 164.3 374.5 142.4 350.6C133.4 340.9 133.1 325.7 143.7 316.7C153.5 307.7 168.7 308.4 177.6 318.1C192.8 334.5 218.8 352 256 352zM208.4 208C208.4 225.7 194 240 176.4 240C158.7 240 144.4 225.7 144.4 208C144.4 190.3 158.7 176 176.4 176C194 176 208.4 190.3 208.4 208zM304.4 208C304.4 190.3 318.7 176 336.4 176C354 176 368.4 190.3 368.4 208C368.4 225.7 354 240 336.4 240C318.7 240 304.4 225.7 304.4 208zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                                </svg>
                                <p>
                                    Great news! We have the perfect treatment for your hair loss. Proceed to <a href="https://www.manual.co/">www.manual.co</a>, and prepare to say hello to your new
                                    hair!
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById("modal") as HTMLDivElement
    );
};

export default QuizModal;
