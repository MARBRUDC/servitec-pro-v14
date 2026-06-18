type LoadingStateProps = {
  label?: string;
};

export default function LoadingState({
  label = "Cargando informacion...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        {label}
      </div>
    </div>
  );
}
