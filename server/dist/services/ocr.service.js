"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeReceipt = void 0;
const vision_1 = __importDefault(require("@google-cloud/vision"));
const pdf_to_img_1 = require("pdf-to-img");
const client = new vision_1.default.ImageAnnotatorClient();
// Convert PDF buffer to image buffer using pdf-to-img library
const convertPdfToImage = async (buffer) => {
    const document = await (0, pdf_to_img_1.pdf)(buffer, { scale: 2 });
    const firstPage = await document.getPage(1);
    return firstPage;
};
// OCR service function to analyze receipt image and extract text using Google Cloud Vision API
const analyzeReceipt = async (fileBuffer, mimeType, imageClient = client) => {
    let buffer = fileBuffer;
    // If the file is a PDF, convert it to an image before performing OCR
    if (mimeType === "application/pdf") {
        buffer = await convertPdfToImage(fileBuffer);
    }
    // Perform text detection on the image buffer
    const [result] = await imageClient.textDetection({
        image: { content: buffer.toString("base64") }
    });
    const detections = result.textAnnotations;
    // If no text is detected, throw an error
    if (!detections || detections.length === 0) {
        throw new Error("No text detected in image");
    }
    const fullText = detections[0].description || "";
    return {
        fullText,
        confidence: result.fullTextAnnotation?.pages?.[0]?.confidence
    };
};
exports.analyzeReceipt = analyzeReceipt;
