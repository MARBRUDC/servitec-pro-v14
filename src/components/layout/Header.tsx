export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          SERVITEC PRO V14
        </h1>

        <p className="text-sm text-slate-500">
          Sistema Integral de Gestión de Servicios Técnicos
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-700">
            Administrador
          </p>

          <p className="text-xs text-slate-500">
            admin@servitec.pro
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}