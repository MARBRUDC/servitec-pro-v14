from copy import copy
from pathlib import Path

from openpyxl import load_workbook
from openpyxl.styles import Alignment, Font, PatternFill, Protection
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.table import Table, TableStyleInfo


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\MarlonB\Downloads\ERP_Drogueria_Trazabilidad_Codex.xlsx")
OUTPUT_DIR = ROOT / "outputs"
OUTPUT = OUTPUT_DIR / "Plantilla_Google_Sheets_Drogueria_Trazabilidad.xlsx"
MAX_ROWS = 500


TEAL = "0F766E"
DARK = "10232D"
LIGHT = "EAF4F2"
WARN = "FFF6DB"
BAD = "FFEBE7"
LINE = "D9E2E7"


def style_header(ws, row=1, max_col=None):
    max_col = max_col or ws.max_column
    for cell in ws[row][:max_col]:
        cell.fill = PatternFill("solid", fgColor=TEAL)
        cell.font = Font(color="FFFFFF", bold=True)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.freeze_panes = f"A{row + 1}"
    ws.auto_filter.ref = ws.dimensions


def set_widths(ws, widths):
    for col, width in widths.items():
        ws.column_dimensions[col].width = width


def protect_sheet(ws, password="drogueria"):
    ws.protection.sheet = True
    ws.protection.password = password
    ws.protection.enable()


def unlock_range(ws, cell_range):
    for row in ws[cell_range]:
        for cell in row:
            cell.protection = Protection(locked=False)


def clear_validations(ws):
    ws.data_validations.dataValidation = []


def add_list_validation(ws, cell_range, formula):
    dv = DataValidation(type="list", formula1=formula, allow_blank=True)
    dv.error = "Seleccione un valor de la lista o revise el maestro."
    dv.errorTitle = "Valor no valido"
    ws.add_data_validation(dv)
    dv.add(cell_range)


def add_decimal_validation(ws, cell_range, minimum=0):
    dv = DataValidation(type="decimal", operator="greaterThanOrEqual", formula1=str(minimum), allow_blank=True)
    dv.error = "Ingrese un numero mayor o igual a cero."
    dv.errorTitle = "Cantidad no valida"
    ws.add_data_validation(dv)
    dv.add(cell_range)


def add_date_validation(ws, cell_range):
    dv = DataValidation(type="date", operator="greaterThan", formula1="DATE(2000,1,1)", allow_blank=True)
    dv.error = "Ingrese una fecha valida."
    dv.errorTitle = "Fecha no valida"
    ws.add_data_validation(dv)
    dv.add(cell_range)


def fill_formula_down(ws, col, first_formula, start=2, end=MAX_ROWS):
    ws[f"{col}{start}"] = first_formula
    for row in range(start + 1, end + 1):
        formula = first_formula.replace("2", str(row))
        ws[f"{col}{row}"] = formula


def ensure_sheet(wb, name):
    if name in wb.sheetnames:
        ws = wb[name]
        ws.delete_rows(1, ws.max_row)
        return ws
    return wb.create_sheet(name)


def add_or_replace_table(ws, name, ref):
    ws._tables = {}
    table = Table(displayName=name, ref=ref)
    table.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True, showColumnStripes=False)
    ws.add_table(table)


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    wb = load_workbook(SOURCE)

    # Lists for Google Sheets data validation.
    listas = wb["Listas"]
    listas["C1"] = "Tipo documento"
    for i, value in enumerate(
        [
            "BPM",
            "BPA",
            "COA / Certificado de analisis",
            "Registro sanitario",
            "Guia compra",
            "Factura compra",
            "Guia venta",
            "Factura venta",
        ],
        start=2,
    ):
        listas[f"C{i}"] = value
    listas["D1"] = "Rol"
    for i, value in enumerate(["Administrador", "Director Tecnico", "Almacen", "Ventas", "Consulta"], start=2):
        listas[f"D{i}"] = value
    listas["E1"] = "Estado documento"
    for i, value in enumerate(["Vigente", "Vencido", "Pendiente"], start=2):
        listas[f"E{i}"] = value
    style_header(listas)
    protect_sheet(listas)

    # Instructions.
    instrucciones = ensure_sheet(wb, "INSTRUCCIONES")
    instrucciones.append(["PLANTILLA GOOGLE SHEETS - DROGUERIA Y TRAZABILIDAD"])
    instrucciones.append(["Uso", "Subir este archivo a Google Drive y abrir con Google Sheets. No requiere Apps Script, backend ni instalacion."])
    instrucciones.append(["Flujo", "1. Config_Drogueria  2. Productos  3. Entradas_Compras  4. Salidas_Ventas  5. Dashboard/Inventario/Kardex/Trazabilidad"])
    instrucciones.append(["Regla stock", "Stock por lote = SUMA ingresos del producto+lote - SUMA salidas del producto+lote."])
    instrucciones.append(["Regla FEFO/FIFO", "Debe salir primero el lote con vencimiento mas cercano; si empatan, primero el lote con fecha de ingreso mas antigua."])
    instrucciones.append(["Proteccion", "Hojas calculadas protegidas. Capture datos solo en celdas blancas de hojas operativas."])
    instrucciones.append(["Respaldo", "En Google Sheets use Archivo > Descargar para guardar copias XLSX/PDF/CSV."])
    instrucciones.merge_cells("A1:B1")
    instrucciones["A1"].fill = PatternFill("solid", fgColor=DARK)
    instrucciones["A1"].font = Font(color="FFFFFF", bold=True, size=14)
    set_widths(instrucciones, {"A": 22, "B": 110})
    protect_sheet(instrucciones)

    # Config.
    config = wb["Config_Drogueria"]
    config["A17"] = "Campos editables"
    config["B17"] = "Complete datos de drogueria y pegue URL del logo en F3."
    config["A18"] = "Estado plantilla"
    config["B18"] = "Lista para Google Sheets"
    set_widths(config, {"A": 30, "B": 45, "C": 35, "E": 18, "F": 60})
    config.sheet_view.showGridLines = False
    unlock_range(config, "B3:B14")
    unlock_range(config, "F3:F3")
    protect_sheet(config)

    # Productos.
    productos = wb["Productos"]
    style_header(productos)
    set_widths(productos, {"A": 14, "B": 32, "C": 20, "D": 28, "E": 18, "F": 16, "G": 16, "H": 24, "I": 28, "J": 14, "K": 14, "L": 28})
    clear_validations(productos)
    add_list_validation(productos, f"E2:E{MAX_ROWS}", "Listas!$B$1:$B$6")
    add_list_validation(productos, f"K2:K{MAX_ROWS}", "Listas!$B$7:$B$8")
    add_decimal_validation(productos, f"G2:G{MAX_ROWS}", 0)
    add_decimal_validation(productos, f"J2:J{MAX_ROWS}", 0)
    unlock_range(productos, f"A2:L{MAX_ROWS}")
    protect_sheet(productos)

    # Entradas.
    entradas = wb["Entradas_Compras"]
    style_header(entradas)
    set_widths(entradas, {"A": 14, "B": 16, "C": 16, "D": 16, "E": 26, "F": 16, "G": 28, "H": 20, "I": 14, "J": 16, "K": 16, "L": 16, "M": 14, "N": 14, "O": 14, "P": 14, "Q": 14, "R": 18, "S": 18, "T": 22, "U": 14, "V": 24})
    clear_validations(entradas)
    add_list_validation(entradas, f"F2:F{MAX_ROWS}", "Productos!$A$2:$A$500")
    add_list_validation(entradas, f"L2:L{MAX_ROWS}", "Listas!$B$1:$B$6")
    add_list_validation(entradas, f"U2:U{MAX_ROWS}", "Listas!$E$2:$E$4")
    for rng in ["B2:B500", "J2:J500", "K2:K500"]:
        add_date_validation(entradas, rng)
    for rng in ["M2:M500", "N2:N500", "O2:O500", "P2:P500", "Q2:Q500"]:
        add_decimal_validation(entradas, rng, 0)
    for row in range(2, MAX_ROWS + 1):
        entradas[f"G{row}"] = f'=IFERROR(VLOOKUP($F{row},Productos!$A:$L,2,FALSE),"")'
        entradas[f"H{row}"] = f'=IFERROR(VLOOKUP($F{row},Productos!$A:$L,3,FALSE),"")'
        entradas[f"L{row}"] = f'=IF($F{row}="","",IFERROR(VLOOKUP($F{row},Productos!$A:$L,5,FALSE),""))'
        entradas[f"N{row}"] = f'=IF($F{row}="","",IFERROR(VLOOKUP($F{row},Productos!$A:$L,7,FALSE),1))'
        entradas[f"O{row}"] = f'=IF($F{row}="","",IF($L{row}="Caja",$M{row}*$N{row},$M{row}))'
        entradas[f"Q{row}"] = f'=IF($O{row}="","",$O{row}*$P{row})'
        entradas[f"T{row}"] = f'=IFERROR(VLOOKUP($F{row},Productos!$A:$L,8,FALSE),"")'
    unlock_range(entradas, f"A2:F{MAX_ROWS}")
    unlock_range(entradas, f"I2:K{MAX_ROWS}")
    unlock_range(entradas, f"M2:M{MAX_ROWS}")
    unlock_range(entradas, f"P2:S{MAX_ROWS}")
    unlock_range(entradas, f"U2:V{MAX_ROWS}")
    protect_sheet(entradas)

    # Inventario.
    inventario = wb["Inventario_Lotes"]
    style_header(inventario)
    set_widths(inventario, {"A": 16, "B": 28, "C": 20, "D": 16, "E": 14, "F": 16, "G": 16, "H": 12, "I": 18, "J": 16, "K": 16, "L": 14, "M": 16, "N": 16, "O": 16, "P": 16, "Q": 22, "R": 16, "S": 55, "T": 24})
    for row in range(2, MAX_ROWS + 1):
        inventario[f"A{row}"] = f'=IF(Entradas_Compras!$F{row}="","",Entradas_Compras!$F{row})'
        inventario[f"B{row}"] = f'=IF($A{row}="","",Entradas_Compras!$G{row})'
        inventario[f"C{row}"] = f'=IF($A{row}="","",Entradas_Compras!$H{row})'
        inventario[f"D{row}"] = f'=IF($A{row}="","",Entradas_Compras!$L{row})'
        inventario[f"E{row}"] = f'=IF($A{row}="","",Entradas_Compras!$I{row})'
        inventario[f"F{row}"] = f'=IF($A{row}="","",Entradas_Compras!$J{row})'
        inventario[f"G{row}"] = f'=IF($A{row}="","",Entradas_Compras!$K{row})'
        inventario[f"H{row}"] = f'=IF($G{row}="","",$G{row}-TODAY())'
        inventario[f"I{row}"] = f'=IF($A{row}="","",IF($G{row}<TODAY(),"VENCIDO",IF($G{row}<=TODAY()+30,"VENCE 30 DIAS",IF($G{row}<=TODAY()+60,"VENCE 60 DIAS",IF($G{row}<=TODAY()+90,"VENCE 90 DIAS","VIGENTE")))))'
        inventario[f"J{row}"] = f'=IF($A{row}="","",SUMIFS(Entradas_Compras!$O:$O,Entradas_Compras!$F:$F,$A{row},Entradas_Compras!$I:$I,$E{row}))'
        inventario[f"K{row}"] = f'=IF($A{row}="","",SUMIFS(Salidas_Ventas!$I:$I,Salidas_Ventas!$E:$E,$A{row},Salidas_Ventas!$H:$H,$E{row}))'
        inventario[f"L{row}"] = f'=IF($A{row}="","",$J{row}-$K{row})'
        inventario[f"M{row}"] = f'=IFERROR(SUMIFS(Entradas_Compras!$Q:$Q,Entradas_Compras!$F:$F,$A{row},Entradas_Compras!$I:$I,$E{row})/$J{row},0)'
        inventario[f"N{row}"] = f'=IFERROR(AVERAGEIFS(Salidas_Ventas!$J:$J,Salidas_Ventas!$E:$E,$A{row},Salidas_Ventas!$H:$H,$E{row}),0)'
        inventario[f"O{row}"] = f'=IF($A{row}="","",$L{row}*$M{row})'
        inventario[f"P{row}"] = f'=IF($A{row}="","",$L{row}*$N{row})'
        inventario[f"Q{row}"] = f'=IF($A{row}="","",IF($L{row}<=0,"SIN STOCK",IF($E{row}=INDEX(SORT(FILTER({{$E$2:$E$500,$G$2:$G$500,$F$2:$F$500}},$A$2:$A$500=$A{row},$L$2:$L$500>0),2,TRUE,3,TRUE),1,1),"PROXIMO FEFO/FIFO","EN ESPERA")))'
        inventario[f"R{row}"] = f'=IF($A{row}="","",Entradas_Compras!$C{row})'
        inventario[f"S{row}"] = f'=IF($A{row}="","","COA: "&Entradas_Compras!$S{row}&" | BPM/BPA: "&Entradas_Compras!$R{row}&" | RS: "&Entradas_Compras!$T{row})'
        inventario[f"T{row}"] = f'=IF($A{row}="","",Entradas_Compras!$V{row})'
    protect_sheet(inventario)

    # Salidas.
    salidas = wb["Salidas_Ventas"]
    salidas["O1"] = "Lote FEFO/FIFO sugerido"
    style_header(salidas)
    set_widths(salidas, {"A": 14, "B": 16, "C": 16, "D": 26, "E": 16, "F": 28, "G": 20, "H": 14, "I": 14, "J": 14, "K": 14, "L": 16, "M": 16, "N": 16, "O": 22, "P": 18, "Q": 22, "R": 24})
    clear_validations(salidas)
    add_list_validation(salidas, f"E2:E{MAX_ROWS}", "Productos!$A$2:$A$500")
    add_list_validation(salidas, f"H2:H{MAX_ROWS}", "Entradas_Compras!$I$2:$I$500")
    add_date_validation(salidas, f"B2:B{MAX_ROWS}")
    add_decimal_validation(salidas, f"I2:I{MAX_ROWS}", 0)
    add_decimal_validation(salidas, f"J2:J{MAX_ROWS}", 0)
    for row in range(2, MAX_ROWS + 1):
        salidas[f"F{row}"] = f'=IFERROR(VLOOKUP($E{row},Productos!$A:$L,2,FALSE),"")'
        salidas[f"G{row}"] = f'=IFERROR(VLOOKUP($E{row},Productos!$A:$L,3,FALSE),"")'
        salidas[f"K{row}"] = f'=IF($I{row}="","",$I{row}*$J{row})'
        salidas[f"L{row}"] = f'=IF($E{row}="","",SUMIFS(Entradas_Compras!$O:$O,Entradas_Compras!$F:$F,$E{row},Entradas_Compras!$I:$I,$H{row})-SUMIFS($I$1:I{row-1},$E$1:E{row-1},$E{row},$H$1:H{row-1},$H{row}))'
        salidas[f"M{row}"] = f'=IF($L{row}="","",$L{row}-$I{row})'
        salidas[f"N{row}"] = f'=IFERROR(MINIFS(Entradas_Compras!$K:$K,Entradas_Compras!$F:$F,$E{row},Entradas_Compras!$I:$I,$H{row}),"")'
        salidas[f"O{row}"] = f'=IFERROR(INDEX(SORT(FILTER({{Inventario_Lotes!$E$2:$E$500,Inventario_Lotes!$G$2:$G$500,Inventario_Lotes!$F$2:$F$500}},Inventario_Lotes!$A$2:$A$500=$E{row},Inventario_Lotes!$L$2:$L$500>0),2,TRUE,3,TRUE),1,1),"")'
        salidas[f"P{row}"] = f'=IF($E{row}="","",IF($I{row}<=$L{row},"OK STOCK","ERROR: SIN STOCK"))'
        salidas[f"Q{row}"] = f'=IF($E{row}="","",IF($H{row}=$O{row},"OK FEFO/FIFO","REVISAR: debe salir lote "&$O{row}))'
    unlock_range(salidas, f"A2:E{MAX_ROWS}")
    unlock_range(salidas, f"H2:J{MAX_ROWS}")
    unlock_range(salidas, f"R2:R{MAX_ROWS}")
    protect_sheet(salidas)

    # Kardex.
    kardex = wb["Kardex"]
    style_header(kardex)
    set_widths(kardex, {"A": 12, "B": 16, "C": 18, "D": 26, "E": 16, "F": 28, "G": 14, "H": 14, "I": 14, "J": 14, "K": 14, "L": 14, "M": 24})
    for row in range(2, 252):
        src = row
        kardex[f"A{row}"] = f'=IF(Entradas_Compras!$A{src}="","","ENTRADA")'
        kardex[f"B{row}"] = f'=IF($A{row}="","",Entradas_Compras!$B{src})'
        kardex[f"C{row}"] = f'=IF($A{row}="","",Entradas_Compras!$C{src})'
        kardex[f"D{row}"] = f'=IF($A{row}="","",Entradas_Compras!$E{src})'
        kardex[f"E{row}"] = f'=IF($A{row}="","",Entradas_Compras!$F{src})'
        kardex[f"F{row}"] = f'=IF($A{row}="","",Entradas_Compras!$G{src})'
        kardex[f"G{row}"] = f'=IF($A{row}="","",Entradas_Compras!$I{src})'
        kardex[f"H{row}"] = f'=IF($A{row}="","",Entradas_Compras!$O{src})'
        kardex[f"I{row}"] = f'=IF($A{row}="","",0)'
        kardex[f"J{row}"] = f'=IF($E{row}="","",SUMIFS(Entradas_Compras!$O:$O,Entradas_Compras!$F:$F,$E{row},Entradas_Compras!$I:$I,$G{row})-SUMIFS(Salidas_Ventas!$I:$I,Salidas_Ventas!$E:$E,$E{row},Salidas_Ventas!$H:$H,$G{row}))'
        kardex[f"K{row}"] = f'=IF($A{row}="","",Entradas_Compras!$P{src})'
        kardex[f"L{row}"] = f'=IF($A{row}="","",Entradas_Compras!$Q{src})'
        kardex[f"M{row}"] = f'=IF($A{row}="","",Entradas_Compras!$V{src})'
    for row in range(252, 502):
        src = row - 250
        kardex[f"A{row}"] = f'=IF(Salidas_Ventas!$A{src}="","","SALIDA")'
        kardex[f"B{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$B{src})'
        kardex[f"C{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$C{src})'
        kardex[f"D{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$D{src})'
        kardex[f"E{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$E{src})'
        kardex[f"F{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$F{src})'
        kardex[f"G{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$H{src})'
        kardex[f"H{row}"] = f'=IF($A{row}="","",0)'
        kardex[f"I{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$I{src})'
        kardex[f"J{row}"] = f'=IF($E{row}="","",SUMIFS(Entradas_Compras!$O:$O,Entradas_Compras!$F:$F,$E{row},Entradas_Compras!$I:$I,$G{row})-SUMIFS(Salidas_Ventas!$I:$I,Salidas_Ventas!$E:$E,$E{row},Salidas_Ventas!$H:$H,$G{row}))'
        kardex[f"K{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$J{src})'
        kardex[f"L{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$K{src})'
        kardex[f"M{row}"] = f'=IF($A{row}="","",Salidas_Ventas!$R{src})'
    protect_sheet(kardex)

    # Documentos.
    documentos = wb["Documentos"]
    style_header(documentos)
    set_widths(documentos, {"A": 14, "B": 28, "C": 16, "D": 28, "E": 14, "F": 20, "G": 16, "H": 16, "I": 14, "J": 55, "K": 24})
    clear_validations(documentos)
    add_list_validation(documentos, f"B2:B{MAX_ROWS}", "Listas!$C$2:$C$9")
    add_list_validation(documentos, f"C2:C{MAX_ROWS}", "Productos!$A$2:$A$500")
    add_list_validation(documentos, f"I2:I{MAX_ROWS}", "Listas!$E$2:$E$4")
    add_date_validation(documentos, f"G2:H{MAX_ROWS}")
    for row in range(2, MAX_ROWS + 1):
        documentos[f"D{row}"] = f'=IFERROR(VLOOKUP($C{row},Productos!$A:$L,2,FALSE),"")'
        documentos[f"I{row}"] = f'=IF($H{row}="","Vigente",IF($H{row}<TODAY(),"Vencido","Vigente"))'
    unlock_range(documentos, f"A2:C{MAX_ROWS}")
    unlock_range(documentos, f"E2:H{MAX_ROWS}")
    unlock_range(documentos, f"J2:K{MAX_ROWS}")
    protect_sheet(documentos)

    # Consulta trazabilidad.
    consulta = wb["Consulta_Trazabilidad"]
    consulta.delete_rows(1, consulta.max_row)
    rows = [
        ["CONSULTA DE TRAZABILIDAD POR LOTE"],
        ["Codigo producto", "P001", "", "Datos de drogueria", "=Config_Drogueria!B3"],
        ["Lote", "L001", "", "RUC", "=Config_Drogueria!B5"],
        [],
        ["Producto", "Marca", "Fecha ingreso", "Guia compra", "Proveedor", "Fabricacion", "Vencimiento", "Stock actual", "Estado", "Documentos", "Precio compra prom.", "Valor stock"],
        [
            '=IFERROR(VLOOKUP($B$2,Productos!$A:$L,2,FALSE),"")',
            '=IFERROR(VLOOKUP($B$2,Productos!$A:$L,3,FALSE),"")',
            '=IFERROR(MINIFS(Entradas_Compras!$B:$B,Entradas_Compras!$F:$F,$B$2,Entradas_Compras!$I:$I,$B$3),"")',
            '=IFERROR(INDEX(Entradas_Compras!$C:$C,MATCH($B$2&$B$3,Entradas_Compras!$F:$F&Entradas_Compras!$I:$I,0)),"")',
            '=IFERROR(INDEX(Entradas_Compras!$E:$E,MATCH($B$2&$B$3,Entradas_Compras!$F:$F&Entradas_Compras!$I:$I,0)),"")',
            '=IFERROR(MINIFS(Entradas_Compras!$J:$J,Entradas_Compras!$F:$F,$B$2,Entradas_Compras!$I:$I,$B$3),"")',
            '=IFERROR(MINIFS(Entradas_Compras!$K:$K,Entradas_Compras!$F:$F,$B$2,Entradas_Compras!$I:$I,$B$3),"")',
            '=SUMIFS(Inventario_Lotes!$L:$L,Inventario_Lotes!$A:$A,$B$2,Inventario_Lotes!$E:$E,$B$3)',
            '=IF($H$6<=0,"SIN STOCK",IF($G$6<TODAY(),"VENCIDO",IF($G$6<=TODAY()+30,"VENCE 30 DIAS",IF($G$6<=TODAY()+60,"VENCE 60 DIAS",IF($G$6<=TODAY()+90,"VENCE 90 DIAS","VIGENTE")))))',
            '=TEXTJOIN(" | ",TRUE,FILTER(Documentos!$B$2:$B$500&": "&Documentos!$J$2:$J$500,Documentos!$C$2:$C$500=$B$2,(Documentos!$E$2:$E$500=$B$3)+(Documentos!$E$2:$E$500="TODOS")))',
            '=IFERROR(SUMIFS(Entradas_Compras!$Q:$Q,Entradas_Compras!$F:$F,$B$2,Entradas_Compras!$I:$I,$B$3)/SUMIFS(Entradas_Compras!$O:$O,Entradas_Compras!$F:$F,$B$2,Entradas_Compras!$I:$I,$B$3),0)',
            "=$H$6*$K$6",
        ],
        [],
        ["Historial de salidas / clientes"],
        ["ID Salida", "Fecha", "Guia venta", "Cliente", "Producto", "Marca", "Lote", "Cantidad", "Precio unit.", "Valor", "Stock OK", "FEFO/FIFO"],
    ]
    for row in rows:
        consulta.append(row)
    for row in range(10, 80):
        src = row - 8
        consulta[f"A{row}"] = f'=IF(AND(Salidas_Ventas!$E{src}=$B$2,Salidas_Ventas!$H{src}=$B$3),Salidas_Ventas!$A{src},"")'
        for col, source_col in zip("BCDEFGHIJKL", "BCDFGHIJKPQ"):
            consulta[f"{col}{row}"] = f'=IF($A{row}="","",Salidas_Ventas!${source_col}{src})'
    consulta.merge_cells("A1:L1")
    style_header(consulta, row=5, max_col=12)
    for cell in consulta[1]:
        cell.fill = PatternFill("solid", fgColor=DARK)
        cell.font = Font(color="FFFFFF", bold=True, size=14)
    set_widths(consulta, {"A": 18, "B": 18, "C": 18, "D": 18, "E": 26, "F": 16, "G": 16, "H": 14, "I": 18, "J": 55, "K": 16, "L": 16})
    unlock_range(consulta, "B2:B3")
    protect_sheet(consulta)

    # Dashboard.
    dashboard = wb["Dashboard"]
    dashboard.delete_rows(1, dashboard.max_row)
    dashboard.append(["SISTEMA DE TRAZABILIDAD DE DROGUERIA - DASHBOARD"])
    dashboard.append(['="Drogueria: "&Config_Drogueria!B3', "", '="RUC: "&Config_Drogueria!B5', "", '="Responsable tecnico: "&Config_Drogueria!B7', "", '="Actualizado: "&TEXT(TODAY(),"dd/mm/yyyy")'])
    dashboard.append([])
    dashboard.append(["Indicador", "Resultado", "Interpretacion"])
    indicators = [
        ["Total productos activos", '=COUNTIFS(Productos!$K:$K,"Activo")', "Catalogo maestro"],
        ["Total lotes con stock", '=COUNTIFS(Inventario_Lotes!$L:$L,">0")', "Lotes disponibles"],
        ["Stock total unidades", "=SUM(Inventario_Lotes!$L:$L)", "Entradas menos salidas"],
        ["Valor stock compra", "=SUM(Inventario_Lotes!$O:$O)", "Valorizacion"],
        ["Vencidos", '=COUNTIFS(Inventario_Lotes!$I:$I,"VENCIDO",Inventario_Lotes!$L:$L,">0")', "Atencion inmediata"],
        ["Vence 30 dias", '=COUNTIFS(Inventario_Lotes!$I:$I,"VENCE 30 DIAS",Inventario_Lotes!$L:$L,">0")', "Prioridad alta"],
        ["Vence 60 dias", '=COUNTIFS(Inventario_Lotes!$I:$I,"VENCE 60 DIAS",Inventario_Lotes!$L:$L,">0")', "Seguimiento"],
        ["Vence 90 dias", '=COUNTIFS(Inventario_Lotes!$I:$I,"VENCE 90 DIAS",Inventario_Lotes!$L:$L,">0")', "Planificacion"],
        ["Errores de stock", '=COUNTIF(Salidas_Ventas!$P:$P,"ERROR*")', "No debe existir"],
        ["Alertas FEFO/FIFO", '=COUNTIF(Salidas_Ventas!$Q:$Q,"REVISAR*")', "Revisar salida"],
    ]
    for item in indicators:
        dashboard.append(item)
    dashboard.append([])
    dashboard.append(["Alertas de lotes con stock"])
    dashboard.append(["Codigo", "Producto", "Marca", "Lote", "Vencimiento", "Stock", "Estado", "Prioridad"])
    for row in range(18, 68):
        src = row - 16
        dashboard[f"A{row}"] = f'=IFERROR(INDEX(FILTER(Inventario_Lotes!$A$2:$A$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}),"")'
        dashboard[f"B{row}"] = f'=IF($A{row}="","",INDEX(FILTER(Inventario_Lotes!$B$2:$B$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}))'
        dashboard[f"C{row}"] = f'=IF($A{row}="","",INDEX(FILTER(Inventario_Lotes!$C$2:$C$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}))'
        dashboard[f"D{row}"] = f'=IF($A{row}="","",INDEX(FILTER(Inventario_Lotes!$E$2:$E$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}))'
        dashboard[f"E{row}"] = f'=IF($A{row}="","",INDEX(FILTER(Inventario_Lotes!$G$2:$G$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}))'
        dashboard[f"F{row}"] = f'=IF($A{row}="","",INDEX(FILTER(Inventario_Lotes!$L$2:$L$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}))'
        dashboard[f"G{row}"] = f'=IF($A{row}="","",INDEX(FILTER(Inventario_Lotes!$I$2:$I$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}))'
        dashboard[f"H{row}"] = f'=IF($A{row}="","",INDEX(FILTER(Inventario_Lotes!$Q$2:$Q$500,Inventario_Lotes!$L$2:$L$500>0,Inventario_Lotes!$I$2:$I$500<>"VIGENTE"),{src}))'
    dashboard.merge_cells("A1:H1")
    dashboard["A1"].fill = PatternFill("solid", fgColor=DARK)
    dashboard["A1"].font = Font(color="FFFFFF", bold=True, size=14)
    style_header(dashboard, row=4, max_col=3)
    style_header(dashboard, row=17, max_col=8)
    set_widths(dashboard, {"A": 26, "B": 28, "C": 18, "D": 14, "E": 16, "F": 12, "G": 18, "H": 22})
    protect_sheet(dashboard)

    # Usuarios.
    usuarios = wb["Usuarios"]
    style_header(usuarios)
    clear_validations(usuarios)
    add_list_validation(usuarios, f"D2:D100", "Listas!$D$2:$D$6")
    add_list_validation(usuarios, f"E2:E100", "Listas!$B$7:$B$8")
    unlock_range(usuarios, "A2:F100")
    protect_sheet(usuarios)

    for locked_sheet in ["Logica_Tecnica", "PROMPT_CODEX"]:
        if locked_sheet in wb.sheetnames:
            style_header(wb[locked_sheet])
            protect_sheet(wb[locked_sheet])

    for ws in wb.worksheets:
        ws.sheet_view.showGridLines = False
        for row in ws.iter_rows():
            for cell in row:
                cell.alignment = copy(cell.alignment)
                cell.alignment = Alignment(
                    horizontal=cell.alignment.horizontal,
                    vertical="center",
                    wrap_text=True,
                )

    # Sheet order for operators.
    order = [
        "INSTRUCCIONES",
        "Config_Drogueria",
        "Dashboard",
        "Productos",
        "Entradas_Compras",
        "Salidas_Ventas",
        "Inventario_Lotes",
        "Kardex",
        "Documentos",
        "Consulta_Trazabilidad",
        "Usuarios",
        "Listas",
        "Logica_Tecnica",
        "PROMPT_CODEX",
    ]
    wb._sheets = [wb[name] for name in order if name in wb.sheetnames]
    wb.save(OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    main()
