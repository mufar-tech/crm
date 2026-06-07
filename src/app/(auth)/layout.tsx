export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {children}
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMi4yMDYtMS43OTQtNC00LTRzLTQgMS43OTQtNCA0IDEuNzk0IDQgNCA0IDQtMS43OTQgNC00em0tMTIgMGMwLTIuMjA2LTEuNzk0LTQtNC00cy00IDEuNzk0LTQgNCAxLjc5NCA0IDQgNCA0LTEuNzk0IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="relative flex flex-col justify-center px-12 py-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <div className="text-white text-sm font-medium opacity-80">Mufar Technologies</div>
                <div className="text-white text-xl font-bold">Mufar CRM</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Enterprise Customer Relationship Management
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Manage leads, customers, sales pipelines, and business growth from a single unified platform.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {["Lead Management", "Sales Pipeline", "Customer 360", "Analytics"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-white/80">
                  <svg className="w-5 h-5 text-blue-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
