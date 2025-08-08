"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_1 = require("react-router");
var NavbarPage = function (_a) {
    var userdata = _a.userdata;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)({}), editedData = _c[0], setEditedData = _c[1];
    var _d = (0, react_1.useState)(null), selectedImage = _d[0], setSelectedImage = _d[1];
    var _e = (0, react_1.useState)(0), currentCredits = _e[0], setCurrentCredits = _e[1];
    var _f = (0, react_1.useState)(false), imageUploadLoading = _f[0], setImageUploadLoading = _f[1];
    var parsedUser = (0, react_1.useMemo)(function () {
        if (!userdata)
            return null;
        try {
            return JSON.parse(userdata);
        }
        catch (_a) {
            return null;
        }
    }, [userdata]);
    // Login/Register form states
    var _g = (0, react_1.useState)({ email: '', password: '' }), loginData = _g[0], setLoginData = _g[1];
    var _h = (0, react_1.useState)({
        name: '',
        email: '',
        password: '',
        phone: '',
        bio: ''
    }), registerData = _h[0], setRegisterData = _h[1];
    // Check localStorage on component mount
    (0, react_1.useEffect)(function () {
        var storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                var userData = JSON.parse(storedUser);
                setUser(userData);
                setEditedData(userData);
                setCurrentCredits(userData.credits || 0);
            }
            catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);
    // Fetch user credits periodically
    (0, react_1.useEffect)(function () {
        var fetchUserCredits = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, newCredits, storedUser, userData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parsedUser)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch("http://localhost:8080/user/".concat(parsedUser.id, "/credits"))];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        newCredits = data.credits || 0;
                        setCurrentCredits(newCredits);
                        storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            userData = JSON.parse(storedUser);
                            userData.credits = newCredits;
                            localStorage.setItem('user', JSON.stringify(userData));
                            setUser(userData);
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Failed to fetch user credits:', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        // Fetch credits immediately if user exists
        if (parsedUser) {
            fetchUserCredits();
            // Set up interval to fetch credits every 30 seconds
            var interval_1 = setInterval(fetchUserCredits, 30000);
            return function () { return clearInterval(interval_1); };
        }
    }, [parsedUser]);
    var getInitials = function (name) {
        if (!name)
            return '';
        return name
            .split(' ')
            .map(function (word) { return word.charAt(0); })
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    // Get user's profile image with fallback logic
    var getUserImage = function (userData) {
        if (!userData)
            return null;
        // Check both photo and image fields
        var imageUrl = userData.photo || userData.image;
        // If it's a base64 string, return it directly
        if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('http'))) {
            return imageUrl;
        }
        // If it's a file path, construct the full URL
        if (imageUrl && !imageUrl.startsWith('data:') && !imageUrl.startsWith('http')) {
            return "https://cloudvault-pro.onrender.com".concat(imageUrl.startsWith('/') ? '' : '/').concat(imageUrl);
        }
        return null;
    };
    // Handle Login
    var handleLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, userData, error, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fetch("http://localhost:8080/login", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(loginData),
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    userData = _b.sent();
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    setEditedData(userData);
                    setCurrentCredits(userData.credits || 0);
                    setLoginData({ email: '', password: '' });
                    (_a = document.getElementById('login_modal')) === null || _a === void 0 ? void 0 : _a.close();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.text()];
                case 4:
                    error = _b.sent();
                    alert('Login failed: ' + error);
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _b.sent();
                    console.error('Login error:', error_2);
                    alert('Login failed. Please try again.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Handle Register
    var handleRegister = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, userData, error, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fetch('http://localhost:8080/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(registerData),
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    userData = _b.sent();
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    setEditedData(userData);
                    setCurrentCredits(userData.credits || 0);
                    setRegisterData({ name: '', email: '', password: '', phone: '', bio: '' });
                    (_a = document.getElementById('register_modal')) === null || _a === void 0 ? void 0 : _a.close();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.text()];
                case 4:
                    error = _b.sent();
                    alert('Registration failed: ' + error);
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _b.sent();
                    console.error('Registration error:', error_3);
                    alert('Registration failed. Please try again.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Handle Logout
    var handleLogout = function () {
        var _a;
        localStorage.removeItem('user');
        setUser(null);
        setEditedData({});
        setCurrentCredits(0);
        setSelectedImage(null);
        (_a = document.getElementById('logout_modal')) === null || _a === void 0 ? void 0 : _a.close();
        navigate('/'); // Redirect to home page after logout
        alert("User logged out");
    };
    var handleInputChange = function (field, value) {
        setEditedData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    var handleImageChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }
            // Validate file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB.');
                return;
            }
            setImageUploadLoading(true);
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                var result = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                if (result) {
                    setSelectedImage(result);
                    setEditedData(function (prev) { return (__assign(__assign({}, prev), { photo: result, image: result // Set both fields to ensure compatibility
                     })); });
                }
                setImageUploadLoading(false);
            };
            reader.onerror = function () {
                alert('Error reading the image file.');
                setImageUploadLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };
    // Save profile changes
    var handleSaveProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, updatedUser, error, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    if (!parsedUser)
                        return [2 /*return*/];
                    console.log('Saving profile with data:', editedData); // Debug log
                    return [4 /*yield*/, fetch("http://localhost:8080/user/".concat(parsedUser.id, "/profile"), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(editedData),
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    updatedUser = _b.sent();
                    console.log('Updated user received:', updatedUser); // Debug log
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                    setCurrentCredits(updatedUser.credits || 0);
                    setSelectedImage(null); // Clear temporary selected image
                    (_a = document.getElementById('profile_modal')) === null || _a === void 0 ? void 0 : _a.close();
                    // Force a re-render by updating the user state
                    setTimeout(function () {
                        var storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            var userData = JSON.parse(storedUser);
                            setUser(__assign({}, userData)); // Force state update
                        }
                    }, 100);
                    alert('Profile updated successfully!');
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.text()];
                case 4:
                    error = _b.sent();
                    alert('Failed to update profile: ' + error);
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _b.sent();
                    console.error('Profile update error:', error_4);
                    alert('Failed to update profile. Please try again.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleCancelProfile = function () {
        var _a;
        setEditedData(__assign({}, user));
        setSelectedImage(null);
        (_a = document.getElementById('profile_modal')) === null || _a === void 0 ? void 0 : _a.close();
    };
    var openProfileModal = function () {
        var _a;
        setEditedData(__assign({}, user));
        setSelectedImage(null);
        (_a = document.getElementById('profile_modal')) === null || _a === void 0 ? void 0 : _a.showModal();
    };
    // Get the current display image
    var currentUserImage = getUserImage(user);
    var modalDisplayImage = selectedImage || getUserImage(__assign(__assign({}, user), editedData));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "navbar bg-base-100 shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("a", { className: "btn btn-ghost text-2xl", href: "/", children: "CloudVault Pro" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search", className: "input input-bordered w-24 md:w-auto" }), (0, jsx_runtime_1.jsxs)("label", { className: "swap swap-rotate", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "theme-controller", value: "dark" }), (0, jsx_runtime_1.jsx)("svg", { className: "swap-off h-10 w-10 fill-current", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" }) }), (0, jsx_runtime_1.jsx)("svg", { className: "swap-on h-10 w-10 fill-current", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" }) })] }), !user ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn btn-outline btn-sm", onClick: function () { var _a; return (_a = document.getElementById('login_modal')) === null || _a === void 0 ? void 0 : _a.showModal(); }, children: "Login" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-primary btn-sm", onClick: function () { var _a; return (_a = document.getElementById('register_modal')) === null || _a === void 0 ? void 0 : _a.showModal(); }, children: "Register" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "dropdown dropdown-end", children: [(0, jsx_runtime_1.jsx)("div", { tabIndex: 0, role: "button", className: "btn btn-ghost btn-circle avatar", children: (0, jsx_runtime_1.jsx)("div", { className: "w-10 rounded-full", children: currentUserImage ? ((0, jsx_runtime_1.jsx)("img", { alt: "User Avatar", src: currentUserImage, onError: function (e) {
                                                    // If image fails to load, hide it and show initials
                                                    e.currentTarget.style.display = 'none';
                                                    var parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = "<div class=\"w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm\">".concat(getInitials(user.name), "</div>");
                                                    }
                                                } })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm", children: getInitials(user.name) })) }) }), (0, jsx_runtime_1.jsxs)("ul", { tabIndex: 0, className: "menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("button", { className: "justify-between", onClick: openProfileModal, children: ["Profile", (0, jsx_runtime_1.jsx)("span", { className: "badge badge-primary", children: "".concat(currentCredits, " Credits") })] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/dashboard", children: "Dashboard" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { var _a; return (_a = document.getElementById('logout_modal')) === null || _a === void 0 ? void 0 : _a.showModal(); }, children: "Logout" }) })] })] }))] })] }), (0, jsx_runtime_1.jsx)("dialog", { id: "login_modal", className: "modal", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-box", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-lg", children: "Login" }), (0, jsx_runtime_1.jsxs)("div", { className: "py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text", children: "Email \u00A0" }) }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Enter your email", className: "input input-bordered", value: loginData.email, onChange: function (e) { return setLoginData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); } }), (0, jsx_runtime_1.jsx)("div", { style: { margin: "5px" } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text", children: "Password \u00A0" }) }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Enter your password", className: "input input-bordered", value: loginData.password, onChange: function (e) { return setLoginData(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); } })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-action", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn btn-outline", onClick: function () {
                                        var _a;
                                        (_a = document.getElementById('login_modal')) === null || _a === void 0 ? void 0 : _a.close();
                                        setLoginData({ email: '', password: '' });
                                    }, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-primary", onClick: handleLogin, children: "Login" })] })] }) }), (0, jsx_runtime_1.jsx)("dialog", { id: "register_modal", className: "modal", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-box", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-lg", children: "Register" }), (0, jsx_runtime_1.jsxs)("div", { className: "py-4 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text", children: "Full Name  \u00A0" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Enter your full name", className: "input input-bordered", value: registerData.name, onChange: function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text", children: "Email \u00A0" }) }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Enter your email", className: "input input-bordered", value: registerData.email, onChange: function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text", children: "Password \u00A0" }) }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Enter your password", className: "input input-bordered", value: registerData.password, onChange: function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text", children: "Phone Number \u00A0" }) }), (0, jsx_runtime_1.jsx)("input", { type: "tel", placeholder: "Enter your phone number", className: "input input-bordered", value: registerData.phone, onChange: function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { phone: e.target.value })); }); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text", children: "Bio \u00A0" }) }), (0, jsx_runtime_1.jsx)("textarea", { placeholder: "Tell us about yourself...", className: "textarea textarea-bordered", value: registerData.bio, onChange: function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { bio: e.target.value })); }); } })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-action", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn btn-outline", onClick: function () {
                                        var _a;
                                        (_a = document.getElementById('register_modal')) === null || _a === void 0 ? void 0 : _a.close();
                                        setRegisterData({ name: '', email: '', password: '', phone: '', bio: '' });
                                    }, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-primary", onClick: handleRegister, children: "Register" })] })] }) }), (0, jsx_runtime_1.jsx)("dialog", { id: "profile_modal", className: "modal", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-box w-11/12 max-w-2xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-2xl", children: "Edit Profile" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-sm btn-circle btn-ghost", onClick: function () { var _a; return (_a = document.getElementById('profile_modal')) === null || _a === void 0 ? void 0 : _a.close(); }, children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-blue-800", children: "Current Credits" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: currentCredits })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-blue-600 mb-2", children: "Need more credits?" }), (0, jsx_runtime_1.jsx)("a", { href: "/dashboard", className: "btn btn-sm btn-primary", children: "Buy Credits" })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "avatar", children: (0, jsx_runtime_1.jsx)("div", { className: "w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2", children: imageUploadLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full bg-gray-200 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "loading loading-spinner loading-md" }) })) : modalDisplayImage ? ((0, jsx_runtime_1.jsx)("img", { src: modalDisplayImage, alt: "Profile", onError: function (e) {
                                                        console.error('Failed to load image:', modalDisplayImage);
                                                        e.currentTarget.style.display = 'none';
                                                        var parent = e.currentTarget.parentElement;
                                                        if (parent) {
                                                            parent.innerHTML = "<div class=\"w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-xl\">".concat(getInitials(editedData.name || (user === null || user === void 0 ? void 0 : user.name)), "</div>");
                                                        }
                                                    } })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-xl", children: getInitials(editedData.name || (user === null || user === void 0 ? void 0 : user.name)) })) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "file-input file-input-bordered file-input-primary w-full max-w-xs", disabled: imageUploadLoading }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Maximum file size: 5MB" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text font-medium", children: "Full Name" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Enter your full name", className: "input input-bordered w-full", value: editedData.name || '', onChange: function (e) { return handleInputChange('name', e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text font-medium", children: "Email" }) }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Enter your email", className: "input input-bordered w-full", value: editedData.email || '', onChange: function (e) { return handleInputChange('email', e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text font-medium", children: "Phone" }) }), (0, jsx_runtime_1.jsx)("input", { type: "tel", placeholder: "Enter your phone number", className: "input input-bordered w-full", value: editedData.phone || '', onChange: function (e) { return handleInputChange('phone', e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-control md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: (0, jsx_runtime_1.jsx)("span", { className: "label-text font-medium", children: "Bio \u00A0" }) }), (0, jsx_runtime_1.jsx)("textarea", { className: "textarea textarea-bordered h-24 resize-none", placeholder: "Tell us about yourself...", value: editedData.bio || '', onChange: function (e) { return handleInputChange('bio', e.target.value); } })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-action mt-8", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn btn-outline", onClick: handleCancelProfile, children: "Cancel" }), (0, jsx_runtime_1.jsxs)("button", { className: "btn btn-primary", onClick: handleSaveProfile, disabled: imageUploadLoading, children: [imageUploadLoading ? ((0, jsx_runtime_1.jsx)("span", { className: "loading loading-spinner loading-sm mr-2" })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) })), "Save Changes"] })] })] }) }), (0, jsx_runtime_1.jsx)("dialog", { id: "logout_modal", className: "modal", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-box", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold", children: "Confirm Logout" }), (0, jsx_runtime_1.jsx)("p", { className: "py-4", children: "Are you sure you want to logout?" }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-action", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn btn-outline", onClick: function () { var _a; return (_a = document.getElementById('logout_modal')) === null || _a === void 0 ? void 0 : _a.close(); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-error", onClick: handleLogout, children: "Yes, Logout" })] })] }) })] }));
};
exports.default = NavbarPage;
//# sourceMappingURL=Navbar.js.map