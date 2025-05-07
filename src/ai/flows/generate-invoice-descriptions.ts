// src/ai/flows/generate-invoice-descriptions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically generating descriptions for invoices, specifically for semester fees and monthly hostel dues.
 *
 * - generateInvoiceDescriptions - A function that generates invoice descriptions.
 * - GenerateInvoiceDescriptionsInput - The input type for the generateInvoiceDescriptions function.
 * - GenerateInvoiceDescriptionsOutput - The return type for the generateInvoiceDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInvoiceDescriptionsInputSchema = z.object({
  invoiceType: z
    .enum(['semesterFees', 'hostelDues'])
    .describe('The type of invoice to generate a description for.'),
  semester: z.string().optional().describe('The semester for which the fees are being charged.'),
  month: z.string().optional().describe('The month for which the hostel dues are being charged.'),
  year: z.string().describe('The year for which the invoice is being generated.'),
});
export type GenerateInvoiceDescriptionsInput = z.infer<typeof GenerateInvoiceDescriptionsInputSchema>;

const GenerateInvoiceDescriptionsOutputSchema = z.object({
  description: z.string().describe('A detailed description of the invoice item.'),
});
export type GenerateInvoiceDescriptionsOutput = z.infer<typeof GenerateInvoiceDescriptionsOutputSchema>;

export async function generateInvoiceDescriptions(input: GenerateInvoiceDescriptionsInput): Promise<GenerateInvoiceDescriptionsOutput> {
  return generateInvoiceDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvoiceDescriptionsPrompt',
  input: {schema: GenerateInvoiceDescriptionsInputSchema},
  output: {schema: GenerateInvoiceDescriptionsOutputSchema},
  prompt: `You are an expert at generating descriptions for university invoices.

  Based on the invoice type ({{invoiceType}}), semester ({{semester}}), month ({{month}}), and year ({{year}}), create a concise and informative description for the invoice item.

  If the invoice type is 'semesterFees', include the semester and year in the description.
  If the invoice type is 'hostelDues', include the month and year in the description.

  Example for semester fees: "Semester Fees for Fall 2024"
  Example for hostel dues: "Hostel Dues for October 2024"

  Description:`, // Ensure this is valid Handlebars
});

const generateInvoiceDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateInvoiceDescriptionsFlow',
    inputSchema: GenerateInvoiceDescriptionsInputSchema,
    outputSchema: GenerateInvoiceDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
