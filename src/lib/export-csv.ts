export interface Column {
  header: string
  accessor: (row: any) => string | number
}

export function exportToCSV(data: any[], columns: Column[], filename: string) {
  const headerRow = columns.map((c) => `"${c.header}"`).join(",")
  const dataRows = data.map((row) =>
    columns.map((c) => `"${c.accessor(row)}"`).join(",")
  )
  const csv = [headerRow, ...dataRows].join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
