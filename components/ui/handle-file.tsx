"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FileUpload({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFiles(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFiles(updatedFiles);
  };

  return (
    <div className="grid gap-2">
      <Label>Upload Resources</Label>

      {/* Hidden native input (required for file selection) */}
      <Input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Shadcn Button to trigger input */}
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Choose Files
      </Button>

      {/* File table */}
      {files.length > 0 && (
        <div className="max-h-40 overflow-y-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/3">File Name</TableHead>
                <TableHead className="w-1/3">Size</TableHead>
                <TableHead className="w-[80px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, i) => (
                <TableRow key={i}>
                  <TableCell className="truncate">{file.name}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(1)} KB</TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFile(i)}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
