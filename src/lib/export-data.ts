import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import { autoTable } from "jspdf-autotable"

export interface Column {
  header: string
  accessor: (row: any) => string | number
}

export type ExportFormat = "csv" | "xlsx" | "pdf"

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportToCSV(data: any[], columns: Column[], filename: string) {
  const headerRow = columns.map((c) => `"${c.header}"`).join(",")
  const dataRows = data.map((row) =>
    columns.map((c) => `"${c.accessor(row)}"`).join(",")
  )
  const csv = [headerRow, ...dataRows].join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, filename)
}

export function exportToExcel(data: any[], columns: Column[], filename: string) {
  const wsData: any[][] = [columns.map((c) => c.header)]
  data.forEach((row) => wsData.push(columns.map((c) => c.accessor(row))))
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Data")
  XLSX.writeFile(wb, filename)
}

export function exportToPDF(
  data: any[],
  columns: Column[],
  title: string,
  filename: string
) {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(title, 14, 20)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)
  const headers = columns.map((c) => c.header)
  const rows = data.map((row) => columns.map((c) => String(c.accessor(row))))
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 34,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  })
  doc.save(filename)
}

export function exportData(
  data: any[],
  columns: Column[],
  format: ExportFormat,
  title: string,
  filename: string
) {
  switch (format) {
    case "csv":
      exportToCSV(data, columns, filename.endsWith(".csv") ? filename : `${filename}.csv`)
      break
    case "xlsx":
      exportToExcel(data, columns, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`)
      break
    case "pdf":
      exportToPDF(data, columns, title, filename.endsWith(".pdf") ? filename : `${filename}.pdf`)
      break
  }
}
