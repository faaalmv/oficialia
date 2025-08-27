"use server"

import { addDocument, deleteDocument, updateDocument } from "@/lib/data";
import { Document, DocumentStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const DocumentSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  status: z.enum(["Draft", "Sent", "Received/Acknowledged", "Archived"]),
  attachmentName: z.string().optional(),
});

export async function createDocument(formData: FormData) {
  const validatedFields = DocumentSchema.safeParse({
    recipient: formData.get("recipient"),
    title: formData.get("title"),
    body: formData.get("body"),
    status: formData.get("status"),
    attachmentName: formData.get("attachmentName")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { attachmentName, ...docData } = validatedFields.data;

  const documentPayload: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'> = {
    ...docData,
    status: docData.status as DocumentStatus,
  }

  if (attachmentName) {
    documentPayload.attachment = { name: attachmentName, url: '#' };
  }

  await addDocument(documentPayload);

  revalidatePath("/documents");
  revalidatePath("/dashboard");
}


export async function updateDocumentAction(id: string, formData: FormData) {
  const validatedFields = DocumentSchema.safeParse({
    recipient: formData.get("recipient"),
    title: formData.get("title"),
    body: formData.get("body"),
    status: formData.get("status"),
    attachmentName: formData.get("attachmentName")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { attachmentName, ...docData } = validatedFields.data;

  const documentPayload: Partial<Omit<Document, 'id'|'createdAt'>> = {
    ...docData,
    status: docData.status as DocumentStatus,
  }

  if (attachmentName) {
    documentPayload.attachment = { name: attachmentName, url: '#' };
  } else {
    documentPayload.attachment = undefined;
  }
  
  await updateDocument(id, documentPayload);

  revalidatePath(`/documents`);
  revalidatePath(`/documents/${id}`);
  revalidatePath('/dashboard');
}

export async function deleteDocumentAction(id: string) {
    await deleteDocument(id);
    revalidatePath('/documents');
    revalidatePath('/dashboard');
}
