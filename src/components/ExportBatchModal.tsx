import React from 'react';
import { X, FileSpreadsheet, Download, FileText, CheckCircle2, Layers } from 'lucide-react';
import { chunkData, downloadVendorsExcelChunk, downloadVendorsCSVChunk, downloadVendorsPDFChunk, downloadUsersCSVChunk } from '../utils/exportUtils';
import { Vendor } from '../types';
import { UserRoleAssignment } from '../lib/adminApi';

interface ExportBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'excel' | 'csv' | 'pdf' | 'users_csv';
  vendors?: Vendor[];
  users?: UserRoleAssignment[];
  title?: string;
}

export const ExportBatchModal: React.FC<ExportBatchModalProps> = ({
  isOpen,
  onClose,
  type,
  vendors = [],
  users = [],
  title = "Download Export Data in 250-Entry Chunks"
}) => {
  if (!isOpen) return null;

  const dataList = type === 'users_csv' ? users : vendors;
  const chunks = chunkData(dataList, 250);

  const handleDownloadChunk = (chunkIndex: number) => {
    const chunk = chunks[chunkIndex];
    if (!chunk) return;

    if (type === 'excel') {
      downloadVendorsExcelChunk(chunk.data as Vendor[], chunk.chunkIndex, chunk.totalChunks, dataList.length);
    } else if (type === 'csv') {
      downloadVendorsCSVChunk(chunk.data as Vendor[], chunk.chunkIndex, chunk.totalChunks);
    } else if (type === 'pdf') {
      downloadVendorsPDFChunk(chunk.data as Vendor[], chunk.chunkIndex, chunk.totalChunks);
    } else if (type === 'users_csv') {
      downloadUsersCSVChunk(chunk.data as UserRoleAssignment[], chunk.chunkIndex, chunk.totalChunks);
    }
  };

  const handleDownloadAll = () => {
    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        handleDownloadChunk(index);
      }, index * 400); // slight stagger to allow browser downlods
    });
  };

  const getFormatLabel = () => {
    switch (type) {
      case 'excel': return 'Excel (.xls)';
      case 'csv': return 'CSV (.csv)';
      case 'pdf': return 'PDF (.pdf)';
      case 'users_csv': return 'Users CSV (.csv)';
    }
  };

  const getFormatIcon = () => {
    switch (type) {
      case 'excel': return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
      case 'csv': return <FileText className="w-6 h-6 text-blue-600" />;
      case 'pdf': return <FileText className="w-6 h-6 text-rose-600" />;
      case 'users_csv': return <FileText className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-2xl">
              {getFormatIcon()}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white leading-tight">{title}</h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                Total Records: <strong className="text-amber-400">{dataList.length}</strong> | Batches: <strong className="text-amber-400">{chunks.length}</strong> (Max 250 entries each)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">250-Entry Chunking Active</p>
              <p className="mt-0.5 text-amber-800">
                To keep spreadsheets light and prevent file corruption, documents are split into parts of 250 entries maximum. Click any Excel/CSV part to download it.
              </p>
            </div>
          </div>

          {chunks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-semibold text-sm">
              No data available to export.
            </div>
          ) : (
            <div className="space-y-2.5">
              {chunks.map((chunk, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-50 hover:bg-indigo-50/60 border border-gray-200 hover:border-indigo-300 rounded-2xl p-4 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-extrabold text-slate-700 text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                      {chunk.chunkIndex}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        {getFormatLabel()} Part {chunk.chunkIndex}
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                          Entries {chunk.startIndex} – {chunk.endIndex}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        Contains {chunk.data.length} registered business documents
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadChunk(idx)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Close
          </button>

          {chunks.length > 1 && (
            <button
              onClick={handleDownloadAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Download All {chunks.length} Parts</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
