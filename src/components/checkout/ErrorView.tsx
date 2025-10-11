interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorView({ message, onRetry, onBack }: ErrorViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600">{message}</p>
        </div>

        <div className="flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 bg-[#00BCD4] text-white font-semibold rounded-xl hover:bg-[#00838F] transition-colors"
            >
              Try Again
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="flex-1 py-3 border-2 border-[#00BCD4] text-[#00BCD4] font-semibold rounded-xl hover:bg-[#00BCD4]/5 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
