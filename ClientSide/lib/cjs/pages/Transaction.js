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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function Transactions(_a) {
    var _this = this;
    var userval = _a.userval;
    var _b = (0, react_1.useState)([]), transactions = _b[0], setTransactions = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(0), currentCredits = _e[0], setCurrentCredits = _e[1];
    var _f = (0, react_1.useState)({
        total: 0,
        limit: 10,
        offset: 0
    }), pagination = _f[0], setPagination = _f[1];
    var _g = (0, react_1.useState)(new Set()), selectedTransactions = _g[0], setSelectedTransactions = _g[1];
    // Get user ID - you might get this from context, props, or auth
    // const userId = 1; // Replace with actual user ID from your auth system
    var parsedUser = (0, react_1.useMemo)(function () {
        if (!userval)
            return null;
        try {
            return JSON.parse(userval);
        }
        catch (_a) {
            return null;
        }
    }, [userval]);
    (0, react_1.useEffect)(function () {
        fetchTransactions();
    }, [pagination.offset, pagination.limit]);
    var fetchTransactions = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data_1, err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    return [4 /*yield*/, fetch("http://localhost:8080/user/".concat(parsedUser.id, "/transactions?limit=").concat(pagination.limit, "&offset=").concat(pagination.offset))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to fetch transactions');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data_1 = _a.sent();
                    setTransactions(data_1.transactions || []);
                    setCurrentCredits(data_1.current_credits || 0);
                    setPagination(function (prev) { return (__assign(__assign({}, prev), { total: data_1.total || 0 })); });
                    setError(null);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'An unknown error occurred';
                    setError(errorMessage);
                    setTransactions([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSelectAll = function (e) {
        if (e.target.checked) {
            setSelectedTransactions(new Set(transactions.map(function (t) { return t.id; })));
        }
        else {
            setSelectedTransactions(new Set());
        }
    };
    var handleSelectTransaction = function (id) {
        var newSelected = new Set(selectedTransactions);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        }
        else {
            newSelected.add(id);
        }
        setSelectedTransactions(newSelected);
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var getTransactionTypeIcon = function (type) {
        switch (type) {
            case 'purchase':
                return '💰';
            case 'usage':
                return '📤';
            case 'refund':
                return '↩️';
            default:
                return '📊';
        }
    };
    var getTransactionTypeColor = function (type) {
        switch (type) {
            case 'purchase':
                return 'text-success';
            case 'usage':
                return 'text-error';
            case 'refund':
                return 'text-info';
            default:
                return 'text-base-content';
        }
    };
    var getStatusBadgeClass = function (status) {
        switch (status) {
            case 'completed':
                return 'badge badge-success badge-sm';
            case 'pending':
                return 'badge badge-warning badge-sm';
            case 'failed':
                return 'badge badge-error badge-sm';
            default:
                return 'badge badge-ghost badge-sm';
        }
    };
    var getTransactionDisplayText = function (transaction) {
        switch (transaction.type) {
            case 'purchase':
                // Extract plan name from description for subscription purchases
                var planMatch = transaction.description.match(/Credits purchased - (.+?) \(/);
                var planName = planMatch ? planMatch[1] : 'Subscription Plan';
                return {
                    title: 'Subscription Purchase',
                    subtitle: planName
                };
            case 'usage':
                return {
                    title: 'Credits Used',
                    subtitle: transaction.description
                };
            case 'refund':
                return {
                    title: 'Refund Processed',
                    subtitle: transaction.description
                };
            default:
                return {
                    title: transaction.type,
                    subtitle: transaction.description
                };
        }
    };
    var handlePrevPage = function () {
        if (pagination.offset > 0) {
            setPagination(function (prev) { return (__assign(__assign({}, prev), { offset: Math.max(0, prev.offset - prev.limit) })); });
        }
    };
    var handleNextPage = function () {
        if (pagination.offset + pagination.limit < pagination.total) {
            setPagination(function (prev) { return (__assign(__assign({}, prev), { offset: prev.offset + prev.limit })); });
        }
    };
    var handleExportSelected = function () {
        var selectedData = transactions.filter(function (t) { return selectedTransactions.has(t.id); });
        var csvContent = __spreadArray([
            ['Date', 'Type', 'Amount', 'Credits', 'Description', 'Status'].join(',')
        ], selectedData.map(function (t) { return [
            t.date,
            t.type,
            t.amount.toString(),
            t.credits.toString(),
            "\"".concat(t.description, "\""),
            t.status
        ].join(','); }), true).join('\n');
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = "transactions-".concat(new Date().toISOString().split('T')[0], ".csv");
        link.click();
        window.URL.revokeObjectURL(url);
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold mb-6", children: "Transactions" }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center h-64", children: (0, jsx_runtime_1.jsx)("span", { className: "loading loading-spinner loading-lg" }) })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold mb-6", children: "Transactions" }), (0, jsx_runtime_1.jsxs)("div", { className: "alert alert-error", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Error: ", error] }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-sm", onClick: fetchTransactions, children: "Retry" })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold", children: "Transactions" }), (0, jsx_runtime_1.jsx)("div", { className: "stats shadow" })] }), (0, jsx_runtime_1.jsx)("p", { className: "mb-6 text-base-content/70", children: "View your subscription purchases and credit usage history." }), transactions.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83D\uDCB3" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold mb-2", children: "No transactions yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-base-content/70", children: "Your subscription purchases and credit usage will appear here." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "table", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: (0, jsx_runtime_1.jsx)("label", { children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "checkbox", checked: selectedTransactions.size === transactions.length && transactions.length > 0, onChange: handleSelectAll }) }) }), (0, jsx_runtime_1.jsx)("th", { children: "Transaction" }), (0, jsx_runtime_1.jsx)("th", { children: "Type" }), (0, jsx_runtime_1.jsx)("th", { children: "Amount" }), (0, jsx_runtime_1.jsx)("th", { children: "Credits" }), (0, jsx_runtime_1.jsx)("th", { children: "Status" }), (0, jsx_runtime_1.jsx)("th", {})] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: transactions.map(function (transaction) {
                                        var displayText = getTransactionDisplayText(transaction);
                                        return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: (0, jsx_runtime_1.jsx)("label", { children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "checkbox", checked: selectedTransactions.has(transaction.id), onChange: function () { return handleSelectTransaction(transaction.id); } }) }) }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "avatar placeholder", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-neutral text-neutral-content rounded-full w-12 h-12 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: getTransactionTypeIcon(transaction.type) }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-bold", children: displayText.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-50", children: formatDate(transaction.date) })] })] }) }), (0, jsx_runtime_1.jsxs)("td", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: displayText.subtitle }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm opacity-50", children: ["ID: ", transaction.id] })] }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsxs)("div", { className: "font-semibold ".concat(getTransactionTypeColor(transaction.type)), children: [transaction.type === 'purchase' || transaction.type === 'refund' ? '+' : '-', formatCurrency(Math.abs(transaction.amount))] }) }), (0, jsx_runtime_1.jsx)("td", {}), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("span", { className: getStatusBadgeClass(transaction.status), children: transaction.status }) }), (0, jsx_runtime_1.jsx)("th", { children: (0, jsx_runtime_1.jsxs)("div", { className: "dropdown dropdown-end", children: [(0, jsx_runtime_1.jsx)("div", { tabIndex: 0, role: "button", className: "btn btn-ghost btn-xs", children: "details" }), (0, jsx_runtime_1.jsxs)("ul", { tabIndex: 0, className: "dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { onClick: function () { return alert("Transaction ID: ".concat(transaction.id, "\nDescription: ").concat(transaction.description)); }, children: "View Details" }) }), transaction.type === 'purchase' && ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { onClick: function () { return alert('Receipt will be sent to your email'); }, children: "Download Receipt" }) }))] })] }) })] }, transaction.id));
                                    }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-base-content/70", children: ["Showing ", pagination.offset + 1, " to ", Math.min(pagination.offset + pagination.limit, pagination.total), " of ", pagination.total, " transactions"] }), (0, jsx_runtime_1.jsxs)("div", { className: "join", children: [(0, jsx_runtime_1.jsx)("button", { className: "join-item btn btn-sm", onClick: handlePrevPage, disabled: pagination.offset === 0, children: "Previous" }), (0, jsx_runtime_1.jsx)("button", { className: "join-item btn btn-sm", onClick: handleNextPage, disabled: pagination.offset + pagination.limit >= pagination.total, children: "Next" })] })] })] })), selectedTransactions.size > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-6 left-1/2 transform -translate-x-1/2", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-primary text-primary-content px-6 py-3 rounded-full shadow-lg flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: [selectedTransactions.size, " selected"] }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-sm btn-ghost text-primary-content", onClick: handleExportSelected, children: "Export CSV" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-sm btn-ghost text-primary-content", onClick: function () { return setSelectedTransactions(new Set()); }, children: "Clear" })] }) }))] }));
}
exports.default = Transactions;
//# sourceMappingURL=Transaction.js.map