import "./App.css";
import SummaryScreen from "./screen/SummaryScreen";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";

function AppLayout() {

    return (
        <div>
            <Routes>
                <Route path="/" element={<SummaryScreen />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}
