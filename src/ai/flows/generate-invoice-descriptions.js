'use server';
/**
 * @fileOverview Flow to generate invoice descriptions.
 * This module exports a single server action:
 * - generateInvoiceDescriptions: An asynchronous function that takes invoice details and returns a generated description.
 *   The input should conform to an internal schema expecting:
 *     invoiceType: 'semesterFees' | 'hostelDues'
 *     semester?: string (e.g., "Spring", "Fall")
 *     month?: string (e.g., "January", "July")
 *     year: string (e.g., "2024")
 *   The output will be a Promise resolving to an object with a 'description' string property,
 *   e.g., { description: "Semester Fees - Fall 2024" }.
 */
import { ai } from '@/ai/config.js';
import { z } from 'zod';

// Define Zod schemas locally - they are not exported from this 'use server' module.
const GenerateInvoiceInputSchema = z.object({
  invoiceType: z.enum(['semesterFees', 'hostelDues']).describe('The type of invoice for which to generate a description.'),
  semester: z.string().optional().describe('The semester (e.g., "Spring", "Fall") if applicable.'),
  month: z.string().optional().describe('The month (e.g., "January", "July") if applicable.'),
  year: z.string().describe('The year (e.g., "2024").'),
});
// For documentation: type GenerateInvoiceInput = z.infer<typeof GenerateInvoiceInputSchema>;

const GenerateInvoiceOutputSchema = z.object({
  description: z.string().describe('The generated invoice description line item.'),
});
// For documentation: type GenerateInvoiceOutput = z.infer<typeof GenerateInvoiceOutputSchema>;

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

// Define the flow locally - it's not exported from this 'use server' module.
const generateInvoiceDescriptionsFlow = ai.defineFlow(
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
        // This case should ideally be handled by making the output schema more robust
        // or by instructing the LLM to always return a specific structure even on failure.
        // For now, we'll throw an error that will be caught below.
        console.warn('AI did not return an output for invoice description. Input was:', input);
        throw new Error('AI did not return an output for invoice description.');
      }
      console.log('AI output for invoice description:', output);
      return output;
    } catch (error) {
      console.error("Error in generateInvoiceDescriptionsFlow:", error);
      // Fallback or re-throw depending on desired error handling
      // For now, returning a generic description on error, which is safer for the UI.
      const typeText = input.invoiceType === 'semesterFees' ? 'Semester Fees' : 'Hostel Dues';
      let periodText = '';
      if (input.month && input.invoiceType === 'hostelDues') {
        periodText = `${input.month} ${input.year}`;
      } else if (input.semester && input.invoiceType === 'semesterFees') {
        periodText = `${input.semester} ${input.year}`;
      } else {
        periodText = input.year;
      }
      return { description: `Failed to generate description for ${typeText} - ${periodText}. Please enter manually.` };
    }
  }
);

// Export ONLY the async wrapper function.
// This function is a Server Action.
export async function generateInvoiceDescriptions(input) {
  // Input validation can be done here if needed, though Genkit flow will also validate.
  // const validationResult = GenerateInvoiceInputSchema.safeParse(input);
  // if (!validationResult.success) {
  //   console.error("Invalid input for generateInvoiceDescriptions:", validationResult.error.flatten());
  //   throw new Error("Invalid input provided for invoice description generation.");
  // }
  return await generateInvoiceDescriptionsFlow(input);
}
