import { analyzeReceipt } from "../src/services/ocr.service";
import { parseReceiptData } from "../src/services/openai.service";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const buffer = fs.readFileSync("src/tests/fixtures/test.pdf");
    
    const { fullText } = await analyzeReceipt(buffer, "application/pdf");
    console.log("Raw text:", fullText);
    
    const parsed = await parseReceiptData(fullText);
    console.log("Parsed data:", JSON.stringify(parsed, null, 2));
}

main().catch(console.error);