import React from "react";
import "./Loading.css"
import Icon from "../../assets/submit-plane.png"

interface LoadingProps {
    size: number;
}

/**
 * Loading animation, using our logo
 *
 * @param size size of the loading icon
 */
const Loading: React.FC<LoadingProps> = ({size}) => {
    return (
        <div id="loading-container" style={{height: size, width: size}}>
            <img src={Icon} id="loading-img" />
        </div>
    );
};

export default Loading;