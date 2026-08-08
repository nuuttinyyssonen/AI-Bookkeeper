"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ocr_service_1 = require("../../services/ocr.service");
describe("analyzeReceipt", () => {
    let mockClient;
    beforeEach(() => {
        mockClient = {
            textDetection: jest.fn()
        };
    });
    it("returns OCR text and confidence", async () => {
        mockClient.textDetection.mockResolvedValue([
            {
                textAnnotations: [
                    {
                        description: "K-Market\nMaito 1.99"
                    }
                ],
                fullTextAnnotation: {
                    pages: [
                        {
                            confidence: 0.95
                        }
                    ]
                }
            }
        ]);
        const buffer = Buffer.from("image-data");
        const result = await (0, ocr_service_1.analyzeReceipt)(buffer, "image/png", mockClient);
        expect(mockClient.textDetection).toHaveBeenCalledWith({
            image: {
                content: buffer.toString("base64")
            }
        });
        expect(result).toEqual({
            fullText: "K-Market\nMaito 1.99",
            confidence: 0.95
        });
    });
    it("returns undefined confidence when confidence is missing", async () => {
        mockClient.textDetection.mockResolvedValue([
            {
                textAnnotations: [
                    {
                        description: "Receipt text"
                    }
                ]
            }
        ]);
        const result = await (0, ocr_service_1.analyzeReceipt)(Buffer.from("image"), undefined, mockClient);
        expect(result).toEqual({
            fullText: "Receipt text",
            confidence: undefined
        });
    });
    it("throws when no text is detected", async () => {
        mockClient.textDetection.mockResolvedValue([
            {
                textAnnotations: []
            }
        ]);
        await expect((0, ocr_service_1.analyzeReceipt)(Buffer.from("image"), undefined, mockClient)).rejects.toThrow("No text detected in image");
    });
    it("throws when textAnnotations is undefined", async () => {
        mockClient.textDetection.mockResolvedValue([
            {}
        ]);
        await expect((0, ocr_service_1.analyzeReceipt)(Buffer.from("image"), undefined, mockClient)).rejects.toThrow("No text detected in image");
    });
    it("uses empty string when description is missing", async () => {
        mockClient.textDetection.mockResolvedValue([
            {
                textAnnotations: [{}]
            }
        ]);
        const result = await (0, ocr_service_1.analyzeReceipt)(Buffer.from("image"), undefined, mockClient);
        expect(result).toEqual({
            fullText: "",
            confidence: undefined
        });
    });
});
