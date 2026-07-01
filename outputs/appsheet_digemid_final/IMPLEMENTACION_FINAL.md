# IMPLEMENTACION_FINAL

1. Subir `DIGEMID_Drogueria_AppSheet.xlsx` a Google Drive.
2. Abrir el archivo con Google Sheets.
3. Renombrar el Google Sheet como `BD_DIGEMID_DROGUERIA_PRODUCCION`.
4. Entrar a `appsheet.com`.
5. Clic en `Create`.
6. Clic en `App`.
7. Clic en `Start with existing data`.
8. Seleccionar `BD_DIGEMID_DROGUERIA_PRODUCCION`.
9. Crear la app.
10. En `Data > Tables`, confirmar estas tablas: `CONFIG`, `PROVEEDORES`, `CLIENTES`, `PRODUCTOS`, `LOTES`, `INGRESOS`, `EGRESOS`, `DOCUMENTOS`.
11. En `Data > Columns`, aplicar la configuración de `02_columns.csv`.
12. En `Data > Columns`, crear las columnas virtuales de `03_virtual_columns.csv`.
13. En `Data > Slices`, crear los slices de `04_slices.csv`.
14. En `Security > Security Filters`, aplicar `05_security_filters.csv`.
15. En `UX > Views`, crear las vistas de `06_views.csv`.
16. En `Behavior > Actions`, crear las acciones de `07_actions.csv`.
17. En `Automation > Bots`, crear los bots de `08_bots.csv`.
18. En `UX > Format Rules`, crear las reglas de `09_format_rules.csv`.
19. En `UX > Brand`, aplicar `10_ux_branding.json`.
20. En `UX > Views`, dejar como navegación principal: Dashboard, Ingresos, Egresos, Stock, Trazabilidad, Clientes, Proveedores, Configuración.
21. Clic en `Save`.
22. Ejecutar prueba: crear producto, proveedor, lote, ingreso, cliente y egreso.
23. Verificar que `STOCK_ACTUAL` baja después del egreso.
24. Verificar que AppSheet bloquea egreso mayor al stock.
25. Verificar que AppSheet solo permite el lote FEFO/FIFO.
26. Verificar que Trazabilidad muestra ingresos, egresos y documentos del lote.
27. Clic en `Manage > Deploy`.
28. Resolver únicamente advertencias obligatorias de AppSheet.
29. Clic en `Move app to deployed state`.