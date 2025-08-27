import { DocumentForm } from "@/components/document-form";
import { getTemplates } from "@/lib/data";

export default async function NewDocumentPage() {
  const templates = await getTemplates();

  return (
    <div>
      <DocumentForm templates={templates} />
    </div>
  );
}
