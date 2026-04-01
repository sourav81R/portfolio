const TEXT_FILE_EXTENSIONS = new Set(['txt', 'md', 'json'])

const getExtension = (fileName: string) =>
  fileName.split('.').pop()?.trim().toLowerCase() ?? ''

const extractPdfText = async (file: File) => {
  const pdfjs = await import('pdfjs-dist')
  const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
  pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default

  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await pdfjs.getDocument({ data }).promise
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, index) => {
      const page = await pdf.getPage(index + 1)
      const content = await page.getTextContent()

      return content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
    })
  )

  return pages.join('\n')
}

const extractDocxText = async (file: File) => {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export const extractResumeText = async (file: File) => {
  const extension = getExtension(file.name)

  if (extension === 'pdf') {
    return extractPdfText(file)
  }

  if (extension === 'docx') {
    return extractDocxText(file)
  }

  if (TEXT_FILE_EXTENSIONS.has(extension)) {
    return file.text()
  }

  if (extension === 'doc') {
    throw new Error('Legacy .doc files are not supported yet. Please upload PDF, DOCX, or TXT.')
  }

  throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.')
}
