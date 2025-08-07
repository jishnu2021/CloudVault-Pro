"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_1 = require("react-router");
var Navbar_1 = require("./components/Navbar");
var Home_1 = require("./pages/Home");
var Dashboard_1 = require("./components/Dashboard");
function App() {
    var user = localStorage.getItem('user');
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(react_router_1.BrowserRouter, { children: [(0, jsx_runtime_1.jsx)(Navbar_1.default, { userdata: user }), (0, jsx_runtime_1.jsxs)(react_router_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Home_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(Dashboard_1.default, { user: user }) }), (0, jsx_runtime_1.jsx)(react_router_1.Route, { path: "/settings", element: (0, jsx_runtime_1.jsx)("div", { children: "Settings Page" }) })] })] }) }));
}
exports.default = App;
//# sourceMappingURL=App.js.map