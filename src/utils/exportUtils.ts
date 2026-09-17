import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Vendor } from '../types';
import { UserRoleAssignment } from '../lib/adminApi';

export interface ExportChunk<T> {
  chunkIndex: number;
  totalChunks: number;
  startIndex: number;
  endIndex: number;
  data: T[];
}

/**
 * Splits an array of data into chunks of specified size (default 250 entries)
 */
export function chunkData<T>(data: T[], chunkSize: number = 250): ExportChunk<T>[] {
  if (!data || data.length === 0) return [];
  
  const totalChunks = Math.ceil(data.length / chunkSize);
  const chunks: ExportChunk<T>[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const startIndex = i * chunkSize;
    const endIndex = Math.min(startIndex + chunkSize, data.length);
    const chunkItems = data.slice(startIndex, endIndex);

    chunks.push({
      chunkIndex: i + 1,
      totalChunks,
      startIndex: startIndex + 1,
      endIndex,
      data: chunkItems,
    });
  }

  return chunks;
}

/**
 * Download a single chunk of vendors as Excel (.xls)
 */
export function downloadVendorsExcelChunk(vendorsChunk: Vendor[], chunkIndex: number, totalChunks: number, totalRecords: number) {
  const tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Businesses Part ${chunkIndex}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta charset="utf-8">
      <style>
        th { background-color: #0F5C5C; color: white; font-weight: bold; padding: 8px; border: 1px solid #ccc; }
        td { padding: 6px; border: 1px solid #eee; }
      </style>
    </head>
    <body>
      <h3>DialXprt Registered Businesses - Excel Part ${chunkIndex} of ${totalChunks} (${vendorsChunk.length} Entries)</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Business Name</th>
            <th>Category / Profession</th>
            <th>Owner Name</th>
            <th>Phone</th>
            <th>WhatsApp</th>
            <th>Experience</th>
            <th>City</th>
            <th>Area / Neighborhood</th>
            <th>Pincode</th>
            <th>Address / Landmark</th>
            <th>Reference Name</th>
            <th>Reference Number</th>
            <th>Suggestions</th>
            <th>Status</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          ${vendorsChunk.map((v, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${v.id || ''}</td>
              <td>${(v.name || '').replace(/</g, '&lt;')}</td>
              <td>${(v.category || '').replace(/</g, '&lt;')}</td>
              <td>${(v.ownerName || '').replace(/</g, '&lt;')}</td>
              <td>'${v.phone || ''}</td>
              <td>'${v.whatsapp || ''}</td>
              <td>${(v.experience || '').replace(/</g, '&lt;')}</td>
              <td>${(v.city || 'Hyderabad').replace(/</g, '&lt;')}</td>
              <td>${(v.neighborhood || '').replace(/</g, '&lt;')}</td>
              <td>${v.pincode || ''}</td>
              <td>${(v.address || '').replace(/</g, '&lt;')}</td>
              <td>${(v.referenceName || '').replace(/</g, '&lt;')}</td>
              <td>'${v.referenceNumber || ''}</td>
              <td>${(v.suggestions || '').replace(/</g, '&lt;')}</td>
              <td>${v.status || 'pending'}</td>
              <td>${v.isVerified ? 'Yes' : 'No'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const fileName = totalChunks > 1 
    ? `DialXprt_Excel_Part_${chunkIndex}_of_${totalChunks}_(${vendorsChunk.length}_entries).xls`
    : `DialXprt_Businesses_Export_${Date.now()}.xls`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download a single chunk of vendors as CSV
 */
export function downloadVendorsCSVChunk(vendorsChunk: Vendor[], chunkIndex: number, totalChunks: number) {
  const headers = [
    "S.No", "ID", "Business Name", "Category", "Owner Name", "Phone", "WhatsApp", 
    "Experience", "City", "Area", "Pincode", "Address", "Reference Name", 
    "Reference Number", "Suggestions", "Status", "Verified"
  ];

  const rows = vendorsChunk.map((v, idx) => [
    idx + 1,
    v.id,
    `"${(v.name || '').replace(/"/g, '""')}"`,
    `"${(v.category || '').replace(/"/g, '""')}"`,
    `"${(v.ownerName || '').replace(/"/g, '""')}"`,
    `"${v.phone || ''}"`,
    `"${v.whatsapp || ''}"`,
    `"${(v.experience || '').replace(/"/g, '""')}"`,
    `"${(v.city || 'Hyderabad').replace(/"/g, '""')}"`,
    `"${(v.neighborhood || '').replace(/"/g, '""')}"`,
    `"${v.pincode || ''}"`,
    `"${(v.address || '').replace(/"/g, '""')}"`,
    `"${(v.referenceName || '').replace(/"/g, '""')}"`,
    `"${v.referenceNumber || ''}"`,
    `"${(v.suggestions || '').replace(/"/g, '""')}"`,
    v.status || 'pending',
    v.isVerified ? "Yes" : "No"
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const fileName = totalChunks > 1 
    ? `DialXprt_CSV_Part_${chunkIndex}_of_${totalChunks}_(${vendorsChunk.length}_entries).csv`
    : `DialXprt_Detailed_Vendors_Export_${Date.now()}.csv`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download a single chunk of vendors as PDF
 */
export function downloadVendorsPDFChunk(vendorsChunk: Vendor[], chunkIndex: number, totalChunks: number) {
  const doc = new jsPDF({ orientation: 'landscape' });
  
  doc.setFontSize(14);
  doc.text(`DialXprt Business Directory - Part ${chunkIndex} of ${totalChunks}`, 14, 15);
  doc.setFontSize(9);
  doc.text(`Entries: ${vendorsChunk.length} | Generated: ${new Date().toLocaleString()}`, 14, 21);
  
  const headers = [
    ["#", "Name", "Category", "Owner", "Phone", "WhatsApp", "Area", "Pincode", "Status"]
  ];
  
  const data = vendorsChunk.map((v, idx) => [
    idx + 1,
    v.name || '',
    v.category || '',
    v.ownerName || '',
    v.phone || '',
    v.whatsapp || '',
    v.neighborhood || '',
    v.pincode || '',
    v.status || 'pending'
  ]);
  
  autoTable(doc, {
    startY: 26,
    head: headers,
    body: data,
    theme: 'striped',
    headStyles: { fillColor: [15, 92, 92] },
    styles: { fontSize: 8 },
  });
  
  const fileName = totalChunks > 1 
    ? `DialXprt_PDF_Part_${chunkIndex}_of_${totalChunks}.pdf`
    : `DialXprt_Vendors_${Date.now()}.pdf`;
  doc.save(fileName);
}

/**
 * Download users chunk as CSV
 */
export function downloadUsersCSVChunk(rolesChunk: UserRoleAssignment[], chunkIndex: number, totalChunks: number) {
  const headers = ["S.No", "Email/Mobile", "Role"];
  const rows = rolesChunk.map((r, idx) => [idx + 1, `"${r.email}"`, `"${r.role}"`]);
  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const fileName = totalChunks > 1 
    ? `DialXprt_Users_Part_${chunkIndex}_of_${totalChunks}.csv`
    : `DialXprt_Users_Export_${Date.now()}.csv`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
