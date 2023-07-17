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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.uploadFile = void 0;
var axios_1 = require("axios");
var cross_fetch_1 = require("cross-fetch");
var fs = require("fs");
var FormData = require("form-data");
var USERNAME = "hector.sanchez.service@nrccua.org";
var PASSWORD = "BG39wBxZi8DW!7YS";
var ORGANIZATION_UID = "0ec47cfc-a5cd-4dc8-b27b-3fca9f393d8f";
var URL = "https://api-encoura-alpha-stg.enc-np.com/v1";
function authenticate() {
    return __awaiter(this, void 0, void 0, function () {
        var authUrl, authPayload, authResponse, authData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authUrl = "".concat(URL, "/login");
                    authPayload = {
                        userName: USERNAME,
                        password: PASSWORD,
                        acceptedTerms: true,
                    };
                    return [4 /*yield*/, (0, cross_fetch_1.default)(authUrl, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(authPayload),
                        })];
                case 1:
                    authResponse = _a.sent();
                    if (!(authResponse.status === 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, authResponse.json()];
                case 2:
                    authData = (_a.sent());
                    return [2 /*return*/, authData.sessionToken];
                case 3: throw new Error("Authentication failed.");
            }
        });
    });
}
function getPreSignedData(authToken, fileType, fileName, fileDescription, originalFileName) {
    return __awaiter(this, void 0, void 0, function () {
        var uploadUrl, uploadHeaders, uploadPayload, uploadDetails, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uploadUrl = "".concat(URL, "/files/upload");
                    uploadHeaders = {
                        Authorization: "JWT ".concat(authToken),
                        Organization: ORGANIZATION_UID,
                    };
                    uploadPayload = {
                        fileName: fileName,
                        productType: fileType,
                        fileDescription: fileDescription,
                        originalFileName: originalFileName,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post(uploadUrl, uploadPayload, {
                            headers: uploadHeaders,
                        })];
                case 2:
                    uploadDetails = _a.sent();
                    if (uploadDetails.status === 200) {
                        return [2 /*return*/, uploadDetails.data];
                    }
                    else {
                        throw new Error("Failed to get upload details.");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    throw new Error("Failed to get upload details.");
                case 4: return [2 /*return*/];
            }
        });
    });
}
function uploadFile(fileType, filePath, fileName, fileDescription, originalFileName) {
    return __awaiter(this, void 0, void 0, function () {
        var authToken, preSignedData, url, fields, fileData, formData_1, uploadResponse, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, authenticate()];
                case 1:
                    authToken = _a.sent();
                    return [4 /*yield*/, getPreSignedData(authToken, fileType, fileName, fileDescription, originalFileName)];
                case 2:
                    preSignedData = _a.sent();
                    url = preSignedData.url, fields = preSignedData.fields;
                    fileData = fs.readFileSync(filePath);
                    formData_1 = new FormData();
                    // Append the pre-signed fields data
                    Object.entries(fields).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        formData_1.append(key, String(value));
                    });
                    // Append fileData
                    formData_1.append("file", fileData);
                    return [4 /*yield*/, axios_1.default.post(url, formData_1, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })];
                case 3:
                    uploadResponse = _a.sent();
                    if (uploadResponse.status === 204) {
                        console.log("File uploaded successfully.");
                    }
                    else {
                        console.log("Failed to upload file. Status code:", uploadResponse.status);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.log("Error:", error_2.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.uploadFile = uploadFile;
