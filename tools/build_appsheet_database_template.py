from pathlib import Path

from openpyxl import Workbook, load_workbook


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "outputs"
OUTPUT = OUTPUT_DIR / "AppSheet_Drogueria_Produccion.xlsx"
MAX_ROWS = 1000


TABLES = {
    "CONFIG": [
        "ID_CONFIG",
        "RAZON_SOCIAL",
        "RUC",
        "DIRECCION",
        "TELEFONO",
        "EMAIL",
        "RESPONSABLE_TECNICO",
        "DIRECTOR_TECNICO",
        "LOGO",
        "DIAS_ALERTA",
    ],
    "PROVEEDORES": [
        "ID_PROVEEDOR",
        "RUC",
        "RAZON_SOCIAL",
        "DIRECCION",
        "TELEFONO",
        "EMAIL",
        "CONTACTO",
        "ESTADO",
    ],
    "CLIENTES": [
        "ID_CLIENTE",
        "RUC_DNI",
        "NOMBRE",
        "DIRECCION",
        "TELEFONO",
        "EMAIL",
        "ESTADO",
    ],
    "PRODUCTOS": [
        "ID_PRODUCTO",
        "CODIGO",
        "NOMBRE",
        "MARCA",
        "LABORATORIO",
        "REGISTRO_SANITARIO",
        "PRESENTACION",
        "UNIDAD",
        "TEMPERATURA",
        "ESTADO",
    ],
    "LOTES": [
        "ID_LOTE",
        "ID_PRODUCTO",
        "LOTE",
        "FECHA_FABRICACION",
        "FECHA_VENCIMIENTO",
        "PRECIO_COMPRA",
        "PRECIO_VENTA",
    ],
    "INGRESOS": [
        "ID_INGRESO",
        "FECHA",
        "ID_PROVEEDOR",
        "ID_PRODUCTO",
        "ID_LOTE",
        "GUIA",
        "FACTURA",
        "CANTIDAD",
        "USUARIO",
    ],
    "EGRESOS": [
        "ID_EGRESO",
        "FECHA",
        "ID_CLIENTE",
        "ID_PRODUCTO",
        "ID_LOTE",
        "GUIA",
        "FACTURA",
        "CANTIDAD",
        "USUARIO",
    ],
    "DOCUMENTOS": [
        "ID_DOCUMENTO",
        "ID_LOTE",
        "TIPO_DOCUMENTO",
        "ARCHIVO",
        "OBSERVACION",
    ],
}


KEYS = {
    "CONFIG": "ID_CONFIG",
    "PROVEEDORES": "ID_PROVEEDOR",
    "CLIENTES": "ID_CLIENTE",
    "PRODUCTOS": "ID_PRODUCTO",
    "LOTES": "ID_LOTE",
    "INGRESOS": "ID_INGRESO",
    "EGRESOS": "ID_EGRESO",
    "DOCUMENTOS": "ID_DOCUMENTO",
}


LABELS = {
    "CONFIG": "RAZON_SOCIAL",
    "PROVEEDORES": "RAZON_SOCIAL",
    "CLIENTES": "NOMBRE",
    "PRODUCTOS": "NOMBRE",
    "LOTES": "LOTE",
    "INGRESOS": "GUIA",
    "EGRESOS": "GUIA",
    "DOCUMENTOS": "TIPO_DOCUMENTO",
}


REFS = {
    ("LOTES", "ID_PRODUCTO"): "PRODUCTOS",
    ("INGRESOS", "ID_PROVEEDOR"): "PROVEEDORES",
    ("INGRESOS", "ID_PRODUCTO"): "PRODUCTOS",
    ("INGRESOS", "ID_LOTE"): "LOTES",
    ("EGRESOS", "ID_CLIENTE"): "CLIENTES",
    ("EGRESOS", "ID_PRODUCTO"): "PRODUCTOS",
    ("EGRESOS", "ID_LOTE"): "LOTES",
    ("DOCUMENTOS", "ID_LOTE"): "LOTES",
}


ENUMS = {
    ("PROVEEDORES", "ESTADO"): "ACTIVO,INACTIVO",
    ("CLIENTES", "ESTADO"): "ACTIVO,INACTIVO",
    ("PRODUCTOS", "PRESENTACION"): "CAJA,UNIDAD,BLISTER,FRASCO,BOLSA,AMPOLLA,TUBO,DISPLAY",
    ("PRODUCTOS", "UNIDAD"): "UNIDAD,CAJA,FRASCO,BLISTER,AMPOLLA,BOLSA",
    ("PRODUCTOS", "TEMPERATURA"): "AMBIENTE,REFRIGERADO,CONGELADO,CONTROLADA",
    ("PRODUCTOS", "ESTADO"): "ACTIVO,INACTIVO",
    ("DOCUMENTOS", "TIPO_DOCUMENTO"): "COA,BPM,BPA,REGISTRO_SANITARIO,GUIA_COMPRA,FACTURA_COMPRA,GUIA_VENTA,FACTURA_VENTA,OTRO",
}


DATES = {
    ("LOTES", "FECHA_FABRICACION"),
    ("LOTES", "FECHA_VENCIMIENTO"),
    ("INGRESOS", "FECHA"),
    ("EGRESOS", "FECHA"),
}


NUMBERS = {
    ("CONFIG", "DIAS_ALERTA"),
    ("LOTES", "PRECIO_COMPRA"),
    ("LOTES", "PRECIO_VENTA"),
    ("INGRESOS", "CANTIDAD"),
    ("EGRESOS", "CANTIDAD"),
}


IMAGES = {("CONFIG", "LOGO")}
FILES = {("DOCUMENTOS", "ARCHIVO")}


REQUIRED_FALSE = {
    ("CONFIG", "LOGO"),
    ("PROVEEDORES", "DIRECCION"),
    ("PROVEEDORES", "TELEFONO"),
    ("PROVEEDORES", "EMAIL"),
    ("PROVEEDORES", "CONTACTO"),
    ("CLIENTES", "DIRECCION"),
    ("CLIENTES", "TELEFONO"),
    ("CLIENTES", "EMAIL"),
    ("PRODUCTOS", "LABORATORIO"),
    ("PRODUCTOS", "REGISTRO_SANITARIO"),
    ("INGRESOS", "GUIA"),
    ("INGRESOS", "FACTURA"),
    ("EGRESOS", "GUIA"),
    ("EGRESOS", "FACTURA"),
    ("DOCUMENTOS", "OBSERVACION"),
}


FORMULAS = [
    [
        "LOTES",
        "RELATED_INGRESOS",
        "Virtual",
        "List",
        'REF_ROWS("INGRESOS", "ID_LOTE")',
        "Lista relacionada para trazabilidad: ingresos del lote.",
    ],
    [
        "LOTES",
        "RELATED_EGRESOS",
        "Virtual",
        "List",
        'REF_ROWS("EGRESOS", "ID_LOTE")',
        "Lista relacionada para trazabilidad: egresos del lote.",
    ],
    [
        "LOTES",
        "RELATED_DOCUMENTOS",
        "Virtual",
        "List",
        'REF_ROWS("DOCUMENTOS", "ID_LOTE")',
        "Lista relacionada para trazabilidad: documentos del lote.",
    ],
    [
        "LOTES",
        "TRAZABILIDAD_RESUMEN",
        "Virtual",
        "LongText",
        'CONCATENATE("Producto: ", [ID_PRODUCTO].[NOMBRE], " | Lote: ", [LOTE], " | Stock: ", [STOCK_ACTUAL], " | Vence: ", TEXT([FECHA_VENCIMIENTO]))',
        "Resumen legible para vista de inspeccion sanitaria.",
    ],
    [
        "LOTES",
        "TOTAL_INGRESOS",
        "Virtual",
        "Number",
        'SUM(SELECT(INGRESOS[CANTIDAD], [ID_LOTE] = [_THISROW].[ID_LOTE]))',
        "Total de unidades ingresadas para el lote.",
    ],
    [
        "LOTES",
        "TOTAL_EGRESOS",
        "Virtual",
        "Number",
        'SUM(SELECT(EGRESOS[CANTIDAD], [ID_LOTE] = [_THISROW].[ID_LOTE]))',
        "Total de unidades egresadas para el lote.",
    ],
    [
        "LOTES",
        "STOCK_ACTUAL",
        "Virtual",
        "Number",
        "[TOTAL_INGRESOS] - [TOTAL_EGRESOS]",
        "Stock por lote. No crear tabla fisica de stock.",
    ],
    [
        "LOTES",
        "DIAS_VENCIMIENTO",
        "Virtual",
        "Number",
        "[FECHA_VENCIMIENTO] - TODAY()",
        "Dias restantes para vencimiento.",
    ],
    [
        "LOTES",
        "ALERTA_VENCIMIENTO",
        "Virtual",
        "Enum",
        'IFS([STOCK_ACTUAL] <= 0, "SIN STOCK", [FECHA_VENCIMIENTO] < TODAY(), "VENCIDO", [DIAS_VENCIMIENTO] <= 30, "VENCE 30 DIAS", [DIAS_VENCIMIENTO] <= 60, "VENCE 60 DIAS", [DIAS_VENCIMIENTO] <= 90, "VENCE 90 DIAS", TRUE, "VIGENTE")',
        "Semaforo sanitario calculado en AppSheet.",
    ],
    [
        "LOTES",
        "PRIMER_INGRESO",
        "Virtual",
        "Date",
        'MIN(SELECT(INGRESOS[FECHA], [ID_LOTE] = [_THISROW].[ID_LOTE]))',
        "Fecha del primer ingreso del lote. Se usa para desempate FIFO.",
    ],
    [
        "LOTES",
        "ORDEN_FEFO_FIFO",
        "Virtual",
        "Number",
        'COUNT(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0, OR([FECHA_VENCIMIENTO] < [_THISROW].[FECHA_VENCIMIENTO], AND([FECHA_VENCIMIENTO] = [_THISROW].[FECHA_VENCIMIENTO], [PRIMER_INGRESO] < [_THISROW].[PRIMER_INGRESO]))))) + 1',
        "Orden de salida sugerido. 1 es el lote prioritario.",
    ],
    [
        "LOTES",
        "ES_LOTE_FEFO",
        "Virtual",
        "Yes/No",
        "[ORDEN_FEFO_FIFO] = 1",
        "TRUE si el lote es el primero a salir para su producto.",
    ],
    [
        "INGRESOS",
        "PRODUCTO_LOTE_OK",
        "Virtual",
        "Yes/No",
        "[ID_LOTE].[ID_PRODUCTO] = [ID_PRODUCTO]",
        "Controla que el lote seleccionado pertenezca al producto seleccionado.",
    ],
    [
        "EGRESOS",
        "STOCK_DISPONIBLE_LOTE",
        "Virtual",
        "Number",
        "[ID_LOTE].[STOCK_ACTUAL]",
        "Stock disponible del lote antes de registrar salida.",
    ],
    [
        "EGRESOS",
        "ES_FEFO_VALIDO",
        "Virtual",
        "Yes/No",
        '[ID_LOTE] = ANY(ORDERBY(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0)), [FECHA_VENCIMIENTO], TRUE, [PRIMER_INGRESO], TRUE))',
        "Valida FEFO y FIFO para la salida.",
    ],
]


VALIDATIONS = [
    ["CONFIG", "ID_CONFIG", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["PROVEEDORES", "ID_PROVEEDOR", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["CLIENTES", "ID_CLIENTE", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["PRODUCTOS", "ID_PRODUCTO", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["LOTES", "ID_LOTE", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["INGRESOS", "ID_INGRESO", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["EGRESOS", "ID_EGRESO", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["DOCUMENTOS", "ID_DOCUMENTO", "Initial value", "UNIQUEID()", "Editable_If", "FALSE", "Key unica."],
    ["INGRESOS", "ID_LOTE", "Valid_If", "SELECT(LOTES[ID_LOTE], [ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO])", "", "", "Mostrar solo lotes del producto seleccionado."],
    ["EGRESOS", "ID_LOTE", "Valid_If", "LIST(ANY(ORDERBY(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0)), [FECHA_VENCIMIENTO], TRUE, [PRIMER_INGRESO], TRUE)))", "", "", "Solo permite seleccionar el lote FEFO/FIFO con stock."],
    ["EGRESOS", "CANTIDAD", "Valid_If", "[_THIS] <= [ID_LOTE].[STOCK_ACTUAL]", "", "", "No vender mas del stock disponible."],
    ["EGRESOS", "ID_LOTE", "Valid_If_FEFO_FIFO", "[ES_FEFO_VALIDO] = TRUE", "", "", "Bloquea salida si no usa el lote FEFO/FIFO."],
    ["LOTES", "FECHA_VENCIMIENTO", "Valid_If", "[FECHA_VENCIMIENTO] >= [FECHA_FABRICACION]", "", "", "Vencimiento no puede ser anterior a fabricacion."],
    ["INGRESOS", "CANTIDAD", "Valid_If", "[_THIS] > 0", "", "", "Cantidad positiva."],
    ["EGRESOS", "CANTIDAD", "Valid_If", "[_THIS] > 0", "", "", "Cantidad positiva."],
    ["PRODUCTOS", "CODIGO", "Valid_If", "COUNT(SELECT(PRODUCTOS[ID_PRODUCTO], AND([CODIGO] = [_THISROW].[CODIGO], [ID_PRODUCTO] <> [_THISROW].[ID_PRODUCTO]))) = 0", "", "", "Codigo unico por producto."],
]


ACTIONS = [
    ["LOTES", "Ver trazabilidad del lote", "App: go to another view within this app", 'LINKTOROW([ID_LOTE], "Trazabilidad_Detail")', "Abrir vista detalle del lote con ingresos, egresos y documentos relacionados."],
    ["PRODUCTOS", "Ver lotes del producto", "App: go to another view within this app", 'LINKTOFILTEREDVIEW("Stock", [ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO])', "Mostrar lotes con stock del producto."],
    ["LOTES", "Registrar egreso de lote", "App: go to another view within this app", 'LINKTOFORM("EGRESOS_Form", "ID_PRODUCTO", [ID_PRODUCTO], "ID_LOTE", [ID_LOTE])', "Crear salida prellenando producto y lote."],
    ["LOTES", "Registrar documento de lote", "App: go to another view within this app", 'LINKTOFORM("DOCUMENTOS_Form", "ID_LOTE", [ID_LOTE])', "Adjuntar COA, BPM, RS, guias o facturas."],
    ["INGRESOS", "Abrir lote", "App: go to another view within this app", 'LINKTOROW([ID_LOTE], "LOTES_Detail")', "Ir al lote relacionado."],
    ["EGRESOS", "Abrir cliente", "App: go to another view within this app", 'LINKTOROW([ID_CLIENTE], "CLIENTES_Detail")', "Ir al cliente relacionado."],
]


VIEWS = [
    ["Dashboard", "Dashboard", "Dashboard", "LOTES, INGRESOS, EGRESOS, PRODUCTOS", "Panel principal con KPIs, alertas y accesos rápidos."],
    ["Ingresos", "Table/Deck", "INGRESOS", "FECHA desc", "Registro y consulta de compras o ingresos."],
    ["Egresos", "Table/Deck", "EGRESOS", "FECHA desc", "Registro y consulta de ventas o salidas."],
    ["Stock", "Table", "LOTES", "STOCK_ACTUAL desc", "Mostrar columnas ID_PRODUCTO, LOTE, FECHA_VENCIMIENTO, STOCK_ACTUAL, ALERTA_VENCIMIENTO."],
    ["Trazabilidad", "Detail", "LOTES", "LOTE", "Detalle del lote con inline views de INGRESOS, EGRESOS y DOCUMENTOS por Ref."],
    ["Clientes", "Table/Deck", "CLIENTES", "NOMBRE", "Maestro de clientes."],
    ["Proveedores", "Table/Deck", "PROVEEDORES", "RAZON_SOCIAL", "Maestro de proveedores."],
    ["Productos", "Table/Deck", "PRODUCTOS", "NOMBRE", "Catalogo de productos."],
    ["Documentos", "Table/Gallery", "DOCUMENTOS", "TIPO_DOCUMENTO", "Documentos por lote: COA, BPM, BPA, registro sanitario, guias y facturas."],
]


AUTOMATIONS = [
    [
        "Alerta lotes vencidos",
        "Scheduled daily",
        "LOTES",
        'SELECT(LOTES[ID_LOTE], AND([STOCK_ACTUAL] > 0, [FECHA_VENCIMIENTO] < TODAY()))',
        "Email",
        "Enviar alerta diaria al responsable tecnico con lotes vencidos con stock.",
    ],
    [
        "Alerta lotes por vencer 30 dias",
        "Scheduled daily",
        "LOTES",
        'SELECT(LOTES[ID_LOTE], AND([STOCK_ACTUAL] > 0, [DIAS_VENCIMIENTO] >= 0, [DIAS_VENCIMIENTO] <= 30))',
        "Email",
        "Enviar alerta preventiva de vencimientos criticos.",
    ],
    [
        "Alerta egreso registrado",
        "Data change adds only",
        "EGRESOS",
        "TRUE",
        "Notification",
        "Notificar salida registrada con cliente, producto, lote y cantidad.",
    ],
    [
        "Alerta documento faltante",
        "Scheduled weekly",
        "LOTES",
        'SELECT(LOTES[ID_LOTE], AND([STOCK_ACTUAL] > 0, COUNT([RELATED_DOCUMENTOS]) = 0))',
        "Email",
        "Detectar lotes con stock sin documentos asociados.",
    ],
]


def col_letter(index):
    letters = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        letters = chr(65 + remainder) + letters
    return letters


def add_table(ws, name, headers):
    ws.append(headers)


def app_config_rows():
    rows = []
    for table, headers in TABLES.items():
        for header in headers:
            key = (table, header)
            rows.append(
                [
                    table,
                    header,
                    appsheet_type(table, header),
                    "TRUE" if header == KEYS[table] else "FALSE",
                    "TRUE" if header == LABELS[table] else "FALSE",
                    REFS.get(key, ""),
                    ENUMS.get(key, ""),
                    "TRUE" if key in DATES else "FALSE",
                    "TRUE" if key in IMAGES else "FALSE",
                    "TRUE" if key in FILES else "FALSE",
                    "TRUE" if is_required(table, header) else "FALSE",
                    editable_if(table, header),
                    initial_value(table, header),
                    valid_if(table, header),
                    app_formula(table, header),
                    note_for(table, header),
                ]
            )
    for table, column, column_type, app_type, formula, objective in FORMULAS:
        rows.append(
            [
                table,
                column,
                app_type,
                "FALSE",
                "FALSE",
                "",
                "",
                "TRUE" if app_type == "Date" else "FALSE",
                "FALSE",
                "FALSE",
                "FALSE",
                "FALSE",
                "",
                "",
                formula,
                objective,
            ]
        )
    return rows


def appsheet_type(table, header):
    key = (table, header)
    if header == KEYS[table]:
        return "Text"
    if key in REFS:
        return "Ref"
    if key in ENUMS:
        return "Enum"
    if key in DATES:
        return "Date"
    if key in IMAGES:
        return "Image"
    if key in FILES:
        return "File"
    if key in NUMBERS:
        return "Number"
    if "EMAIL" in header:
        return "Email"
    if "TELEFONO" in header:
        return "Phone"
    return "Text"


def is_required(table, header):
    if header == KEYS[table]:
        return True
    return (table, header) not in REQUIRED_FALSE


def editable_if(table, header):
    if header == KEYS[table]:
        return "FALSE"
    return "TRUE"


def initial_value(table, header):
    if header == KEYS[table]:
        return "UNIQUEID()"
    if header == "FECHA":
        return "TODAY()"
    if header == "USUARIO":
        return "USEREMAIL()"
    if header == "ESTADO":
        return '"ACTIVO"'
    if (table, header) == ("CONFIG", "DIAS_ALERTA"):
        return "90"
    return ""


def valid_if(table, header):
    key = (table, header)
    if key in ENUMS:
        return "LIST(" + ",".join(f'"{value}"' for value in ENUMS[key].split(",")) + ")"
    if (table, header) == ("INGRESOS", "ID_LOTE"):
        return "SELECT(LOTES[ID_LOTE], [ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO])"
    if (table, header) == ("EGRESOS", "ID_LOTE"):
        return "LIST(ANY(ORDERBY(SELECT(LOTES[ID_LOTE], AND([ID_PRODUCTO] = [_THISROW].[ID_PRODUCTO], [STOCK_ACTUAL] > 0)), [FECHA_VENCIMIENTO], TRUE, [PRIMER_INGRESO], TRUE)))"
    if (table, header) == ("EGRESOS", "CANTIDAD"):
        return "AND([_THIS] > 0, [_THIS] <= [ID_LOTE].[STOCK_ACTUAL])"
    if (table, header) == ("INGRESOS", "CANTIDAD"):
        return "[_THIS] > 0"
    if (table, header) == ("LOTES", "FECHA_VENCIMIENTO"):
        return "[FECHA_VENCIMIENTO] >= [FECHA_FABRICACION]"
    if (table, header) == ("PRODUCTOS", "CODIGO"):
        return "COUNT(SELECT(PRODUCTOS[ID_PRODUCTO], AND([CODIGO] = [_THISROW].[CODIGO], [ID_PRODUCTO] <> [_THISROW].[ID_PRODUCTO]))) = 0"
    return ""


def app_formula(table, header):
    return ""


def note_for(table, header):
    if header == KEYS[table]:
        return 'Usar UNIQUEID() como Initial value en AppSheet.'
    if (table, header) in REFS:
        return f"Configurar como Ref hacia la tabla {REFS[(table, header)]}."
    if table == "LOTES" and header == "ID_PRODUCTO":
        return "Relaciona cada lote con su producto."
    if table == "INGRESOS":
        return "Movimiento de entrada. Stock se calcula en AppSheet desde INGRESOS menos EGRESOS."
    if table == "EGRESOS":
        return "Movimiento de salida. Validar stock y FEFO/FIFO en AppSheet."
    if table == "DOCUMENTOS" and header == "ARCHIVO":
        return "Guardar archivo o enlace de soporte documental."
    return ""


def add_app_config(wb):
    ws = wb.create_sheet("APP_CONFIG")
    headers = [
        "TABLA",
        "COLUMNA",
        "TIPO_APPSHEET",
        "ES_KEY",
        "ES_LABEL",
        "REF_TABLA",
        "ENUM_VALUES",
        "ES_DATE",
        "ES_IMAGE",
        "ES_FILE",
        "REQUIRED",
        "EDITABLE",
        "INITIAL_VALUE",
        "VALID_IF",
        "APP_FORMULA",
        "NOTAS",
    ]
    add_table(ws, "APP_CONFIG", headers)
    for row in app_config_rows():
        ws.append(row)


def add_rows_sheet(wb, name, headers, rows, widths=None):
    ws = wb.create_sheet(name)
    add_table(ws, name, headers)
    for row in rows:
        ws.append(row)


def add_appsheet_formulas(wb):
    add_rows_sheet(
        wb,
        "APPSHEET_FORMULAS",
        ["TABLA", "COLUMNA", "COLUMNA_TIPO", "TIPO_APPSHEET", "FORMULA_APPSHEET", "OBJETIVO"],
        FORMULAS,
        [18, 24, 16, 16, 120, 60],
    )


def add_appsheet_validations(wb):
    add_rows_sheet(
        wb,
        "APPSHEET_VALIDATIONS",
        ["TABLA", "COLUMNA", "PROPIEDAD", "EXPRESION", "PROPIEDAD_2", "EXPRESION_2", "OBJETIVO"],
        VALIDATIONS,
        [18, 24, 18, 120, 18, 40, 70],
    )


def add_appsheet_actions(wb):
    add_rows_sheet(
        wb,
        "APPSHEET_ACTIONS",
        ["TABLA", "ACCION", "TIPO_ACCION", "EXPRESION", "OBJETIVO"],
        ACTIONS,
        [18, 32, 38, 100, 70],
    )


def add_appsheet_views(wb):
    add_rows_sheet(
        wb,
        "APPSHEET_VIEWS",
        ["VISTA", "TIPO_VISTA", "TABLA_ORIGEN", "ORDEN_SUGERIDO", "OBJETIVO"],
        VIEWS,
        [24, 18, 34, 32, 90],
    )


def add_appsheet_automations(wb):
    add_rows_sheet(
        wb,
        "APPSHEET_AUTOMATIONS",
        ["AUTOMATIZACION", "EVENTO", "TABLA", "CONDICION", "TAREA", "OBJETIVO"],
        AUTOMATIONS,
        [30, 24, 18, 110, 20, 80],
    )


def add_readme(wb):
    ws = wb.create_sheet("README")
    headers = ["PASO", "ACCION", "DETALLE"]
    add_table(ws, "README", headers)
    rows = [
        [1, "Subir archivo", "Suba este .xlsx a Google Drive."],
        [2, "Abrir como Google Sheets", "Abra el archivo con Google Sheets y confirme que cada hoja conserva la fila 1 como encabezados. No hay diseno, filas de ejemplo ni formulas de Excel."],
        [3, "Crear app", "En AppSheet seleccione Make a new app > Start with existing data."],
        [4, "Seleccionar origen", "Elija el Google Sheet generado desde este archivo."],
        [5, "Agregar tablas de negocio", "Agregue solo CONFIG, PROVEEDORES, CLIENTES, PRODUCTOS, LOTES, INGRESOS, EGRESOS y DOCUMENTOS como tablas de datos de la app."],
        [6, "Usar hojas de configuracion", "APP_CONFIG, APPSHEET_FORMULAS, APPSHEET_VALIDATIONS, APPSHEET_ACTIONS y APPSHEET_VIEWS son guias de implementacion, no tablas operativas para usuarios finales."],
        [7, "Configurar keys", "En Data > Columns, marque cada ID_* como Key y use Initial value = UNIQUEID()."],
        [8, "Configurar labels", "Use APP_CONFIG para definir la columna Label recomendada por tabla."],
        [9, "Configurar refs", "Configure las columnas Ref segun APP_CONFIG. Esto construye la trazabilidad por relaciones."],
        [10, "Configurar tipos", "Configure Enum, Date, Image, File, Email, Phone y Number segun APP_CONFIG."],
        [11, "Crear columnas virtuales", "Copie las expresiones de APPSHEET_FORMULAS. El stock vive como columna virtual en LOTES."],
        [12, "Validar egresos", "Copie las reglas de APPSHEET_VALIDATIONS para impedir stock negativo y obligar FEFO/FIFO."],
        [13, "Crear acciones", "Configure las acciones sugeridas en APPSHEET_ACTIONS para navegar a trazabilidad, documentos y formularios relacionados."],
        [14, "Crear vistas", "Configure vistas recomendadas desde APPSHEET_VIEWS: Dashboard, Ingresos, Egresos, Stock, Trazabilidad, Clientes, Proveedores y Productos."],
        [15, "Crear automatizaciones", "Configure bots basicos desde APPSHEET_AUTOMATIONS: vencidos, por vencer, egreso registrado y documentos faltantes."],
        [16, "No crear tablas derivadas", "No cree tablas STOCK ni TRAZABILIDAD. Stock se calcula; trazabilidad se ve por Ref desde LOTES."],
        [17, "Probar antes de publicar", "Registre un producto, proveedor, lote, ingreso y egreso. Verifique STOCK_ACTUAL, ES_FEFO_VALIDO y Valid_If de cantidad."],
        [18, "Copiar formulas", "En Data > Columns cree las virtual columns listadas en APPSHEET_FORMULAS y pegue cada FORMULA_APPSHEET en App formula."],
        [19, "Copiar validaciones", "En Data > Columns copie VALID_IF desde APP_CONFIG o APPSHEET_VALIDATIONS en la propiedad Valid if de cada columna."],
    ]
    for row in rows:
        ws.append(row)


def build():
    OUTPUT_DIR.mkdir(exist_ok=True)
    wb = Workbook()
    wb.remove(wb.active)
    for name, headers in TABLES.items():
        ws = wb.create_sheet(name)
        add_table(ws, name, headers)
    add_app_config(wb)
    add_appsheet_formulas(wb)
    add_appsheet_validations(wb)
    add_appsheet_actions(wb)
    add_appsheet_views(wb)
    add_appsheet_automations(wb)
    add_readme(wb)
    wb.save(OUTPUT)


def verify():
    wb = load_workbook(OUTPUT, data_only=False)
    expected = list(TABLES) + [
        "APP_CONFIG",
        "APPSHEET_FORMULAS",
        "APPSHEET_VALIDATIONS",
        "APPSHEET_ACTIONS",
        "APPSHEET_VIEWS",
        "APPSHEET_AUTOMATIONS",
        "README",
    ]
    assert wb.sheetnames == expected, wb.sheetnames
    for sheet_name in expected:
        ws = wb[sheet_name]
        assert not ws.merged_cells.ranges, f"{sheet_name} has merged cells"
        assert ws.max_row >= 1
        assert all(ws.cell(1, col).value for col in range(1, ws.max_column + 1))
    for table, key in KEYS.items():
        assert wb[table]["A1"].value == key
    assert "STOCK" not in wb.sheetnames
    assert "TRAZABILIDAD" not in wb.sheetnames


if __name__ == "__main__":
    build()
    verify()
    print(OUTPUT)
