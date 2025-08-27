import { DocumentForm } from "@/components/document-form";
import { getDocumentById, getTemplates } from "@/lib/data";
import { notFound, redirect } from "next/navigation";

export default async function EditDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const [document, templates] = await Promise.all([
    getDocumentById(params.id),
    getTemplates(),
  ]);

  if (!document) {
    notFound();
  }

  if (document.status !== 'Draft') {
    // Redirect to the view page if the document is not a draft
    redirect(`/documents/${document.id}`);
  }

  return (
    <div>
      <DocumentForm document={document} templates={templates} />
    </div>
  );
}
