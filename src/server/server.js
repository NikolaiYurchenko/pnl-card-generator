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
        while (_) try {
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
exports.__esModule = true;
var express_1 = require("express");
var canvas_1 = require("canvas");
var cors_1 = require("cors");
var path_1 = require("path");
var app = express_1["default"]();
var PORT = 3000;
app.use(cors_1["default"]());
app.use(express_1["default"].json());
// Register custom font (Akira)
canvas_1.registerFont(path_1["default"].join(__dirname, "src/assets/fonts/Akira/Akira.otf"), { family: "Akira" });
var THOUSAND = 1000;
// Function to format numbers like in CSS logic
var formatToString = function (val) {
    var value = val;
    if (val >= THOUSAND || val <= -THOUSAND) {
        value = Math.trunc(val);
    }
    return "" + (val < 0 ? "" : "+") + Number(value).toLocaleString("en-US");
};
// Function to dynamically calculate font size based on text length
var getNameFontSize = function (name) {
    var config = {
        maxSize: 120,
        minSize: 10,
        letterSpacing: 0.5
    };
    var containerWidth = 567;
    var nameLength = name.length; // Fixed incorrect reference
    if (nameLength < 5) {
        return config.maxSize + "px";
    }
    var spacingInPixels = config.letterSpacing * 16 * (nameLength - 2);
    var fontSize = Math.max(config.minSize, Math.min(config.maxSize, (containerWidth - spacingInPixels) / (nameLength * 1.2)));
    return fontSize + "px";
};
// Endpoint to generate styled PNG image
app.post("/generate-image", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, pnlSol, pnlUsd, returnValue, investedSol, width, height, canvas, ctx, bgImagePath, bgImage, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, pnlSol = _a.pnlSol, pnlUsd = _a.pnlUsd, returnValue = _a["return"], investedSol = _a.investedSol;
                width = 1900;
                height = 1042;
                canvas = canvas_1.createCanvas(width, height);
                ctx = canvas.getContext("2d");
                bgImagePath = pnlSol < 0
                    ? path_1["default"].join(__dirname, "src/assets/images/template-negative.png")
                    : path_1["default"].join(__dirname, "src/assets/images/template-positive.png");
                return [4 /*yield*/, canvas_1.loadImage(bgImagePath)];
            case 1:
                bgImage = _b.sent();
                ctx.drawImage(bgImage, 0, 0, width, height);
                // Token Name
                ctx.fillStyle = "white";
                ctx.font = getNameFontSize(name_1) + " Akira, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(name_1.toUpperCase(), 400, 468);
                // PNL SOL
                ctx.fillStyle = pnlSol < 0 ? "rgba(251, 40, 40, 1)" : "rgba(15, 255, 75, 1)";
                ctx.font = "110px Akira, sans-serif";
                ctx.shadowColor = pnlSol < 0 ? "rgba(251, 40, 40, 0.5)" : "rgba(15, 255, 75, 0.5)";
                ctx.shadowBlur = 35;
                ctx.fillText(formatToString(pnlSol), 1700, 254);
                // Reset shadow
                ctx.shadowColor = "transparent";
                // PNL USD
                ctx.fillStyle = "white";
                ctx.font = "50px Akira, sans-serif";
                ctx.fillText(formatToString(pnlUsd), 1640, 407);
                // Return Percentage
                ctx.fillText(formatToString(returnValue) + "%", 1819, 709);
                // Invested SOL
                ctx.font = "56px Akira";
                ctx.fillText(investedSol.toString(), 1750, 968);
                // Convert to PNG and send response
                res.setHeader("Content-Type", "image/png");
                canvas.createPNGStream().pipe(res);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Error generating image:", error_1);
                res.status(500).send("Failed to generate image");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () { return console.log("Server running on http://localhost:" + PORT); });
