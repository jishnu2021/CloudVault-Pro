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
function UploadFiles(_a) {
    var _this = this;
    var userval = _a.userval;
    var _b = (0, react_1.useState)([]), uploadedFiles = _b[0], setUploadedFiles = _b[1];
    var _c = (0, react_1.useState)([]), existingFiles = _c[0], setExistingFiles = _c[1];
    var _d = (0, react_1.useState)(false), isDragging = _d[0], setIsDragging = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(''), error = _f[0], setError = _f[1];
    var fileInputRef = (0, react_1.useRef)(null);
    var _g = (0, react_1.useState)(0), currentCredits = _g[0], setCurrentCredits = _g[1];
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
    // Fetch existing files when component mounts
    (0, react_1.useEffect)(function () {
        fetchExistingFiles();
        if (parsedUser) {
            fetchUserCredits();
            // Set up interval to fetch credits every 30 seconds
            var interval_1 = setInterval(fetchUserCredits, 30000);
            return function () { return clearInterval(interval_1); };
        }
    }, []);
    var fetchExistingFiles = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    return [4 /*yield*/, fetch("http://localhost:8080/user/".concat(parsedUser.id, "/files?page=1&limit=50"))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.success) {
                        setExistingFiles(data.files || []);
                    }
                    else {
                        setError('Failed to fetch existing files');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError('Error fetching files: ' + err_1.message);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchUserCredits = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, newCredits, error_1;
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
    var uploadFileToServer = function (file, fileId) { return __awaiter(_this, void 0, void 0, function () {
        var formData, xhr_1;
        return __generator(this, function (_a) {
            formData = new FormData();
            formData.append('file', file);
            try {
                xhr_1 = new XMLHttpRequest();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        xhr_1.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                var progress_1 = (e.loaded / e.total) * 100;
                                setUploadedFiles(function (prev) {
                                    return prev.map(function (f) { return f.id === fileId ? __assign(__assign({}, f), { progress: progress_1, status: 'uploading' }) : f; });
                                });
                            }
                        });
                        xhr_1.addEventListener('load', function () {
                            if (xhr_1.status === 200 || xhr_1.status === 201) {
                                try {
                                    var response_1 = JSON.parse(xhr_1.responseText);
                                    if (response_1.success) {
                                        setUploadedFiles(function (prev) {
                                            return prev.map(function (f) { return f.id === fileId ? __assign(__assign({}, f), { progress: 100, status: 'completed', cloudinaryUrl: response_1.file.cloudinary_url }) : f; });
                                        });
                                        // Refresh existing files list
                                        fetchExistingFiles();
                                        resolve(response_1);
                                    }
                                    else {
                                        throw new Error(response_1.message || 'Upload failed');
                                    }
                                }
                                catch (e) {
                                    reject(new Error('Invalid response format'));
                                }
                            }
                            else {
                                reject(new Error("HTTP Error: ".concat(xhr_1.status)));
                            }
                        });
                        xhr_1.addEventListener('error', function () {
                            reject(new Error('Network error'));
                        });
                        xhr_1.open('POST', "http://localhost:8080/user/".concat(parsedUser.id, "/upload"));
                        xhr_1.send(formData);
                    })];
            }
            catch (error) {
                setUploadedFiles(function (prev) {
                    return prev.map(function (f) { return f.id === fileId ? __assign(__assign({}, f), { status: 'error' }) : f; });
                });
                throw error;
            }
            return [2 /*return*/];
        });
    }); };
    var handleFileSelect = function (files) { return __awaiter(_this, void 0, void 0, function () {
        var fileArray, newFiles, processedFiles, _loop_1, _i, processedFiles_1, fileObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileArray = Array.from(files);
                    newFiles = fileArray.slice(0, remainingFiles);
                    processedFiles = newFiles.map(function (file, index) { return ({
                        id: Date.now() + index,
                        name: file.name,
                        size: formatFileSize(file.size),
                        type: file.type,
                        file: file,
                        progress: 0,
                        status: 'pending'
                    }); });
                    setUploadedFiles(function (prev) { return __spreadArray(__spreadArray([], prev, true), processedFiles, true); });
                    _loop_1 = function (fileObj) {
                        var error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, uploadFileToServer(fileObj.file, fileObj.id)];
                                case 1:
                                    _b.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _b.sent();
                                    console.error("Failed to upload ".concat(fileObj.name, ":"), error_2);
                                    setUploadedFiles(function (prev) {
                                        return prev.map(function (f) { return f.id === fileObj.id ? __assign(__assign({}, f), { status: 'error' }) : f; });
                                    });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, processedFiles_1 = processedFiles;
                    _a.label = 1;
                case 1:
                    if (!(_i < processedFiles_1.length)) return [3 /*break*/, 4];
                    fileObj = processedFiles_1[_i];
                    return [5 /*yield**/, _loop_1(fileObj)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var formatFileSize = function (bytes) {
        if (bytes === 0)
            return '0 Bytes';
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    var removeFile = function (fileId) {
        setUploadedFiles(function (prev) { return prev.filter(function (file) { return file.id !== fileId; }); });
    };
    var deleteExistingFile = function (fileId) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this file?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("http://localhost:8080/user/".concat(parsedUser.id, "/files/").concat(fileId), {
                            method: 'DELETE',
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        setExistingFiles(function (prev) { return prev.filter(function (file) { return file.id !== fileId; }); });
                    }
                    else {
                        setError('Failed to delete file');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    setError('Error deleting file: ' + error_3.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDrop = function (e) {
        e.preventDefault();
        setIsDragging(false);
        var files = e.dataTransfer.files;
        if (files.length > 0 && remainingFiles > 0) {
            handleFileSelect(files);
        }
    };
    var handleDragOver = function (e) {
        e.preventDefault();
        setIsDragging(true);
    };
    var handleDragLeave = function (e) {
        e.preventDefault();
        setIsDragging(false);
    };
    var openFileDialog = function () {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    var getFileIcon = function (type) {
        if (type.startsWith('image/'))
            return '🖼️';
        if (type.startsWith('video/'))
            return '🎥';
        if (type.startsWith('audio/'))
            return '🎵';
        if (type.includes('pdf'))
            return '📄';
        if (type.includes('document') || type.includes('word'))
            return '📝';
        if (type.includes('spreadsheet') || type.includes('excel'))
            return '📊';
        return '📁';
    };
    var formatDate = function (timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString();
    };
    var maxFiles = currentCredits;
    var remainingFiles = maxFiles - uploadedFiles.length;
    console.log('====================================');
    console.log(parsedUser.id);
    console.log('====================================');
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 max-w-6xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Upload Files" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600 text-lg", children: ["Share your files easily and securely. Maximum ", maxFiles, " files allowed per session."] })] }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "alert alert-error mb-6", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "stroke-current shrink-0 h-6 w-6", fill: "none", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), (0, jsx_runtime_1.jsx)("span", { children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setError(''); }, className: "btn btn-sm", children: "\u00D7" })] })), (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", className: "stroke-blue-600 shrink-0 w-6 h-6 mr-2", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-blue-800", children: [(0, jsx_runtime_1.jsx)("strong", { children: remainingFiles }), " file", remainingFiles !== 1 ? 's' : '', " remaining out of ", maxFiles, " maximum for this session"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer\n              ".concat(isDragging
                                ? 'border-blue-500 bg-blue-50 scale-105'
                                : remainingFiles > 0
                                    ? 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                                    : 'border-red-300 bg-red-50 cursor-not-allowed'), onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onClick: remainingFiles > 0 ? openFileDialog : undefined, children: [(0, jsx_runtime_1.jsx)("input", { ref: fileInputRef, type: "file", multiple: true, className: "hidden", onChange: function (e) { return handleFileSelect(e.target.files); }, disabled: remainingFiles === 0 }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: remainingFiles > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-10 h-10 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold mb-2", children: "Drop files here" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-4", children: "or click to browse from your device" }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center mx-auto", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Choose Files"] })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-10 h-10 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold mb-2 text-red-600", children: "Upload limit reached" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-500", children: ["You have reached the maximum of ", maxFiles, " files per session. Remove some files to upload more."] })] })] })) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-sm text-gray-400", children: "Supported formats: Images, Documents, Videos, Audio files (Max: 10MB each)" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold", children: "Current Upload Session" }), uploadedFiles.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: [uploadedFiles.length, "/", maxFiles] }))] }), uploadedFiles.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-lg border", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), (0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-gray-600", children: "No files in current session" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-2", children: "Upload files to see them listed here" })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: uploadedFiles.map(function (file) { return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl", children: getFileIcon(file.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium truncate", children: file.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [file.status === 'completed' && file.cloudinaryUrl && ((0, jsx_runtime_1.jsx)("a", { href: file.cloudinaryUrl, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:text-blue-800 text-sm", children: "View" })), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return removeFile(file.id); }, className: "text-red-500 hover:text-red-700 p-1", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-500 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { children: file.size }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs ".concat(file.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        file.status === 'uploading' ? 'bg-yellow-100 text-yellow-800' :
                                                                            file.status === 'error' ? 'bg-red-100 text-red-800' :
                                                                                'bg-gray-100 text-gray-800'), children: file.status === 'completed' ? '✓ Complete' :
                                                                        file.status === 'uploading' ? 'Uploading...' :
                                                                            file.status === 'error' ? '✗ Error' :
                                                                                'Pending' })] }), file.status !== 'pending' && ((0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full transition-all duration-300 ".concat(file.status === 'completed' ? 'bg-green-500' :
                                                                    file.status === 'error' ? 'bg-red-500' :
                                                                        'bg-yellow-500'), style: { width: "".concat(file.progress, "%") } }) }))] })] }) }) }, file.id)); }) }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold", children: "Your Uploaded Files" }), (0, jsx_runtime_1.jsxs)("button", { onClick: fetchExistingFiles, className: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center", disabled: loading, children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), loading ? 'Loading...' : 'Refresh'] })] }), existingFiles.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-lg border", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }) }), (0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-gray-600", children: "No files uploaded yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-2", children: "Your uploaded files will appear here" })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: existingFiles.map(function (file) { return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: getFileIcon(file.mime_type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium truncate mb-1", children: file.original_name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500 space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { children: formatFileSize(file.size) }), (0, jsx_runtime_1.jsxs)("p", { children: ["Uploaded: ", formatDate(file.created_at)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)("a", { href: file.cloudinary_url, target: "_blank", rel: "noopener noreferrer", className: "bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200", children: "View" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return deleteExistingFile(file.id); }, className: "bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200", children: "Delete" })] })] })] }) }) }, file.id)); }) }))] })] }));
}
exports.default = UploadFiles;
//# sourceMappingURL=UploadFiles.js.map