import type { Document, Template } from './types';

let documents: Document[] = [
  {
    id: 'CAA-ALMV-2023-0001',
    recipient: 'Finance Department',
    title: 'Q4 Budget Report',
    body: 'Please find attached the budget report for the fourth quarter of 2023. This report includes a detailed breakdown of expenditures and revenue, along with projections for the next quarter. Your timely review and feedback are appreciated.',
    attachment: { name: 'Q4_Budget.pdf', url: '#' },
    status: 'Sent',
    createdAt: new Date('2023-11-10T10:00:00Z'),
    updatedAt: new Date('2023-11-10T10:00:00Z'),
    statusHistory: [
      { status: 'Draft', date: new Date('2023-11-09T14:30:00Z') },
      { status: 'Sent', date: new Date('2023-11-10T10:00:00Z') },
    ],
  },
  {
    id: 'CAA-ALMV-2023-0002',
    recipient: 'HR Department',
    title: 'New Hire Onboarding Documents',
    body: 'The following documents are required for the new hire, John Doe. Please process them at your earliest convenience.',
    status: 'Received/Acknowledged',
    createdAt: new Date('2023-11-15T09:20:00Z'),
    updatedAt: new Date('2023-11-16T11:00:00Z'),
    statusHistory: [
        { status: 'Draft', date: new Date('2023-11-15T09:00:00Z') },
        { status: 'Sent', date: new Date('2023-11-15T09:20:00Z') },
        { status: 'Received/Acknowledged', date: new Date('2023-11-16T11:00:00Z') }
    ],
  },
  {
    id: 'CAA-ALMV-2024-0001',
    recipient: 'IT Support',
    title: 'Request for Software Installation',
    body: 'I would like to request the installation of the new design software on my workstation. Project deadline is approaching and this software is critical.',
    attachment: { name: 'software_license.txt', url: '#' },
    status: 'Draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    statusHistory: [{ status: 'Draft', date: new Date() }],
  },
   {
    id: 'CAA-ALMV-2024-0002',
    recipient: 'All Staff',
    title: 'Holiday Schedule Announcement',
    body: 'This is to inform all staff about the upcoming holiday schedule for the festive season. The office will be closed from December 24th to January 2nd.',
    status: 'Archived',
    createdAt: new Date('2024-12-01T17:00:00Z'),
    updatedAt: new Date('2024-12-01T17:00:00Z'),
    statusHistory: [
        { status: 'Draft', date: new Date('2024-12-01T16:00:00Z') },
        { status: 'Sent', date: new Date('2024-12-01T17:00:00Z') },
        { status: 'Archived', date: new Date('2024-12-20T10:00:00Z') },
    ],
  },
];

let templates: Template[] = [
  {
    id: 'template-1',
    name: 'Information Request',
    body: 'Dear [Recipient],\n\nThis is a formal request for information regarding [Topic]. Please provide the requested details by [Date].\n\nThank you for your cooperation.\n\nSincerely,\n[Your Name]',
  },
  {
    id: 'template-2',
    name: 'Activity Report',
    body: 'Hello Team,\n\nPlease find the activity report for the period of [Start Date] to [End Date].\n\nKey Activities:\n- [Activity 1]\n- [Activity 2]\n- [Activity 3]\n\nNext Steps:\n- [Step 1]\n\nBest regards,\n[Your Name]',
  },
  {
    id: 'template-3',
    name: 'Meeting Follow-up',
    body: 'Hi all,\n\nThis is a follow-up to our meeting on [Date].\n\nKey discussion points were:\n- [Point 1]\n- [Point 2]\n\nAction items:\n- [Action Item 1] - [Owner]\n- [Action Item 2] - [Owner]\n\nThanks,\n[Your Name]',
  },
];

const generateNextId = (): string => {
  const year = new Date().getFullYear();
  const yearPrefix = `CAA-ALMV-${year}-`;
  
  const docsThisYear = documents.filter(doc => doc.id.startsWith(yearPrefix));
  const lastNum = docsThisYear.reduce((max, doc) => {
    const num = parseInt(doc.id.replace(yearPrefix, ''), 10);
    return num > max ? num : max;
  }, 0);

  const nextNum = lastNum + 1;
  return `${yearPrefix}${String(nextNum).padStart(4, '0')}`;
};

export const getDocuments = async () => {
  await new Promise(res => setTimeout(res, 50));
  return documents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getDocumentById = async (id: string) => {
  await new Promise(res => setTimeout(res, 50));
  return documents.find(doc => doc.id === id);
};

export const addDocument = async (docData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
  await new Promise(res => setTimeout(res, 50));
  const newId = generateNextId();
  const now = new Date();
  const newDocument: Document = {
    ...docData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ status: docData.status, date: now }],
  };
  documents.unshift(newDocument);
  return newDocument;
};

export const updateDocument = async (id: string, docData: Partial<Omit<Document, 'id' | 'createdAt'>>) => {
  await new Promise(res => setTimeout(res, 50));
  const docIndex = documents.findIndex(doc => doc.id === id);
  if (docIndex === -1) {
    return null;
  }
  const originalDoc = documents[docIndex];
  
  const now = new Date();
  const updatedDoc: Document = {
    ...originalDoc,
    ...docData,
    updatedAt: now,
  };

  if (docData.status && docData.status !== originalDoc.status) {
    updatedDoc.statusHistory = [...originalDoc.statusHistory, { status: docData.status, date: now }];
  }

  documents[docIndex] = updatedDoc;
  return updatedDoc;
};

export const deleteDocument = async (id: string) => {
    await new Promise(res => setTimeout(res, 50));
    documents = documents.filter(doc => doc.id !== id);
    return true;
}


export const getTemplates = async () => {
  await new Promise(res => setTimeout(res, 50));
  return templates;
}

export const getTemplateById = async (id: string) => {
  await new Promise(res => setTimeout(res, 50));
  return templates.find(t => t.id === id);
}

export const getDashboardStats = async () => {
    await new Promise(res => setTimeout(res, 50));
    const total = documents.length;
    const drafts = documents.filter(d => d.status === 'Draft').length;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const sentThisMonth = documents.filter(d => 
        d.status === 'Sent' &&
        d.createdAt.getMonth() === thisMonth &&
        d.createdAt.getFullYear() === thisYear
    ).length;

    return { total, drafts, sentThisMonth };
}
