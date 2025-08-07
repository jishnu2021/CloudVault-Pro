"use strict";
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
var lucide_react_1 = require("lucide-react");
function Subscription(_a) {
    var _this = this;
    var userdata = _a.userdata;
    var _b = (0, react_1.useState)([]), plans = _b[0], setPlans = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), processingPlan = _d[0], setProcessingPlan = _d[1];
    var _e = (0, react_1.useState)(0), userCredits = _e[0], setUserCredits = _e[1];
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
    // Load Razorpay script
    (0, react_1.useEffect)(function () {
        console.log(parsedUser.id);
        var loadRazorpayScript = function () {
            return new Promise(function (resolve) {
                if (window.Razorpay) {
                    resolve(true);
                    return;
                }
                var script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = function () { return resolve(true); };
                script.onerror = function () { return resolve(false); };
                document.body.appendChild(script);
            });
        };
        loadRazorpayScript();
    }, []);
    // Fetch subscription plans
    (0, react_1.useEffect)(function () {
        var fetchPlans = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch('https://cloudvault-pro.onrender.com/subscription/plans')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setPlans(data.plans || []);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Failed to fetch plans:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchPlans();
    }, []);
    // Fetch user credits
    (0, react_1.useEffect)(function () {
        var fetchUserCredits = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parsedUser)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch("https://cloudvault-pro.onrender.com/user/".concat(parsedUser.id, "/credits"))];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        setUserCredits(data.credits || 0);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error('Failed to fetch user credits:', error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchUserCredits();
    }, [parsedUser]);
    var handleSubscribe = function (planId) { return __awaiter(_this, void 0, void 0, function () {
        var orderResponse, orderData, options, rzp, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!parsedUser) {
                        alert('Please login to purchase credits');
                        return [2 /*return*/];
                    }
                    if (!window.Razorpay) {
                        alert('Payment system is not loaded. Please refresh and try again.');
                        return [2 /*return*/];
                    }
                    setProcessingPlan(planId);
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://cloudvault-pro.onrender.com/user/".concat(parsedUser.id, "/subscription/create-order"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ plan_type: planId }),
                        })];
                case 2:
                    orderResponse = _a.sent();
                    if (!orderResponse.ok) {
                        throw new Error('Failed to create order');
                    }
                    return [4 /*yield*/, orderResponse.json()];
                case 3:
                    orderData = _a.sent();
                    options = {
                        key: 'rzp_test_1mUU1xAnklgEiv', // Replace with your Razorpay Key ID
                        amount: orderData.amount,
                        currency: orderData.currency,
                        name: 'FileSharing Credits',
                        description: orderData.description,
                        image: '/logo.png', // Optional: Add your logo
                        order_id: orderData.order_id,
                        handler: function (response) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Payment successful callback
                                    return [4 /*yield*/, verifyPayment(response)];
                                    case 1:
                                        // Payment successful callback
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        prefill: {
                            name: parsedUser.name,
                            email: parsedUser.email,
                        },
                        notes: {
                            credits: orderData.credits,
                            plan_id: planId,
                        },
                        theme: {
                            color: '#3B82F6',
                        },
                        modal: {
                            ondismiss: function () {
                                setProcessingPlan(null);
                                setLoading(false);
                            },
                        },
                    };
                    rzp = new window.Razorpay(options);
                    rzp.open();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Payment initiation failed:', error_3);
                    alert('Failed to initiate payment. Please try again.');
                    setProcessingPlan(null);
                    setLoading(false);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var verifyPayment = function (paymentResponse) { return __awaiter(_this, void 0, void 0, function () {
        var verifyResponse, verifyData, storedUser, userData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!parsedUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("https://cloudvault-pro.onrender.com/user/".concat(parsedUser.id, "/subscription/verify-payment"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                            }),
                        })];
                case 2:
                    verifyResponse = _a.sent();
                    if (!verifyResponse.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, verifyResponse.json()];
                case 3:
                    verifyData = _a.sent();
                    if (verifyData.success) {
                        // Update user credits in local state
                        setUserCredits(verifyData.total_credits);
                        storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            userData = JSON.parse(storedUser);
                            userData.credits = verifyData.total_credits;
                            localStorage.setItem('user', JSON.stringify(userData));
                        }
                        alert("Payment successful! ".concat(verifyData.credits_added, " credits have been added to your account."));
                    }
                    else {
                        alert('Payment verification failed: ' + verifyData.message);
                    }
                    return [3 /*break*/, 5];
                case 4: throw new Error('Payment verification failed');
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_4 = _a.sent();
                    console.error('Payment verification error:', error_4);
                    alert('Payment verification failed. Please contact support if money was deducted.');
                    return [3 /*break*/, 8];
                case 7:
                    setProcessingPlan(null);
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var getPlanFeatures = function (planId) {
        var features = {
            plan_500: [
                'Upload up to 5000 files',
                'Basic cloud storage',
                'Standard support',
                '30 days retention',
            ],
            plan_1000: [
                'Upload up to 10000 files',
                'Premium cloud storage',
                'Priority support',
                '90 days retention',
                'Advanced analytics',
                'Bulk operations',
            ],
        };
        return features[planId] || [];
    };
    if (!parsedUser) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold mb-6", children: "Subscription Plans" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg mb-6", children: "Please login to view and purchase subscription plans." }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-primary", children: "Login" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 max-w-6xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold mb-4", children: "Choose Your Plan" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-600 mb-6", children: "Select a credit plan that suits your file sharing needs. Each credit allows you to upload and share files." }), (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-50 p-4 rounded-lg inline-block", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-semibold text-blue-800", children: ["Current Balance: ", (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: userCredits }), " credits"] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto", children: plans.map(function (plan) { return ((0, jsx_runtime_1.jsxs)("div", { className: "card bg-base-100 shadow-xl border-2 ".concat(plan.id === 'plan_1000' ? 'border-primary' : 'border-base-300', " relative"), children: [plan.id === 'plan_1000' && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2", children: (0, jsx_runtime_1.jsxs)("span", { className: "badge badge-primary gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { size: 12, fill: "currentColor" }), "Most Popular"] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "card-body text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { size: 48, className: "text-primary" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "card-title text-2xl justify-center mb-2", children: plan.name }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-4xl font-bold", children: ["\u20B9", plan.price_rupees] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 mt-1", children: [plan.credits, " credits"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-3", children: "What's included:" }), (0, jsx_runtime_1.jsx)("ul", { className: "text-left space-y-2", children: getPlanFeatures(plan.id).map(function (feature, index) { return ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 16, className: "text-success" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: feature })] }, index)); }) })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn w-full ".concat(plan.id === 'plan_1000' ? 'btn-primary' : 'btn-outline', " ").concat(processingPlan === plan.id ? 'loading' : ''), onClick: function () { return handleSubscribe(plan.id); }, disabled: loading, children: processingPlan === plan.id ? ((0, jsx_runtime_1.jsx)("span", { className: "loading loading-spinner loading-sm" })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { size: 16 }), "Buy Credits"] })) })] })] }, plan.id)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "divider", children: "Need Help?" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Credits are used for file uploads. Each MB costs 0.1 credits (minimum 0.5, maximum 5 credits per file)." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center gap-4 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "badge badge-outline", children: "Secure Payment" }), (0, jsx_runtime_1.jsx)("span", { className: "badge badge-outline", children: "Instant Credit Addition" }), (0, jsx_runtime_1.jsx)("span", { className: "badge badge-outline", children: "24/7 Support" })] })] })] }));
}
exports.default = Subscription;
//# sourceMappingURL=Subscription.js.map