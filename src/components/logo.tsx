import { FileText } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-lg font-bold text-primary">
      <FileText className="h-6 w-6" />
      <span>OfiTrack</span>
    </div>
  );
}
