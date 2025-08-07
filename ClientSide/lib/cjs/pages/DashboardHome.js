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
function DashboardHome(_a) {
    var _this = this;
    var setCurrentPage = _a.setCurrentPage;
    var _b = (0, react_1.useState)([]), files = _b[0], setFiles = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = (0, react_1.useState)('date'), sortBy = _f[0], setSortBy = _f[1];
    var _g = (0, react_1.useState)('desc'), sortOrder = _g[0], setSortOrder = _g[1];
    var _h = (0, react_1.useState)('all'), filterType = _h[0], setFilterType = _h[1];
    var _j = (0, react_1.useState)(1), currentPage = _j[0], setCurrentPageState = _j[1];
    var itemsPerPage = (0, react_1.useState)(10)[0];
    var _k = (0, react_1.useState)({
        totalFiles: 0,
        totalSize: 0,
        recentUploads: 0,
        storageUsed: 0
    }), stats = _k[0], setStats = _k[1];
    // Mock user ID - replace with actual auth
    var uservalue = localStorage.getItem("user");
    var parsedUser = (0, react_1.useMemo)(function () {
        if (!uservalue)
            return null;
        try {
            return JSON.parse(uservalue);
        }
        catch (_a) {
            return null;
        }
    }, [uservalue]);
    (0, react_1.useEffect)(function () {
        fetchFiles();
    }, []);
    (0, react_1.useEffect)(function () {
        calculateStats();
    }, [files]);
    var fetchFiles = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    return [4 /*yield*/, fetch("https://cloudvault-pro.onrender.com/api/user/".concat(parsedUser.id, "/files?page=1&limit=100"))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.success) {
                        setFiles(data.files || []);
                    }
                    else {
                        setError('Failed to fetch files');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError('Error loading files');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var calculateStats = function () {
        var totalSize = files.reduce(function (sum, file) { return sum + file.size; }, 0);
        var now = Date.now() / 1000;
        var dayAgo = now - (24 * 60 * 60);
        var recentUploads = files.filter(function (file) { return file.created_at > dayAgo; }).length;
        setStats({
            totalFiles: files.length,
            totalSize: totalSize,
            recentUploads: recentUploads,
            storageUsed: (totalSize / (1024 * 1024 * 1024)) * 100 // Convert to percentage of 1GB
        });
    };
    var formatFileSize = function (bytes) {
        if (bytes === 0)
            return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    var formatDate = function (timestamp) {
        var date = new Date(timestamp * 1000);
        var now = new Date();
        var diffMs = now.getTime() - date.getTime();
        var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        var diffDays = Math.floor(diffHours / 24);
        if (diffHours < 1)
            return 'Just now';
        if (diffHours < 24)
            return "".concat(diffHours, "h ago");
        if (diffDays < 7)
            return "".concat(diffDays, "d ago");
        return date.toLocaleDateString();
    };
    var getFileIcon = function (mimeType) {
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('image/'))
            return '🖼️';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('video/'))
            return '🎥';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('audio/'))
            return '🎵';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('pdf'))
            return '📄';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('document')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('word')))
            return '📝';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('spreadsheet')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('excel')))
            return '📊';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('zip')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('rar')))
            return '📦';
        return '📁';
    };
    var getFileTypeColor = function (mimeType) {
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('image/'))
            return 'bg-green-100 text-green-800 border-green-200';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('video/'))
            return 'bg-purple-100 text-purple-800 border-purple-200';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('audio/'))
            return 'bg-blue-100 text-blue-800 border-blue-200';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('pdf'))
            return 'bg-red-100 text-red-800 border-red-200';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('document')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('word')))
            return 'bg-blue-100 text-blue-800 border-blue-200';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('spreadsheet')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('excel')))
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };
    var getFileCategory = function (mimeType) {
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('image/'))
            return 'Image';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('video/'))
            return 'Video';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('audio/'))
            return 'Audio';
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('pdf'))
            return 'PDF';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('document')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('word')))
            return 'Document';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('spreadsheet')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('excel')))
            return 'Spreadsheet';
        if ((mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('zip')) || (mimeType === null || mimeType === void 0 ? void 0 : mimeType.includes('rar')))
            return 'Archive';
        return 'File';
    };
    // Filter and sort files
    var filteredFiles = files.filter(function (file) {
        var matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesFilter = filterType === 'all' || getFileCategory(file.mime_type).toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesFilter;
    });
    var sortedFiles = __spreadArray([], filteredFiles, true).sort(function (a, b) {
        var compareValue = 0;
        switch (sortBy) {
            case 'name':
                compareValue = a.original_name.localeCompare(b.original_name);
                break;
            case 'size':
                compareValue = a.size - b.size;
                break;
            case 'date':
                compareValue = a.created_at - b.created_at;
                break;
        }
        return sortOrder === 'asc' ? compareValue : -compareValue;
    });
    // Pagination
    var totalPages = Math.ceil(sortedFiles.length / itemsPerPage);
    var startIndex = (currentPage - 1) * itemsPerPage;
    var paginatedFiles = sortedFiles.slice(startIndex, startIndex + itemsPerPage);
    var deleteFile = function (fileId) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this file?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://cloudvault-pro.onrender.com/api/user/".concat(parsedUser.id, "/files/").concat(fileId), {
                            method: 'DELETE',
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        setFiles(function (prev) { return prev.filter(function (file) { return file.id !== fileId; }); });
                    }
                    else {
                        setError('Failed to delete file');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    setError('Error deleting file');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var copyLink = function (url) {
        navigator.clipboard.writeText(url);
        // You could show a toast notification here
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-96", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "File Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Manage and organize all your uploaded files" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setCurrentPage('upload'); }, className: "mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 inline mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 4v16m8-8H4" }) }), "Upload Files"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-blue-500 rounded-lg", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-blue-600 text-sm font-medium", children: "Total Files" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-blue-900", children: stats.totalFiles })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-green-500 rounded-lg", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-green-600 text-sm font-medium", children: "Storage Used" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-green-900", children: formatFileSize(stats.totalSize) })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-purple-500 rounded-lg", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-purple-600 text-sm font-medium", children: "Recent Uploads" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-purple-900", children: stats.recentUploads })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-orange-500 rounded-lg", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-orange-600 text-sm font-medium", children: "Storage Usage" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-orange-900", children: [Math.min(stats.storageUsed, 100).toFixed(1), "%"] })] })] }) })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6", children: error })), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-200 mb-6", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("svg", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search files...", className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("select", { className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", value: filterType, onChange: function (e) { return setFilterType(e.target.value); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "image", children: "Images" }), (0, jsx_runtime_1.jsx)("option", { value: "video", children: "Videos" }), (0, jsx_runtime_1.jsx)("option", { value: "audio", children: "Audio" }), (0, jsx_runtime_1.jsx)("option", { value: "document", children: "Documents" }), (0, jsx_runtime_1.jsx)("option", { value: "pdf", children: "PDFs" }), (0, jsx_runtime_1.jsx)("option", { value: "spreadsheet", children: "Spreadsheets" })] }), (0, jsx_runtime_1.jsxs)("select", { className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", value: sortBy, onChange: function (e) { return setSortBy(e.target.value); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "date", children: "Sort by Date" }), (0, jsx_runtime_1.jsx)("option", { value: "name", children: "Sort by Name" }), (0, jsx_runtime_1.jsx)("option", { value: "size", children: "Sort by Size" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }, className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center", children: sortOrder === 'asc' ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" }) })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" }) })) })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden", children: files.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-10 h-10 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No files uploaded yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-6", children: "Start by uploading your first file to see it here" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage('upload'); }, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium", children: "Upload Your First File" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "File" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Type" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Size" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Uploaded" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Link" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-gray-200", children: paginatedFiles.map(function (file) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl mr-3", children: getFileIcon(file.mime_type) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900 max-w-xs truncate", children: file.original_name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["ID: ", file.id] })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-3 py-1 text-xs font-semibold rounded-full border ".concat(getFileTypeColor(file.mime_type)), children: getFileCategory(file.mime_type) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-900 font-mono", children: formatFileSize(file.size) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-600", children: formatDate(file.created_at) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("a", { href: file.cloudinary_url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition-colors", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }), "Open"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return copyLink(file.cloudinary_url); }, className: "inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }), "Copy"] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-right", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return deleteFile(file.id); }, className: "inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Delete"] }) })] }, file.id)); }) })] }) }), totalPages > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Showing ", startIndex + 1, " to ", Math.min(startIndex + itemsPerPage, sortedFiles.length), " of ", sortedFiles.length, " files"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPageState(Math.max(1, currentPage - 1)); }, disabled: currentPage === 1, className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (page) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPageState(page); }, className: "px-3 py-2 text-sm font-medium border border-gray-300 ".concat(currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-500 bg-white hover:bg-gray-50'), children: page }, page)); }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPageState(Math.min(totalPages, currentPage + 1)); }, disabled: currentPage === totalPages, className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] })] }))] })) })] }));
}
exports.default = DashboardHome;
//# sourceMappingURL=DashboardHome.js.map