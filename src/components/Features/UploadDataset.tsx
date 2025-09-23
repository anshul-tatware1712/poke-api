import React from "react";
import { Card } from "../ui/card";
import { FileText, Upload, Zap, BarChart3 } from "lucide-react";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { CustomMappingDialog } from "./CustomMappingDialog";
import { useUploadedStore } from "@/store/uploadedStore";

interface UploadDatasetProps {
  handleUploadCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const UploadDataset = ({ handleUploadCSV }: UploadDatasetProps) => {
  const { csvUpload } = useUploadedStore();
  return (
    <Card className="group hover:shadow-xl relative transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
            <Upload className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Manual CSV Upload
            </h2>
            <p className="text-primary">Upload your own datasets</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm text-primary">
            <FileText className="h-4 w-4 mr-2 text-orange-500" />
            <span>Support for large CSV files (less than 100MB)</span>
          </div>
          <div className="flex items-center text-sm text-primary">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            <span>Client-side streaming with PapaParse</span>
          </div>
          <div className="flex items-center text-sm text-primary">
            <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
            <span>Custom schema mapping</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-2">
          <label
            htmlFor="csv-file"
            className="px-4 py-2  text-sm font-medium text-primary bg-secondary rounded-lg cursor-pointer "
          >
            Upload CSV
          </label>
          <Input
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={handleUploadCSV}
            className="hidden"
          />

          <div className="mt-2 text-sm text-center min-h-[1.5rem]">
            {csvUpload.isUploading ? (
              <div className="flex items-center justify-center text-blue-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading & Parsing...
              </div>
            ) : csvUpload.error ? (
              <div className="text-red-600">{csvUpload.error}</div>
            ) : csvUpload.fileName ? (
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                {csvUpload.fileName} uploaded successfully
              </div>
            ) : (
              <span className="text-muted-foreground">No file selected</span>
            )}
          </div>
        </div>
      </div>
      {csvUpload.fileName && <CustomMappingDialog />}
    </Card>
  );
};

export default UploadDataset;
