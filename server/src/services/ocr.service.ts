import vision from "@google-cloud/vision";
import { pdf } from "pdf-to-img";

const client = new vision.ImageAnnotatorClient();

// Convert PDF buffer to image buffer using pdf-to-img library
const convertPdfToImage = async (buffer: Buffer): Promise<Buffer> => {
    const document = await pdf(buffer, { scale: 2 });
    const firstPage = await document.getPage(1);
    return firstPage;
};

// OCR service function to analyze receipt image and extract text using Google Cloud Vision API
export const analyzeReceipt = async (
    fileBuffer: Buffer,
    mimeType?: string,
    imageClient = client
) => {
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