import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./CSs/Snackbar.css"; // Assuming you will style it

const Snackbar = ({ message, isError, duration = 3000, onClose }) => {
    useEffect(() => {
        if (onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={`snackbar ${isError ? "error" : "success"}`}>
            {message}
        </div>
    );
};

Snackbar.propTypes = {
    message: PropTypes.string.isRequired,
    isError: PropTypes.bool,
    duration: PropTypes.number,
    onClose: PropTypes.func,
};

export default Snackbar;
