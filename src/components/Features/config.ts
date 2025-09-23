import { Zap, BarChart3, Download, FileText } from "lucide-react";

export const cardConfig = [
  {
    title: "Real-time data from PokeAPI",
    icon: Zap,
    iconProps: { className: "h-4 w-4 mr-2 text-yellow-500" },
  },
  {
    title: "Complete dataset with pagination",
    icon: BarChart3,
    iconProps: { className: "h-4 w-4 mr-2 text-green-500" },
  },
  {
    title: "Progress tracking & loading states",
    icon: Download,
    iconProps: { className: "h-4 w-4 mr-2 text-purple-500" },
  },
];

export const uploadCardConfig = [
  {
    title: "Support for large CSV files (less than 100MB)",
    icon: FileText,
    iconProps: { className: "h-4 w-4 mr-2 text-orange-500" },
  },
  {
    title: "Client-side streaming with PapaParse",
    icon: Zap,
    iconProps: { className: "h-4 w-4 mr-2 text-yellow-500" },
  },
  {
    title: "Custom schema mapping",
    icon: BarChart3,
    iconProps: { className: "h-4 w-4 mr-2 text-green-500" },
  },
];
