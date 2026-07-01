# Fase 2 - Manual AppSheet DIGEMID

Objetivo: construir la aplicación en AppSheet usando únicamente Google Sheets + AppSheet. No usar Apps Script, React, backend ni fórmulas de Excel.

Archivo base:

`outputs/AppSheet_Drogueria_Produccion.xlsx`

Tablas operativas que sí se agregan a AppSheet:

`CONFIG`, `PROVEEDORES`, `CLIENTES`, `PRODUCTOS`, `LOTES`, `INGRESOS`, `EGRESOS`, `DOCUMENTOS`.

Hojas de apoyo que NO se deben agregar como tablas operativas:

`APP_CONFIG`, `APPSHEET_FORMULAS`, `APPSHEET_VALIDATIONS`, `APPSHEET_ACTIONS`, `APPSHEET_VIEWS`, `APPSHEET_AUTOMATIONS`, `README`.

## Paso 1 - Subir el archivo a Google Drive

1. Abre Google Drive.
2. Haz clic en `Nuevo`.
3. Haz clic en `Subir archivo`.
4. Selecciona `AppSheet_Drogueria_Produccion.xlsx`.
5. Espera a que termine la carga.
6. Haz doble clic sobre el archivo.
7. Haz clic en `Abrir con`.
8. Haz clic en `Hojas de cálculo de Google`.
9. Espera a que Google convierta el archivo.
10. Cambia el nombre del Google Sheet a `BD_DROGUERIA_APPSHEET_PRODUCCION`.

## Paso 2 - Crear la app en AppSheet

1. Con el Google Sheet abierto, haz clic en `Extensiones`.
2. Haz clic en `AppSheet`.
3. Haz clic en `Crear una app`.
4. Si AppSheet abre una pestaña nueva, espera a que cargue el editor.
5. Si pide iniciar sesión, inicia sesión con la misma cuenta de Google Drive.
6. En el nombre de app escribe `Droguería Trazabilidad DIGEMID`.
7. Selecciona categoría `Inventory` o `Operations` si AppSheet lo solicita.
8. Haz clic en `Create app` o `Customize your app`.

Ruta alternativa si no aparece el menú de AppSheet:

1. Entra a `https://www.appsheet.com`.
2. Haz clic en `Create`.
3. Haz clic en `App`.
4. Haz clic en `Start with existing data`.
5. Selecciona Google Drive.
6. Selecciona `BD_DROGUERIA_APPSHEET_PRODUCCION`.
7. Haz clic en `Select`.

## Paso 3 - Agregar solo las tablas operativas

1. En el editor de AppSheet, haz clic en `Data` en el menú izquierdo.
2. Haz clic en `Tables`.
3. Revisa las tablas detectadas automáticamente.
4. Si AppSheet agregó hojas de apoyo, elimínalas de la app:
   `APP_CONFIG`, `APPSHEET_FORMULAS`, `APPSHEET_VALIDATIONS`, `APPSHEET_ACTIONS`, `APPSHEET_VIEWS`, `APPSHEET_AUTOMATIONS`, `README`.
5. Para eliminar una hoja de apoyo: haz clic sobre la tabla, luego clic en `Delete table` o `Remove table from app`.
6. Confirma la eliminación si AppSheet lo solicita.
7. Haz clic en `+ New Table`.
8. Agrega estas tablas una por una si no existen:
   `CONFIG`, `PROVEEDORES`, `CLIENTES`, `PRODUCTOS`, `LOTES`, `INGRESOS`, `EGRESOS`, `DOCUMENTOS`.
9. Para cada tabla, deja `Are updates allowed?` en `Adds, updates, and deletes`.
10. Haz clic en `Save`.

## Paso 4 - Regenerar columnas

1. Haz clic en `Data`.
2. Haz clic en `Columns`.
3. Selecciona la tabla `CONFIG`.
4. Haz clic en `Regenerate Structure`.
5. Confirma con `Regenerate`.
6. Repite lo mismo para `PROVEEDORES`, `CLIENTES`, `PRODUCTOS`, `LOTES`, `INGRESOS`, `EGRESOS` y `DOCUMENTOS`.
7. Haz clic en `Save`.

## Paso 5 - Configurar columnas

Para cada tabla:

1. Haz clic en `Data`.
2. Haz clic en `Columns`.
3. Selecciona la tabla indicada.
4. Haz clic en el lápiz de cada columna.
5. Copia exactamente los valores de la tabla siguiente.
6. Guarda cada cambio con `Done`.
7. Al terminar la tabla, haz clic en `Save`.

### Tabla CONFIG

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_CONFIG | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| RAZON_SOCIAL | Text | FALSE | TRUE |  |  | TRUE | TRUE |  |  |  |
| RUC | Text | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| DIRECCION | Text | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| TELEFONO | Phone | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| EMAIL | Email | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| RESPONSABLE_TECNICO | Text | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| DIRECTOR_TECNICO | Text | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| LOGO | Image | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| DIAS_ALERTA | Number | FALSE | FALSE |  |  | TRUE | TRUE | 90 |  |  |

### Tabla PROVEEDORES

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_PROVEEDOR | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| RUC | Text | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| RAZON_SOCIAL | Text | FALSE | TRUE |  |  | TRUE | TRUE |  |  |  |
| DIRECCION | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| TELEFONO | Phone | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| EMAIL | Email | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| CONTACTO | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| ESTADO | Enum | FALSE | FALSE |  | ACTIVO,INACTIVO | TRUE | TRUE | "ACTIVO" | LIST("ACTIVO","INACTIVO") |  |

### Tabla CLIENTES

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_CLIENTE | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| RUC_DNI | Text | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| NOMBRE | Text | FALSE | TRUE |  |  | TRUE | TRUE |  |  |  |
| DIRECCION | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| TELEFONO | Phone | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| EMAIL | Email | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| ESTADO | Enum | FALSE | FALSE |  | ACTIVO,INACTIVO | TRUE | TRUE | "ACTIVO" | LIST("ACTIVO","INACTIVO") |  |

### Tabla PRODUCTOS

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_PRODUCTO | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| CODIGO | Text | FALSE | FALSE |  |  | TRUE | TRUE |  | COUNT(SELECT(PRODUCTOS[ID_PRODUCTO], AND([CODIGO] = [_THISROW].[CODIGO], [ID_PRODUCTO] <> [_THISROW].[ID_PRODUCTO]))) = 0 |  |
| NOMBRE | Text | FALSE | TRUE |  |  | TRUE | TRUE |  |  |  |
| MARCA | Text | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| LABORATORIO | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| REGISTRO_SANITARIO | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| PRESENTACION | Enum | FALSE | FALSE |  | CAJA,UNIDAD,BLISTER,FRASCO,BOLSA,AMPOLLA,TUBO,DISPLAY | TRUE | TRUE |  | LIST("CAJA","UNIDAD","BLISTER","FRASCO","BOLSA","AMPOLLA","TUBO","DISPLAY") |  |
| UNIDAD | Enum | FALSE | FALSE |  | UNIDAD,CAJA,FRASCO,BLISTER,AMPOLLA,BOLSA | TRUE | TRUE |  | LIST("UNIDAD","CAJA","FRASCO","BLISTER","AMPOLLA","BOLSA") |  |
| TEMPERATURA | Enum | FALSE | FALSE |  | AMBIENTE,REFRIGERADO,CONGELADO,CONTROLADA | TRUE | TRUE |  | LIST("AMBIENTE","REFRIGERADO","CONGELADO","CONTROLADA") |  |
| ESTADO | Enum | FALSE | FALSE |  | ACTIVO,INACTIVO | TRUE | TRUE | "ACTIVO" | LIST("ACTIVO","INACTIVO") |  |

### Tabla LOTES

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_LOTE | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| ID_PRODUCTO | Ref | FALSE | FALSE | PRODUCTOS |  | TRUE | TRUE |  |  |  |
| LOTE | Text | FALSE | TRUE |  |  | TRUE | TRUE |  |  |  |
| FECHA_FABRICACION | Date | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| FECHA_VENCIMIENTO | Date | FALSE | FALSE |  |  | TRUE | TRUE |  | [FECHA_VENCIMIENTO] >= [FECHA_FABRICACION] |  |
| PRECIO_COMPRA | Number | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| PRECIO_VENTA | Number | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| RELATED_INGRESOS | List | FALSE | FALSE |  |  | FALSE | FALSE |  |  | REF_ROWS("INGRESOS", "ID_LOTE") |
| RELATED_EGRESOS | List | FALSE | FALSE |  |  | FALSE | FALSE |  |  | REF_ROWS("EGRESOS", "ID_LOTE") |
| RELATED_DOCUMENTOS | List | FALSE | FALSE |  |  | FALSE | FALSE |  |  | REF_ROWS("DOCUMENTOS", "ID_LOTE") |
| TRAZABILIDAD_RESUMEN | LongText | FALSE | FALSE |  |  | FALSE | FALSE |  |  | CONCATENATE("Producto: ", [ID_PRODUCTO].[NOMBRE], " \| Lote: ", [LOTE], " \| Stock: ", [STOCK_ACTUAL], " \| Vence: ", TEXT([FECHA_VENCIMIENTO])) |
| TOTAL_INGRESOS | Number | FALSE | FALSE |  |  | FALSE | FALSE |  |  | SUM(SELECT(INGRESOS[CANTIDAD], [ID_LOTE] = [_THISROW].[ID_LOTE])) |
| TOTAL_EGRESOS | Number | FALSE | FALSE |  |  | FALSE | FALSE |  |  | SUM(SELECT(EGRESOS[CANTIDAD], [ID_LOTE] = [_THISROW].[ID_LOTE])) |
| STOCK_ACTUAL | Number | FALSE | FALSE |  |  | FALSE | FALSE |  |  | [TOTAL_INGRESOS] - [TOTAL_EGRESOS] |
| DIAS_VENCIMIENTO | Number | FALSE | FALSE |  |  | FALSE | FALSE |  |  | [FECHA_VENCIMIENTO] - TODAY() |
| ALERTA_VENCIMIENTO | Enum | FALSE | FALSE |  |  | FALSE | FALSE |  |  | IFS([STOCK_ACTUAL] <= 0, "SIN STOCK", [FECHA_VENCIMIENTO] < TODAY(), "VENCIDO", [DIAS_VENCIMIENTO] <= 30, "VENCE 30 DIAS", [DIAS_VENCIMIENTO] <= 60, "VENCE 60 DIAS", [DIAS_VENCIMIENTO] <= 90, "VENCE 90 DIAS", TRUE, "VIGENTE") |
| PRIMER_INGRESO | Date | FALSE | FALSE |  |  | FALSE | FALSE |  |  | MIN(SELECT(INGRESOS[FECHA], [ID_LOTE] = [_THISROW].[ID_LOTE])) |
| ORDEN_FEFO_FIFO | Number | FALSE | FALSE |  |  | FALSE | FALSE |  |  | COUNT(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0, OR([FECHA_VENCIMIENTO] < [_THISROW].[FECHA_VENCIMIENTO], AND([FECHA_VENCIMIENTO] = [_THISROW].[FECHA_VENCIMIENTO], [PRIMER_INGRESO] < [_THISROW].[PRIMER_INGRESO]))))) + 1 |
| ES_LOTE_FEFO | Yes/No | FALSE | FALSE |  |  | FALSE | FALSE |  |  | [ORDEN_FEFO_FIFO] = 1 |

### Tabla INGRESOS

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_INGRESO | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| FECHA | Date | FALSE | FALSE |  |  | TRUE | TRUE | TODAY() |  |  |
| ID_PROVEEDOR | Ref | FALSE | FALSE | PROVEEDORES |  | TRUE | TRUE |  |  |  |
| ID_PRODUCTO | Ref | FALSE | FALSE | PRODUCTOS |  | TRUE | TRUE |  |  |  |
| ID_LOTE | Ref | FALSE | FALSE | LOTES |  | TRUE | TRUE |  | SELECT(LOTES[ID_LOTE], [ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO]) |  |
| GUIA | Text | FALSE | TRUE |  |  | FALSE | TRUE |  |  |  |
| FACTURA | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| CANTIDAD | Number | FALSE | FALSE |  |  | TRUE | TRUE |  | [_THIS] > 0 |  |
| USUARIO | Text | FALSE | FALSE |  |  | TRUE | TRUE | USEREMAIL() |  |  |
| PRODUCTO_LOTE_OK | Yes/No | FALSE | FALSE |  |  | FALSE | FALSE |  |  | [ID_LOTE].[ID_PRODUCTO] = [ID_PRODUCTO] |

### Tabla EGRESOS

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_EGRESO | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| FECHA | Date | FALSE | FALSE |  |  | TRUE | TRUE | TODAY() |  |  |
| ID_CLIENTE | Ref | FALSE | FALSE | CLIENTES |  | TRUE | TRUE |  |  |  |
| ID_PRODUCTO | Ref | FALSE | FALSE | PRODUCTOS |  | TRUE | TRUE |  |  |  |
| ID_LOTE | Ref | FALSE | FALSE | LOTES |  | TRUE | TRUE |  | LIST(ANY(ORDERBY(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0)), [FECHA_VENCIMIENTO], TRUE, [PRIMER_INGRESO], TRUE))) |  |
| GUIA | Text | FALSE | TRUE |  |  | FALSE | TRUE |  |  |  |
| FACTURA | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |
| CANTIDAD | Number | FALSE | FALSE |  |  | TRUE | TRUE |  | AND([_THIS] > 0, [_THIS] <= [ID_LOTE].[STOCK_ACTUAL]) |  |
| USUARIO | Text | FALSE | FALSE |  |  | TRUE | TRUE | USEREMAIL() |  |  |
| STOCK_DISPONIBLE_LOTE | Number | FALSE | FALSE |  |  | FALSE | FALSE |  |  | [ID_LOTE].[STOCK_ACTUAL] |
| ES_FEFO_VALIDO | Yes/No | FALSE | FALSE |  |  | FALSE | FALSE |  |  | [ID_LOTE] = ANY(ORDERBY(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0)), [FECHA_VENCIMIENTO], TRUE, [PRIMER_INGRESO], TRUE)) |

### Tabla DOCUMENTOS

| COLUMNA | TIPO_APPSHEET | ES_KEY | ES_LABEL | REF_TABLA | ENUM_VALUES | REQUIRED | EDITABLE | INITIAL_VALUE | VALID_IF | APP_FORMULA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID_DOCUMENTO | Text | TRUE | FALSE |  |  | TRUE | FALSE | UNIQUEID() |  |  |
| ID_LOTE | Ref | FALSE | FALSE | LOTES |  | TRUE | TRUE |  |  |  |
| TIPO_DOCUMENTO | Enum | FALSE | TRUE |  | COA,BPM,BPA,REGISTRO_SANITARIO,GUIA_COMPRA,FACTURA_COMPRA,GUIA_VENTA,FACTURA_VENTA,OTRO | TRUE | TRUE |  | LIST("COA","BPM","BPA","REGISTRO_SANITARIO","GUIA_COMPRA","FACTURA_COMPRA","GUIA_VENTA","FACTURA_VENTA","OTRO") |  |
| ARCHIVO | File | FALSE | FALSE |  |  | TRUE | TRUE |  |  |  |
| OBSERVACION | Text | FALSE | FALSE |  |  | FALSE | TRUE |  |  |  |

## Paso 6 - Crear columnas virtuales y pegar App Formula

1. Haz clic en `Data`.
2. Haz clic en `Columns`.
3. Abre la tabla indicada en la columna `TABLA`.
4. Haz clic en `Add virtual column`.
5. En `Name`, escribe el valor de `COLUMNA`.
6. En `Type`, selecciona `TIPO_APPSHEET`.
7. En `App formula`, pega `FORMULA_APPSHEET`.
8. Haz clic en `Done`.
9. Repite hasta crear todas las columnas de esta lista.
10. Haz clic en `Save`.

| TABLA | COLUMNA | COLUMNA_TIPO | TIPO_APPSHEET | FORMULA_APPSHEET | OBJETIVO |
| --- | --- | --- | --- | --- | --- |
| LOTES | RELATED_INGRESOS | Virtual | List | REF_ROWS("INGRESOS", "ID_LOTE") | Lista relacionada para trazabilidad: ingresos del lote. |
| LOTES | RELATED_EGRESOS | Virtual | List | REF_ROWS("EGRESOS", "ID_LOTE") | Lista relacionada para trazabilidad: egresos del lote. |
| LOTES | RELATED_DOCUMENTOS | Virtual | List | REF_ROWS("DOCUMENTOS", "ID_LOTE") | Lista relacionada para trazabilidad: documentos del lote. |
| LOTES | TRAZABILIDAD_RESUMEN | Virtual | LongText | CONCATENATE("Producto: ", [ID_PRODUCTO].[NOMBRE], " \| Lote: ", [LOTE], " \| Stock: ", [STOCK_ACTUAL], " \| Vence: ", TEXT([FECHA_VENCIMIENTO])) | Resumen legible para vista de inspeccion sanitaria. |
| LOTES | TOTAL_INGRESOS | Virtual | Number | SUM(SELECT(INGRESOS[CANTIDAD], [ID_LOTE] = [_THISROW].[ID_LOTE])) | Total de unidades ingresadas para el lote. |
| LOTES | TOTAL_EGRESOS | Virtual | Number | SUM(SELECT(EGRESOS[CANTIDAD], [ID_LOTE] = [_THISROW].[ID_LOTE])) | Total de unidades egresadas para el lote. |
| LOTES | STOCK_ACTUAL | Virtual | Number | [TOTAL_INGRESOS] - [TOTAL_EGRESOS] | Stock por lote. No crear tabla fisica de stock. |
| LOTES | DIAS_VENCIMIENTO | Virtual | Number | [FECHA_VENCIMIENTO] - TODAY() | Dias restantes para vencimiento. |
| LOTES | ALERTA_VENCIMIENTO | Virtual | Enum | IFS([STOCK_ACTUAL] <= 0, "SIN STOCK", [FECHA_VENCIMIENTO] < TODAY(), "VENCIDO", [DIAS_VENCIMIENTO] <= 30, "VENCE 30 DIAS", [DIAS_VENCIMIENTO] <= 60, "VENCE 60 DIAS", [DIAS_VENCIMIENTO] <= 90, "VENCE 90 DIAS", TRUE, "VIGENTE") | Semaforo sanitario calculado en AppSheet. |
| LOTES | PRIMER_INGRESO | Virtual | Date | MIN(SELECT(INGRESOS[FECHA], [ID_LOTE] = [_THISROW].[ID_LOTE])) | Fecha del primer ingreso del lote. Se usa para desempate FIFO. |
| LOTES | ORDEN_FEFO_FIFO | Virtual | Number | COUNT(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0, OR([FECHA_VENCIMIENTO] < [_THISROW].[FECHA_VENCIMIENTO], AND([FECHA_VENCIMIENTO] = [_THISROW].[FECHA_VENCIMIENTO], [PRIMER_INGRESO] < [_THISROW].[PRIMER_INGRESO]))))) + 1 | Orden de salida sugerido. 1 es el lote prioritario. |
| LOTES | ES_LOTE_FEFO | Virtual | Yes/No | [ORDEN_FEFO_FIFO] = 1 | TRUE si el lote es el primero a salir para su producto. |
| INGRESOS | PRODUCTO_LOTE_OK | Virtual | Yes/No | [ID_LOTE].[ID_PRODUCTO] = [ID_PRODUCTO] | Controla que el lote seleccionado pertenezca al producto seleccionado. |
| EGRESOS | STOCK_DISPONIBLE_LOTE | Virtual | Number | [ID_LOTE].[STOCK_ACTUAL] | Stock disponible del lote antes de registrar salida. |
| EGRESOS | ES_FEFO_VALIDO | Virtual | Yes/No | [ID_LOTE] = ANY(ORDERBY(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0)), [FECHA_VENCIMIENTO], TRUE, [PRIMER_INGRESO], TRUE)) | Valida FEFO y FIFO para la salida. |

## Paso 7 - Pegar Valid If y validaciones

1. Haz clic en `Data`.
2. Haz clic en `Columns`.
3. Selecciona la tabla indicada.
4. Haz clic en la columna indicada.
5. Busca la propiedad indicada en `PROPIEDAD`.
6. Pega la expresión de `EXPRESION`.
7. Si existe `PROPIEDAD_2`, pega también `EXPRESION_2` en esa propiedad.
8. Haz clic en `Done`.
9. Haz clic en `Save`.

| TABLA | COLUMNA | PROPIEDAD | EXPRESION | PROPIEDAD_2 | EXPRESION_2 | OBJETIVO |
| --- | --- | --- | --- | --- | --- | --- |
| CONFIG | ID_CONFIG | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| PROVEEDORES | ID_PROVEEDOR | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| CLIENTES | ID_CLIENTE | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| PRODUCTOS | ID_PRODUCTO | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| LOTES | ID_LOTE | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| INGRESOS | ID_INGRESO | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| EGRESOS | ID_EGRESO | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| DOCUMENTOS | ID_DOCUMENTO | Initial value | UNIQUEID() | Editable_If | FALSE | Key unica. |
| INGRESOS | ID_LOTE | Valid_If | SELECT(LOTES[ID_LOTE], [ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO]) |  |  | Mostrar solo lotes del producto seleccionado. |
| EGRESOS | ID_LOTE | Valid_If | LIST(ANY(ORDERBY(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0)), [FECHA_VENCIMIENTO], TRUE, [PRIMER_INGRESO], TRUE))) |  |  | Solo permite seleccionar el lote FEFO/FIFO con stock. |
| EGRESOS | CANTIDAD | Valid_If | [_THIS] <= [ID_LOTE].[STOCK_ACTUAL] |  |  | No vender mas del stock disponible. |
| EGRESOS | ID_LOTE | Valid_If_FEFO_FIFO | [ES_FEFO_VALIDO] = TRUE |  |  | Bloquea salida si no usa el lote FEFO/FIFO. |
| LOTES | FECHA_VENCIMIENTO | Valid_If | [FECHA_VENCIMIENTO] >= [FECHA_FABRICACION] |  |  | Vencimiento no puede ser anterior a fabricacion. |
| INGRESOS | CANTIDAD | Valid_If | [_THIS] > 0 |  |  | Cantidad positiva. |
| EGRESOS | CANTIDAD | Valid_If | [_THIS] > 0 |  |  | Cantidad positiva. |
| PRODUCTOS | CODIGO | Valid_If | COUNT(SELECT(PRODUCTOS[ID_PRODUCTO], AND([CODIGO] = [_THISROW].[CODIGO], [ID_PRODUCTO] <> [_THISROW].[ID_PRODUCTO]))) = 0 |  |  | Codigo unico por producto. |

## Paso 8 - Configurar slices para inspección

1. Haz clic en `Data`.
2. Haz clic en `Slices`.
3. Haz clic en `+ New Slice`.
4. Crea el slice `STOCK_DISPONIBLE`.
5. En `Source table`, selecciona `LOTES`.
6. En `Row filter condition`, pega:

```appsheet
[STOCK_ACTUAL] > 0
```

7. En columnas selecciona: `ID_LOTE`, `ID_PRODUCTO`, `LOTE`, `FECHA_VENCIMIENTO`, `STOCK_ACTUAL`, `ALERTA_VENCIMIENTO`, `ES_LOTE_FEFO`.
8. Haz clic en `Save`.
9. Haz clic en `+ New Slice`.
10. Crea el slice `LOTES_ALERTA_DIGEMID`.
11. En `Source table`, selecciona `LOTES`.
12. En `Row filter condition`, pega:

```appsheet
AND([STOCK_ACTUAL] > 0, IN([ALERTA_VENCIMIENTO], LIST("VENCIDO", "VENCE 30 DIAS", "VENCE 60 DIAS", "VENCE 90 DIAS")))
```

13. Haz clic en `Save`.

## Paso 9 - Crear acciones

1. Haz clic en `Behavior`.
2. Haz clic en `Actions`.
3. Haz clic en `+ New Action`.
4. En `For a record of this table`, selecciona la tabla indicada.
5. En `Action name`, escribe el valor de `ACCION`.
6. En `Do this`, selecciona `TIPO_ACCION`.
7. En `Target`, pega `EXPRESION`.
8. Haz clic en `Save`.
9. Repite para cada acción.

| TABLA | ACCION | TIPO_ACCION | EXPRESION | OBJETIVO |
| --- | --- | --- | --- | --- |
| LOTES | Ver trazabilidad del lote | App: go to another view within this app | LINKTOROW([ID_LOTE], "Trazabilidad_Detail") | Abrir vista detalle del lote con ingresos, egresos y documentos relacionados. |
| PRODUCTOS | Ver lotes del producto | App: go to another view within this app | LINKTOFILTEREDVIEW("Stock", [ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO]) | Mostrar lotes con stock del producto. |
| LOTES | Registrar egreso de lote | App: go to another view within this app | LINKTOFORM("EGRESOS_Form", "ID_PRODUCTO", [ID_PRODUCTO], "ID_LOTE", [ID_LOTE]) | Crear salida prellenando producto y lote. |
| LOTES | Registrar documento de lote | App: go to another view within this app | LINKTOFORM("DOCUMENTOS_Form", "ID_LOTE", [ID_LOTE]) | Adjuntar COA, BPM, RS, guias o facturas. |
| INGRESOS | Abrir lote | App: go to another view within this app | LINKTOROW([ID_LOTE], "LOTES_Detail") | Ir al lote relacionado. |
| EGRESOS | Abrir cliente | App: go to another view within this app | LINKTOROW([ID_CLIENTE], "CLIENTES_Detail") | Ir al cliente relacionado. |

## Paso 10 - Crear Bots

1. Haz clic en `Automation`.
2. Haz clic en `Bots`.
3. Haz clic en `+ New Bot`.
4. En `Bot name`, escribe `AUTOMATIZACION`.
5. En `Event`, selecciona el valor de `EVENTO`.
6. En `Table`, selecciona `TABLA`.
7. En condición del evento, pega `CONDICION`.
8. En `Process`, crea un paso nuevo.
9. En `Task`, selecciona `TAREA`.
10. Configura destinatario como el email del responsable técnico o administrador.
11. En el asunto usa el nombre de la automatización.
12. En el cuerpo copia el objetivo y agrega campos del registro.
13. Haz clic en `Save`.
14. Repite con cada Bot.

| AUTOMATIZACION | EVENTO | TABLA | CONDICION | TAREA | OBJETIVO |
| --- | --- | --- | --- | --- | --- |
| Alerta lotes vencidos | Scheduled daily | LOTES | SELECT(LOTES[ID_LOTE], AND([STOCK_ACTUAL] > 0, [FECHA_VENCIMIENTO] < TODAY())) | Email | Enviar alerta diaria al responsable tecnico con lotes vencidos con stock. |
| Alerta lotes por vencer 30 dias | Scheduled daily | LOTES | SELECT(LOTES[ID_LOTE], AND([STOCK_ACTUAL] > 0, [DIAS_VENCIMIENTO] >= 0, [DIAS_VENCIMIENTO] <= 30)) | Email | Enviar alerta preventiva de vencimientos criticos. |
| Alerta egreso registrado | Data change adds only | EGRESOS | TRUE | Notification | Notificar salida registrada con cliente, producto, lote y cantidad. |
| Alerta documento faltante | Scheduled weekly | LOTES | SELECT(LOTES[ID_LOTE], AND([STOCK_ACTUAL] > 0, COUNT([RELATED_DOCUMENTOS]) = 0)) | Email | Detectar lotes con stock sin documentos asociados. |

## Paso 11 - Crear Views

1. Haz clic en `UX`.
2. Haz clic en `Views`.
3. Haz clic en `+ New View`.
4. En `View name`, escribe `VISTA`.
5. En `For this data`, selecciona `TABLA_ORIGEN`.
6. En `View type`, selecciona `TIPO_VISTA`.
7. En `Position`, selecciona `Menu` por ahora.
8. En `Sort by`, usa `ORDEN_SUGERIDO` si aplica.
9. Haz clic en `Save`.
10. Repite con cada vista.

| VISTA | TIPO_VISTA | TABLA_ORIGEN | ORDEN_SUGERIDO | OBJETIVO |
| --- | --- | --- | --- | --- |
| Dashboard | Dashboard | Dashboard | LOTES, INGRESOS, EGRESOS, PRODUCTOS | Panel principal con KPIs, alertas y accesos rápidos. |
| Ingresos | Table/Deck | INGRESOS | FECHA desc | Registro y consulta de compras o ingresos. |
| Egresos | Table/Deck | EGRESOS | FECHA desc | Registro y consulta de ventas o salidas. |
| Stock | Table | LOTES | STOCK_ACTUAL desc | Mostrar columnas ID_PRODUCTO, LOTE, FECHA_VENCIMIENTO, STOCK_ACTUAL, ALERTA_VENCIMIENTO. |
| Trazabilidad | Detail | LOTES | LOTE | Detalle del lote con inline views de INGRESOS, EGRESOS y DOCUMENTOS por Ref. |
| Clientes | Table/Deck | CLIENTES | NOMBRE | Maestro de clientes. |
| Proveedores | Table/Deck | PROVEEDORES | RAZON_SOCIAL | Maestro de proveedores. |
| Productos | Table/Deck | PRODUCTOS | NOMBRE | Catalogo de productos. |
| Documentos | Table/Gallery | DOCUMENTOS | TIPO_DOCUMENTO | Documentos por lote: COA, BPM, BPA, registro sanitario, guias y facturas. |

## Paso 12 - Crear Dashboard principal DIGEMID

1. Haz clic en `UX`.
2. Haz clic en `Views`.
3. Haz clic en `+ New View`.
4. En `View name`, escribe `Dashboard`.
5. En `For this data`, selecciona `Dashboard` si existe; si no existe, selecciona cualquier tabla y luego cambia el tipo a dashboard.
6. En `View type`, selecciona `Dashboard`.
7. En `Position`, selecciona `Primary`.
8. En `View Entries`, agrega estas vistas en este orden:
   `Stock`, `Ingresos`, `Egresos`, `Trazabilidad`, `Documentos`.
9. Activa `Interactive mode`.
10. Haz clic en `Save`.

## Paso 13 - Configurar pantalla principal optimizada para inspección DIGEMID

La barra principal debe tener únicamente estas opciones:

1. `Dashboard`
2. `Ingresos`
3. `Egresos`
4. `Stock`
5. `Trazabilidad`
6. `Clientes`
7. `Proveedores`
8. `Configuración`

Configuración exacta:

1. Haz clic en `UX`.
2. Haz clic en `Views`.
3. Abre la vista `Dashboard`.
4. En `Position`, selecciona `Primary`.
5. Abre `Ingresos` y selecciona `Primary`.
6. Abre `Egresos` y selecciona `Primary`.
7. Abre `Stock` y selecciona `Primary`.
8. Abre `Trazabilidad` y selecciona `Primary`.
9. Abre `Clientes` y selecciona `Primary`.
10. Abre `Proveedores` y selecciona `Primary`.
11. Crea o abre la vista `Configuración`.
12. En `For this data`, selecciona `CONFIG`.
13. En `View type`, selecciona `Detail`.
14. En `Position`, selecciona `Primary`.
15. Para `Productos` y `Documentos`, selecciona `Menu` para que no saturen la pantalla principal.
16. Para cualquier vista automática no usada, selecciona `Ref` o `Menu`.
17. Haz clic en `Save`.

## Paso 14 - Configurar UX general

1. Haz clic en `UX`.
2. Haz clic en `Options`.
3. En `Starting view`, selecciona `Dashboard`.
4. En `Primary navigation`, deja visibles solo las 8 vistas DIGEMID.
5. En `Table view style`, usa `Table` para Stock, Ingresos y Egresos.
6. En `Detail view`, permite mostrar inline views para trazabilidad.
7. Haz clic en `Save`.

## Paso 15 - Configurar Branding con logo superior

1. Haz clic en `UX`.
2. Haz clic en `Brand`.
3. En `App logo`, sube el logo de la droguería.
4. En `App name`, escribe `Droguería - Trazabilidad DIGEMID`.
5. En `Header`, activa la visualización del logo si la opción está disponible.
6. En `Theme`, selecciona un tema claro.
7. En `Primary color`, usa un verde sanitario sobrio.
8. En `Background`, selecciona claro o blanco.
9. Haz clic en `Save`.

## Paso 16 - Configurar vistas inline de trazabilidad

1. Haz clic en `Data`.
2. Haz clic en `Columns`.
3. Abre `LOTES`.
4. Confirma que existen las columnas virtuales `RELATED_INGRESOS`, `RELATED_EGRESOS`, `RELATED_DOCUMENTOS`.
5. Haz clic en `UX`.
6. Haz clic en `Views`.
7. Abre la vista `Trazabilidad`.
8. Confirma que usa la tabla `LOTES`.
9. Confirma que el tipo es `Detail`.
10. En columnas visibles, muestra: `ID_PRODUCTO`, `LOTE`, `FECHA_FABRICACION`, `FECHA_VENCIMIENTO`, `STOCK_ACTUAL`, `ALERTA_VENCIMIENTO`, `TRAZABILIDAD_RESUMEN`, `RELATED_INGRESOS`, `RELATED_EGRESOS`, `RELATED_DOCUMENTOS`.
11. Haz clic en `Save`.

## Paso 17 - Prueba mínima antes de inspección

1. Haz clic en `Productos`.
2. Haz clic en `+`.
3. Registra un producto activo.
4. Haz clic en `Proveedores`.
5. Haz clic en `+`.
6. Registra un proveedor activo.
7. Abre la tabla `LOTES` desde menú o desde Productos.
8. Haz clic en `+`.
9. Registra un lote con fecha de vencimiento próxima.
10. Haz clic en `Ingresos`.
11. Haz clic en `+`.
12. Registra un ingreso del lote con cantidad 100.
13. Haz clic en `Stock`.
14. Verifica que `STOCK_ACTUAL` sea 100.
15. Haz clic en `Clientes`.
16. Registra un cliente.
17. Haz clic en `Egresos`.
18. Registra una salida de cantidad 10.
19. Verifica que AppSheet solo permita el lote FEFO/FIFO.
20. Vuelve a `Stock`.
21. Verifica que `STOCK_ACTUAL` sea 90.
22. Intenta registrar salida de 1000.
23. Confirma que AppSheet bloquea la salida por stock insuficiente.
24. Abre `Trazabilidad`.
25. Abre el lote.
26. Verifica que se vean ingresos, egresos y documentos relacionados.

## Paso 18 - Checklist final para publicar

1. Haz clic en `Manage`.
2. Haz clic en `Author` o `Deploy` según tu editor.
3. Revisa errores.
4. Corrige cualquier columna sin tipo correcto.
5. Confirma que todos los IDs son `Key`.
6. Confirma que labels están asignados.
7. Confirma que refs funcionan.
8. Confirma que `EGRESOS[CANTIDAD]` bloquea cantidad mayor al stock.
9. Confirma que `EGRESOS[ID_LOTE]` solo muestra el lote FEFO/FIFO.
10. Confirma que el dashboard es la pantalla inicial.
11. Confirma que el logo aparece arriba.
12. Haz clic en `Save`.