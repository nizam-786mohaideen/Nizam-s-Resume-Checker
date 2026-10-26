import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { HttpError, maxResumePages, maxResumeTextLength } from "../utils.js";

export async function extractPdfText(buffer) {
  const loadingTask = getDocument({ data: new Uint8Array(buffer) });

  try {
    const document = await loadingTask.promise;
    if (document.numPages > maxResumePages) {
      throw new HttpError(400, `The resume must have ${maxResumePages} pages or fewer.`);
    }

    const pages = [];
    let characterCount = 0;

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const { items } = await page.getTextContent();
      const pageText = items.map((item) => item.str).filter(Boolean).join(" ");
      const remainingCharacters = maxResumeTextLength - characterCount;

      if (remainingCharacters > 0) {
        pages.push(pageText.slice(0, remainingCharacters));
        characterCount += Math.min(pageText.length, remainingCharacters);
      }

      page.cleanup();
    }

    const text = pages.join("\n").trim();
    if (!text) {
      throw new HttpError(422, "We could not read text from this PDF. Scanned resumes are not supported yet.");
    }

    return text;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "We could not read this PDF. Please try another resume file.");
  } finally {
    await loadingTask.destroy().catch(() => {});
  }
}
