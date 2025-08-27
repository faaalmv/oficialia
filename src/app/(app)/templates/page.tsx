import { getTemplates } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book } from "lucide-react";

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold font-headline">Document Templates</h1>
        <p className="text-muted-foreground">
          Use these templates to quickly create new documents.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                    <Book className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{template.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-4 whitespace-pre-wrap">
                {template.body}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
