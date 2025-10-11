interface LoadingViewProps {
  message: string;
}

export function LoadingView({ message }: LoadingViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-[#00BCD4]/20 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-[#00BCD4] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg text-slate-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
