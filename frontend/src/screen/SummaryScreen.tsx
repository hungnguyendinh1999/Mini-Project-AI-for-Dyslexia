import React, {useState, ChangeEvent, FC, useRef, useEffect} from "react";
import "./SummaryScreen.css";
import TextBox from "../components/atom/TextBox";
import UploadFileButton from "../components/molecules/UploadFileButton";
import SubmitButton from "../components/molecules/SubmitButton";
import Dropdown from "../components/atom/Dropdown";
import {createSummarizeResponseService} from "../services/backend-service"
import Loading from "../components/atom/Loading";
import Typewriter from "../components/atom/Typewriter";
import BackButton from "../components/molecules/BackButton";
import ColorPicker from "../components/molecules/ColorPicker";

type VocabLevel = {
    level: string;
    instruction: string;
};

const vocabLevelArray: VocabLevel[] = [
    { level: 'Default', instruction: 'Use the same level of language as the input text.' },
    { level: 'ELI5', instruction: 'Use the same level of language as eli5.' },
    { level: 'Simple', instruction: 'Use simple and easy-to-understand language.' },
    { level: 'Intermediate', instruction: 'Use moderately complex language for intermediate readers.' },
    { level: 'Advanced', instruction: 'Use advanced language with technical details where appropriate.' },
  ];

const harmContext =
    "If the input text contains harmful, illegal, or offensive content, respond with 'Content not allowed.' and give a 1-sentence explanation.";

    const predefinedBackgroundColors = [
        "#A8DADC",
        "#F4A261",
        "#457B9D",
        "#FFE8D6",
        "#1D3557",
        "#FFFFFF",
        "#000000",
    ];
    const predefinedFontColors = [
        "#1D3557",
        "#F4F1DE",
        "#457B9D",
        "#264653",
        "#A8DADC",
        "#FFFFFF",
        "#000000",
    ];
    const typeFaces = [
        "Arial",
        "Times New Roman",
        "Courier New",
        "Verdana",
        "Comic Sans MS",
    ];

/**
 * Summarize screen, allows user to input text and ask the system to summarize for the text for them.
 * The process should go: input text -> summarize (OpenAI API request) -> synthesis (OpenAI API request)
 */
const SummaryScreen: FC = () => {
    // Define state with types
    const fileInputRef = useRef(null);
    const [text, setText] = useState<string>("");
    const [vocabLevel, setVocabLevel] = useState<string>("Default");
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [height, setHeight] = useState<string>("90%");
    const [summary, setSummary] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Color settings objects
    const [backgroundColor, setBackgroundColor] = useState<string>(predefinedBackgroundColors[0]);
    const [fontColor, setFontColor] = useState<string>(predefinedFontColors[0]);
    const [fontTypeface, setFontTypeface] = useState<string>(typeFaces[0]);

    // Event handler for textarea input
    const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    // Event handler for Vocab Level
    const handleVocabLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVocabLevel(event.target.value);
    };

    // Request file upload text
    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleSummarize = async () => {
        // Submit logic will go here
        if (!text.trim()) return;

        setIsLoading(true);
        setIsSubmitted(true); // Trigger animations and state changes
        // Animation
        setHeight("30%");

        const vocabString = vocabLevelArray.find((option) => option.level === vocabLevel)?.instruction;
        try {
            // Request Summary
            const response = await createSummarizeResponseService().post({
                message: text.trim(),
                context: harmContext,
                vocabLevel: vocabString,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }

            const summaryText = await response.text(); // Assuming BE returns plain text
            setSummary(summaryText); // Display the summary in the new textbox
        } catch (error) {
            setErrorMessage("Failed to generate summary. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle file read
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target === null) {
                    setText("");
                } else {
                    const result = e.target?.result;
                    if (typeof result === "string") {
                        setText(result);
                    } else {
                        console.error("FileReader result is not a string");
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    // Handle back button from finish summarizing back to the start
    const backButton = () => {
        setIsSubmitted(false);
        setHeight("90%");
    }

    return (
        <div id="summary-screen">
            <div className="row-container">
                <div className="flex-box">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".txt"
                        onChange={handleFileChange}
                    />
                    <div
                        id="summary-input-container"
                        style={{
                            height: height,
                            backgroundColor: backgroundColor,
                        }}
                    >
                        <div id="summary-title-wrapper">
                            {!isLoading && !isSubmitted && (
                                <UploadFileButton
                                    label="Upload File"
                                    onClick={handleFileUpload}
                                />
                            )}
                            <div
                                id="summary-title"
                                className="center-text disable-selection"
                            ></div>
                            {!isLoading && !isSubmitted && (
                                <Dropdown
                                    options={vocabLevelArray.map(
                                        (item) => item.level
                                    )}
                                    value={vocabLevel}
                                    onChange={handleVocabLevelChange}
                                />
                            )}
                            {!isLoading && !isSubmitted && (
                                <SubmitButton
                                    onClick={handleSummarize}
                                    inverseColor={true}
                                />
                            )}
                            {isLoading && <Loading size={35} />}
                        </div>
                        <div
                            id="summary-textbox-container"
                            style={{
                                color: fontColor,
                                fontFamily: fontTypeface,
                            }}
                        >
                            {/* Use custom TextBox component */}
                            <TextBox
                                value={text}
                                onChange={handleTextChange}
                                placeholder="Type text here, or upload a *.txt file, then choose the vocabulary level and click on the summarize button on the top right to start."
                                color={fontColor}
                                readonly={isSubmitted}
                            />
                        </div>
                    </div>

                    {isSubmitted && (
                        <div id="summary-output-container">
                            <div id="summary-title-wrapper">
                                <BackButton
                                    size={35}
                                    onClick={backButton}
                                    inverseColor={true}
                                />
                                <div
                                    id="summary-title"
                                    className="center-text disable-selection"
                                >
                                    <p>Summary</p>
                                </div>
                            </div>
                            <div
                                id="smaller-container"
                                className="hide-caret"
                                style={{
                                    backgroundColor: backgroundColor,
                                    color: fontColor,
                                    fontFamily: fontTypeface,
                                }}
                            >
                                {isLoading ? (
                                    <Loading size={30} />
                                ) : errorMessage ? (
                                    <p className="error">{errorMessage}</p>
                                ) : (
                                    <Typewriter value={summary} speed={4} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="additional-div"
                    style={{
                        backgroundColor: backgroundColor,
                        color: fontColor,
                        fontFamily: fontTypeface,
                    }}
                >
                    <div>
                        <span>Background Color</span>
                        <ColorPicker
                            label=""
                            colors={predefinedBackgroundColors}
                            selectedColor={backgroundColor}
                            onColorSelect={(color) => setBackgroundColor(color)}
                        />
                    </div>

                    <div>
                        <span>Font Color</span>
                        <ColorPicker
                            label=""
                            colors={predefinedFontColors}
                            selectedColor={fontColor}
                            onColorSelect={(color) => setFontColor(color)}
                        />
                    </div>

                    <div>
                        <span>Font Family</span>
                        <Dropdown
                            label=""
                            options={typeFaces}
                            value={fontTypeface}
                            onChange={(e) => setFontTypeface(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="center top-margin-10">
                <h1>Disclaimer</h1>
                <p>
                This summary is AI-generated and may not always capture all critical details. Please verify the accuracy of the summary and refer to the original text if needed.
                </p>
                <p>
                    If you want to REPORT any incorrectness or inappropriate content generated, please access{" "}
                    <a target="_blank" href="https://forms.gle/p7qu8RFtKRhKPDGr7">
                        Report Inaccurate Summary Form
                    </a>
                    .{" "}
                </p>
                <h1> Feedback </h1>
                <p>
                    We appreciate any feedback! Feedbacks help us grow and
                    develop better applications.{" "}
                </p>
                <p>
                    If you wish to give us general feedback, please access{" "}
                    <a target="_blank" href="https://forms.gle/p7qu8RFtKRhKPDGr7">
                        the General Feedback Form
                    </a>
                    .{" "}
                </p>
            </div>
        </div>
    );
};

export default SummaryScreen;
