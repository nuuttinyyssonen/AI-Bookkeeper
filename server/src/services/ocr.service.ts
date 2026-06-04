import vision from "@google-cloud/vision";
import { pdf } from "pdf-to-img";

const client = new vision.ImageAnnotatorClient();

const convertPdfToImage = async (buffer: Buffer): Promise<Buffer> => {
    const document = await pdf(buffer, { scale: 2 });
    const firstPage = await document.getPage(1);
    return firstPage;
};

export const analyzeReceipt = async (
    fileBuffer: Buffer,
    mimeType?: string,
    imageClient = client
) => {
    let buffer = fileBuffer;

    if (mimeType === "application/pdf") {
        buffer = await convertPdfToImage(fileBuffer);
    }

    const [result] = await imageClient.textDetection({
        image: { content: buffer.toString("base64") }
    });

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
        throw new Error("No text detected in image");
    }

    const fullText = detections[0].description || "";

    return {
        fullText,
        confidence: result.fullTextAnnotation?.pages?.[0]?.confidence
    };
};