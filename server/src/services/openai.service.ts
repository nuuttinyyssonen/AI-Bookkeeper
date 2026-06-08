import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const parseReceiptData = async (rawText: string, categoryTypes: string[], receiptType: string) => {
    const incomeCategories = ['MYYNTI_TUOTTEET', 'MYYNTI_PALVELUT', 'MUUT_TULOT'];
    
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

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error("No response from OpenAI");
    }

    return JSON.parse(content);
};