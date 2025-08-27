export type DocumentStatus = "Draft" | "Sent" | "Received/Acknowledged" | "Archived";

export const StatusOptions: DocumentStatus[] = ["Draft", "Sent", "Received/Acknowledged", "Archived"];

export interface StatusHistory {
  status: DocumentStatus;
  date: Date;
}

export interface Document {
  id: string;
  recipient: string;
  title: string;
  body: string;
  attachment?: {
    name: string;
    url: string; 
  };
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: StatusHistory[];
}

export interface Template {
  id: string;
  name: string;
  body: string;
}
