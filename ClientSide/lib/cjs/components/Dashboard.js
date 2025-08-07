"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var DashboardHome_1 = require("../pages/DashboardHome");
var UploadFiles_1 = require("../pages/UploadFiles");
var Transaction_1 = require("../pages/Transaction");
var Subscription_1 = require("../pages/Subscription");
function Dashboard(_a) {
    var user = _a.user;
    var _b = (0, react_1.useState)('dashboard'), currentPage = _b[0], setCurrentPage = _b[1];
    // parse once, memoize to avoid repeated JSON.parse on rerenders
    var parsedUser = (0, react_1.useMemo)(function () {
        if (!user)
            return null;
        try {
            return JSON.parse(user);
        }
        catch (_a) {
            return null;
        }
    }, [user]);
    var menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'upload', label: 'Upload Files', icon: '📁' },
        { id: 'transactions', label: 'Transactions', icon: '💳' },
        { id: 'subscription', label: 'Subscription', icon: '⭐' }
    ];
    var renderPage = function () {
        switch (currentPage) {
            case 'dashboard':
                return (0, jsx_runtime_1.jsx)(DashboardHome_1.default, { setCurrentPage: setCurrentPage });
            case 'upload':
                return (0, jsx_runtime_1.jsx)(UploadFiles_1.default, { userval: user });
            case 'transactions':
                return (0, jsx_runtime_1.jsx)(Transaction_1.default, { userval: user });
            case 'subscription':
                return (0, jsx_runtime_1.jsx)(Subscription_1.default, { userdata: user });
            default:
                return (0, jsx_runtime_1.jsx)(DashboardHome_1.default, { setCurrentPage: setCurrentPage });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "drawer lg:drawer-open", children: [(0, jsx_runtime_1.jsx)("input", { id: "dashboard-drawer", type: "checkbox", className: "drawer-toggle" }), (0, jsx_runtime_1.jsxs)("div", { className: "drawer-content flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "navbar lg:hidden bg-base-100 shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-none", children: (0, jsx_runtime_1.jsx)("label", { htmlFor: "dashboard-drawer", className: "btn btn-square btn-ghost", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" }) }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 px-2 mx-2", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-bold", children: "FileSharing Dashboard" }) })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex-1 bg-base-200 min-h-screen", children: renderPage() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "drawer-side", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "dashboard-drawer", className: "drawer-overlay" }), (0, jsx_runtime_1.jsx)("aside", { className: "w-64 min-h-full bg-base-100", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsx)("ul", { className: "menu space-y-2", children: menuItems.map(function (item) { return ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setCurrentPage(item.id); }, className: "flex items-center space-x-3 w-full text-left p-3 rounded-lg transition-colors ".concat(currentPage === item.id
                                            ? 'bg-primary text-primary-content'
                                            : 'hover:bg-base-200'), children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: item.label })] }) }, item.id)); }) }) }) })] })] }));
}
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map