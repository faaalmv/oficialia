"use client"

import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Document, Template, StatusOptions, DocumentStatus } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createDocument, updateDocumentAction } from "@/app/actions"
import { Paperclip, Save, Send, Trash2 } from "lucide-react"
import React from "react"

const FormSchema = z.object({
  recipient: z.string().min(2, {
    message: "Recipient must be at least 2 characters.",
  }),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  body: z.string().min(10, {
    message: "Body must be at least 10 characters.",
  }),
  status: z.enum(StatusOptions),
  attachment: z.any().optional(),
})

interface DocumentFormProps {
  document?: Document
  templates: Template[]
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={isSubmitting}>
      <Save className="mr-2 h-4 w-4" />
      {isSubmitting ? "Saving..." : (isEditing ? "Save Changes" : "Create Document")}
    </Button>
  );
}

export function DocumentForm({ document, templates }: DocumentFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [attachmentName, setAttachmentName] = React.useState<string | undefined>(document?.attachment?.name);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      recipient: document?.recipient || "",
      title: document?.title || "",
      body: document?.body || "",
      status: document?.status || "Draft",
    },
    disabled: document?.status !== 'Draft' && !!document
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value)
      }
    })
    if(attachmentName) {
      formData.append("attachmentName", attachmentName)
    }

    try {
      if (document) {
        await updateDocumentAction(document.id, formData)
        toast({
          title: "Document Updated",
          description: `Document "${data.title}" has been successfully updated.`,
        })
        router.push(`/documents/${document.id}`)
      } else {
        await createDocument(formData)
        toast({
          title: "Document Created",
          description: `Document "${data.title}" has been successfully created.`,
          variant: "success",
        })
        router.push("/documents")
      }
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }
  
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
        form.setValue("body", template.body, { shouldValidate: true });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentName(e.target.files[0].name);
    }
  }

  const isEditing = !!document;
  const isLocked = isEditing && document.status !== 'Draft';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? `Edit Document: ${document.id}` : "Create New Document"}</CardTitle>
        <CardDescription>
          {isLocked
            ? "This document is locked and cannot be edited."
            : "Fill out the form below to create or update a document."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                 <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., HR Department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Q1 Performance Review" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Body</FormLabel>
                        {!isLocked && (
                        <Select onValueChange={handleTemplateChange}>
                            <SelectTrigger className="w-[200px] h-8 text-xs">
                                <SelectValue placeholder="Use a template" />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map(template => (
                                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        )}
                    </div>
                    <FormControl>
                        <Textarea
                        placeholder="Enter the document body..."
                        className="resize-y min-h-[250px]"
                        {...form.register("body")}
                        />
                    </FormControl>
                    <FormMessage {...form.getFieldState("body")} />
                </FormItem>
              </div>

              <div className="space-y-8">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select document status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {StatusOptions.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="attachment"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Attachment</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="file" className="pl-10" onChange={handleFileChange} />
                            <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        {attachmentName && (
                          <FormDescription className="flex items-center justify-between">
                            <span>Current file: {attachmentName}</span>
                            {!isLocked && (
                              <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setAttachmentName(undefined)}>
                                <Trash2 className="h-3 w-3 mr-1"/> Remove
                              </Button>
                            )}
                          </FormDescription>
                        )}
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
            </div>
            
            {!isLocked && (
              <div className="flex justify-end">
                <SubmitButton isEditing={isEditing} />
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
