import { getDocumentById } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  Calendar,
  User,
  Paperclip,
  Clock,
  Printer,
  Edit
} from "lucide-react";
import { DocumentStatus } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

const statusColors: { [key in DocumentStatus]: "default" | "secondary" | "success" | "outline" } = {
  Draft: "secondary",
  Sent: "default",
  "Received/Acknowledged": "success",
  Archived: "outline",
};

export default async function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const document = await getDocumentById(params.id);

  if (!document) {
    notFound();
  }

  const handlePrint = () => {
    // This will be a client component action
    'use client';
    window.print();
  }

  return (
      <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <h1 className="text-2xl font-bold font-headline">{document.title}</h1>
                  <p className="text-muted-foreground">Document ID: {document.id}</p>
              </div>
              <div className="flex gap-2 print:hidden">
                  {document.status === 'Draft' && (
                      <Link href={`/documents/${document.id}/edit`} legacyBehavior>
                          <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                      </Link>
                  )}
                  <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print / Save PDF</Button>
              </div>
          </div>
          <div className="printable-area bg-white">
              <div className="print:block hidden p-4 border-b">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-primary">
                          <FileText className="h-6 w-6" />
                          <span>OfiTrack - CAA ALMV</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString()}
                      </div>
                  </div>
              </div>
              <Card className="border-0 shadow-none print:border-0 print:shadow-none">
                  <CardHeader>
                      <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">{document.title}</CardTitle>
                          <Badge variant={statusColors[document.status]} className="text-sm px-3 py-1">{document.status}</Badge>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <strong>Recipient:</strong>
                          <span>{document.recipient}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <strong>Created:</strong>
                          <span>{new Date(document.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <strong>Updated:</strong>
                          <span>{new Date(document.updatedAt).toLocaleString()}</span>
                      </div>
                  </div>
                  <Separator />
                  <div>
                      <h3 className="font-semibold mb-2">Document Body</h3>
                      <p className="whitespace-pre-wrap text-foreground/90">{document.body}</p>
                  </div>

                  {document.attachment && (
                      <div>
                          <Separator />
                          <h3 className="font-semibold my-4">Attachment</h3>
                          <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <a href={document.attachment.url} className="text-primary hover:underline">
                              {document.attachment.name}
                          </a>
                          </div>
                      </div>
                  )}

                  <div>
                      <Separator />
                      <h3 className="font-semibold my-4">Status History</h3>
                      <ul className="space-y-2">
                          {document.statusHistory.map((history, index) => (
                          <li key={index} className="flex items-center gap-3">
                              <Badge variant={statusColors[history.status]}>{history.status}</Badge>
                              <span className="text-sm text-muted-foreground">{new Date(history.date).toLocaleString()}</span>
                          </li>
                          ))}
                      </ul>
                  </div>
                  </CardContent>
              </Card>
              <div className="print:block hidden p-4 border-t text-center text-xs text-muted-foreground">
                  Page 1 of 1 - Generated by OfiTrack
              </div>
          </div>
      </div>
  );
}
