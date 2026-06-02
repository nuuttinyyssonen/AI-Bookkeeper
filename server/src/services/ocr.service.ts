import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export const analyzeReceipt = async (fileBuffer: Buffer): Promise<any> => {
    const [result] = await client.textDetection({
        image: { content: fileBuffer.toString("base64") }
    });

    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
        throw new Error("No text detected in image");
    }

    // Full text from receipt
    const fullText = detections[0].description || "";

    return {
        fullText,
        confidence: result.fullTextAnnotation?.pages?.[0]?.confidence
    };
};