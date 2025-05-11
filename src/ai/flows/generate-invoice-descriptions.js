'use server';
/**
 * @fileOverview Flow to generate invoice descriptions.
 * - generateInvoiceDescriptions - Generates an invoice description.
 * - GenerateInvoiceInput - Input type.
 * - GenerateInvoiceOutput - Output type.
 */
import { ai } from '@/ai/config.js'; // Updated import
import { z } from 'zod'; // genkit/zod is usually for internal genkit schemas, app-level zod is fine.

const GenerateInvoiceInputSchema = z.object({
  invoiceType: z.enum(['semesterFees', 'hostelDues']).describe('The type of invoice for which to generate a description.'),
  semester: z.string().optional().describe('The semester (e.g., "Spring", "Fall") if applicable.'),
  month: z.string().optional().describe('The month (e.g., "January", "July") if applicable.'),
  year: z.string().describe('The year (e.g., "2024").'),
});
export const GenerateInvoiceInput = GenerateInvoiceInputSchema; // Correctly export type or schema

const GenerateInvoiceOutputSchema = z.object({
  description: z.string().describe('The generated invoice description line item.'),
});
export const GenerateInvoiceOutput = GenerateInvoiceOutputSchema; // Correctly export type or schema

const invoicePrompt = ai.definePrompt({
  name: 'invoiceDescriptionPrompt',
  input: { schema: GenerateInvoiceInputSchema },
  output: { schema: GenerateInvoiceOutputSchema },
  prompt: `Generate a concise and professional invoice line item description for {{invoiceType}}.
  {{#if semester}}The invoice is for the {{semester}} semester.{{/if}}
  {{#if month}}The invoice is for the month of {{month}}.{{/if}}
  The year is {{year}}.
  The description should be suitable for a university invoice. Example: "Semester Fees - Fall 2024" or "Hostel Dues - January 2024".
  Do not include amounts, quantities, or student names. Only the description.`,
  config: {
    model: 'googleai/gemini-pro', // Specify model here
    temperature: 0.3,
  }
});

export const generateInvoiceDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateInvoiceDescriptionsFlow',
    inputSchema: GenerateInvoiceInputSchema,
    outputSchema: GenerateInvoiceOutputSchema,
  },
  async (input) => {
    console.log('Generating invoice description with input:', input);
    try {
      const { output } = await invoicePrompt(input);
      if (!output) {
        throw new Error('AI did not return an output for invoice description.');
      }
      console.log('AI output for invoice description:', output);
      return output;
    } catch (error) {
      console.error("Error in generateInvoiceDescriptionsFlow:", error);
      // Fallback or re-throw depending on desired error handling
      // For now, returning a generic description on error.
      return { description: `Generic ${input.invoiceType} for ${input.year}` };
    }
  }
);

// Wrapper function
export async function generateInvoiceDescriptions(input) {
  return await generateInvoiceDescriptionsFlow(input);
}
