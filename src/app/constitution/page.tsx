// Constitution page removed per user request. This file is intentionally left blank.

export default function ConstitutionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 bg-background text-foreground">
      <h1 className="text-4xl font-extrabold text-primary text-center">
        GRASAG-UPSA Constitution
      </h1>
      <div className="border rounded-lg overflow-hidden" style={{ height: '80vh' }}>
        <iframe
          src="/GRASAG_CONSTITUTION.docx"
          title="GRASAG Constitution"
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
      <p className="text-center text-sm text-neutral-500">
        If the document does not display correctly, you can <a href="/GRASAG_CONSTITUTION.docx" className="text-primary underline" download>download the constitution</a>.
      </p>
    </div>
  );
}
