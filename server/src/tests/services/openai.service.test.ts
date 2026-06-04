import { parseReceiptData } from "../../services/openai.service";
import OpenAI from "openai";

// Mock OpenAI
jest.mock("openai");

const mockOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;

describe("parseReceiptData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Valid JSON structure", () => {
        it("should return correct JSON structure with all fields", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: "Supermarket ABC",
                                date: "2025-06-04",
                                total: 45.99,
                                currency: "EUR",
                                vat: [
                                    {
                                        rate: 0.24,
                                        net: 37.09,
                                        vat_amount: 8.9,
                                        total: 45.99
                                    }
                                ],
                                items: [
                                    { name: "Milk", price: 2.99 },
                                    { name: "Bread", price: 3.50 }
                                ]
                            })
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            const result = await parseReceiptData("Receipt text here");

            expect(result).toEqual({
                vendor: "Supermarket ABC",
                date: "2025-06-04",
                total: 45.99,
                currency: "EUR",
                vat: [
                    {
                        rate: 0.24,
                        net: 37.09,
                        vat_amount: 8.9,
                        total: 45.99
                    }
                ],
                items: [
                    { name: "Milk", price: 2.99 },
                    { name: "Bread", price: 3.50 }
                ]
            });
        });

        it("should correctly parse VAT array with multiple entries", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: "Restaurant XYZ",
                                date: "2025-06-03",
                                total: 100.00,
                                currency: "EUR",
                                vat: [
                                    {
                                        rate: 0.10,
                                        net: 50.00,
                                        vat_amount: 5.00,
                                        total: 55.00
                                    },
                                    {
                                        rate: 0.24,
                                        net: 35.00,
                                        vat_amount: 8.40,
                                        total: 43.40
                                    }
                                ],
                                items: []
                            })
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            const result = await parseReceiptData("Receipt with multiple VAT rates");

            expect(result.vat).toHaveLength(2);
            expect(result.vat[0].rate).toBe(0.10);
            expect(result.vat[1].rate).toBe(0.24);
        });
    });

    describe("Missing fields return null", () => {
        it("should return null for missing vendor field", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: null,
                                date: "2025-06-04",
                                total: 25.50,
                                currency: "EUR",
                                vat: [],
                                items: []
                            })
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            const result = await parseReceiptData("Unclear receipt");

            expect(result.vendor).toBeNull();
        });

        it("should return null for missing date field", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: "Store",
                                date: null,
                                total: 25.50,
                                currency: "EUR",
                                vat: [],
                                items: []
                            })
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            const result = await parseReceiptData("Receipt without date");

            expect(result.date).toBeNull();
        });

        it("should return null for missing total field", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: "Store",
                                date: "2025-06-04",
                                total: null,
                                currency: "EUR",
                                vat: [],
                                items: []
                            })
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            const result = await parseReceiptData("Receipt without total");

            expect(result.total).toBeNull();
        });

        it("should return empty arrays for missing VAT and items", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: "Simple Store",
                                date: "2025-06-04",
                                total: 10.00,
                                currency: "EUR",
                                vat: [],
                                items: []
                            })
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            const result = await parseReceiptData("Receipt without details");

            expect(result.vat).toEqual([]);
            expect(result.items).toEqual([]);
        });

        it("should handle partial data with some null fields", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: "Store",
                                date: null,
                                total: 99.99,
                                currency: "EUR",
                                vat: null,
                                items: null
                            })
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            const result = await parseReceiptData("Partial receipt");

            expect(result.vendor).toBe("Store");
            expect(result.date).toBeNull();
            expect(result.total).toBe(99.99);
            expect(result.vat).toBeNull();
            expect(result.items).toBeNull();
        });
    });

    describe("Error handling", () => {
        it("should throw error when OpenAI returns no content", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: null
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            await expect(parseReceiptData("Receipt")).rejects.toThrow("No response from OpenAI");
        });

        it("should throw error when OpenAI API call fails", async () => {
            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockRejectedValue(new Error("API Error"))
                }
            } as any;

            await expect(parseReceiptData("Receipt")).rejects.toThrow("API Error");
        });

        it("should throw error when response is invalid JSON", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: "Invalid JSON {invalid"
                        }
                    }
                ]
            };

            mockOpenAI.prototype.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue(mockResponse)
                }
            } as any;

            await expect(parseReceiptData("Receipt")).rejects.toThrow();
        });
    });

    describe("API call verification", () => {
        it("should call OpenAI API with correct model", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: null,
                                date: null,
                                total: null,
                                currency: "EUR",
                                vat: [],
                                items: []
                            })
                        }
                    }
                ]
            };

            const mockCreate = jest.fn().mockResolvedValue(mockResponse);
            mockOpenAI.prototype.chat = {
                completions: {
                    create: mockCreate
                }
            } as any;

            await parseReceiptData("Receipt text");

            expect(mockCreate).toHaveBeenCalledWith({
                model: "gpt-4o-mini",
                messages: expect.any(Array),
                response_format: { type: "json_object" }
            });
        });

        it("should pass receipt text in user message", async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                vendor: null,
                                date: null,
                                total: null,
                                currency: "EUR",
                                vat: [],
                                items: []
                            })
                        }
                    }
                ]
            };

            const mockCreate = jest.fn().mockResolvedValue(mockResponse);
            mockOpenAI.prototype.chat = {
                completions: {
                    create: mockCreate
                }
            } as any;

            const receiptText = "Some receipt text";
            await parseReceiptData(receiptText);

            const calls = mockCreate.mock.calls[0];
            const messages = calls[0].messages;
            const userMessage = messages.find((msg: any) => msg.role === "user");

            expect(userMessage.content).toBe(receiptText);
        });
    });
});
