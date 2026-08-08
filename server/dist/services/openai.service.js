"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReceiptData = exports.generateChatTitle = exports.generateChatResponse = void 0;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
// Function for generating AI assistance response
const generateChatResponse = async (message, history, stream) => {
    const messages = [
        {
            role: "system",
            content: `You are an expert AI accounting assistant for Finnish small businesses. 
            You help users understand their bookkeeping, VAT calculations and financial reports.
            Always respond in the same language the user writes in (Finnish or English).
            Be concise and practical.
            Do not use markdown formatting such as bold (**), headers (#), or bullet symbols. 
            Write in plain text only. Use numbered lists sparingly and only when steps are truly sequential.`
        },
        ...history.map(msg => ({
            role: msg.role === "USER" ? "user" : "assistant",
            content: msg.content
        })),
        {
            role: "user",
            content: message
        }
    ];
    return await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 1000,
        stream: true
    });
};
exports.generateChatResponse = generateChatResponse;
// For generating the title
const generateChatTitle = async (message) => {
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Generate a short 3-5 word title for a chat that starts with this message. Return only the title, nothing else."
            },
            {
                role: "user",
                content: message
            }
        ],
        max_tokens: 20,
    });
    return response.choices[0].message.content ?? "Uusi chat";
};
exports.generateChatTitle = generateChatTitle;
// Service function to parse receipt data using OpenAI's GPT-4.0 model
const parseReceiptData = async (rawText, categoryTypes, receiptType) => {
    // Define income categories for filtering based on receipt type
    const incomeCategories = ['MYYNTI_TUOTTEET', 'MYYNTI_PALVELUT', 'MUUT_TULOT'];
    // Filter categories based on receipt type (INCOME or EXPENSE)
    const filteredCategories = receiptType === 'INCOME'
        ? categoryTypes.filter(c => incomeCategories.includes(c))
        : categoryTypes.filter(c => !incomeCategories.includes(c));
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are an expert at parsing receipt data. 
                Extract the following information from the receipt text and return it as valid JSON only, no markdown, no extra text.
                Return this exact structure:
                {
                    "vendor": "string",
                    "date": "YYYY-MM-DD",
                    "total": number,
                    "currency": "EUR",
                    "category": "string (pick exactly one from: ${filteredCategories.join(', ')})",
                    "vat": [{ "rate": number, "net": number, "vat_amount": number, "total": number }],
                    "items": [{ "name": "string", "price": number }]
                }
                If a field cannot be found, use null.`
            },
            {
                role: "user",
                content: rawText
            }
        ],
        response_format: { type: "json_object" }
    });
    // Extract the content from the response and parse it as JSON
    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error("No response from OpenAI");
    }
    return JSON.parse(content);
};
exports.parseReceiptData = parseReceiptData;
