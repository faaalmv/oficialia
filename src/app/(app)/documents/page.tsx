import { getDocuments } from "@/lib/data";
import { DocumentTableClient } from "@/components/document-table-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Documents</CardTitle>
        <CardDescription>
          Browse, search, and manage all official documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentTableClient documents={documents} />
      </CardContent>
    </Card>
  );
}
