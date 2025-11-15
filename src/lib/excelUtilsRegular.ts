import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type {ValuesConsignmentRegular} from "../typesForm"

export async function generateAndSaveExcelRegular(
    values: ValuesConsignmentRegular,
    deliveryAddressLabel: string,
    transportCompanyLabel: string,
    driverFullName: string,
    truckNumber: string
): Promise<void> {
    const arrayBuffer = await fetch('regular.xlsx').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.arrayBuffer()
    });
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)
    const sheet = workbook.worksheets[0]

    const deliveryDateOffset = Number(values.deliveryDate)
    const deliveryDateCalc = values.currentDate.add(deliveryDateOffset, 'day').format('DD.MM.YYYY')

    const cellMap: Record<string, string> = {
        B12: values.transportCompany,
        AD42: `${values.driverFullName}, ${values.driverData}`,
        D8: values.currentDate.format('DD.MM.YYYY'),
        R8: `${values.currentDate.format('DD.MM.YYYY')}-${values.waybillNumber}`,
        B37: `Дата и время доставки - ${deliveryDateCalc}`,
        AD12: values.companyLegalAddress,
        B19: values.deliveryAddress,
        B22: String(values.cargoDescriptionsFirst),
        B23: String(values.cargoDescriptionsSecond),
        AC22: values.cargoDescriptionsFirst ? `${values.quantityFirst} ${values.cargoQuantityFirst}` : '',
        AC23: values.quantitySecond ? `${values.quantitySecond} ${values.cargoQuantitySecond}` : '',
        B45: String(values.transport),
        AD45: String(values.truckNumber).toUpperCase(),
        B58: values.loadingAddress,
        B66: `Пломба № ${values.truckSealNumber}`,
        B68: values.specialist,
        AS48: String(values.ownershipType),
        AB68: values.driverFullName,
        B42: values.cargoDriverData,
    }

    for (const [addr, text] of Object.entries(cellMap)) {
        const cell = sheet.getCell(addr)
        cell.value = text
        cell.numFmt = '@'
    }

    sheet.getCell('AF8').value = {formula: 'D8'}
    sheet.getCell('AB58').value = {formula: 'D8'}
    sheet.getCell('AB60').value = {formula: 'D8'}
    sheet.getCell('B60').value = {formula: 'D8'}

    sheet.getCell('AT8').value = {formula: 'R8'}

    sheet.getCell('AB76').value = {formula: 'B37'}

    sheet.getCell('B17').value = {formula: 'AD12'}
    sheet.getCell('B54').value = {formula: 'AD12'}
    sheet.getCell('B56').value = {formula: 'AD12'}

    sheet.getCell('B64').value = {
        formula: 'IF(AND(AC22<>"", AC23<>""), AC22 & ", " & AC23, AC22 & AC23)'
    }

    sheet.getCell('B76').value = {formula: 'B19'}

    sheet.getCell('B80').value = {formula: 'B64'}
    sheet.getCell('AB80').value = {formula: 'B64'}

    sheet.getCell('AB84').value = {formula: 'AB68'}

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `ТН Тверь ${deliveryAddressLabel} ${transportCompanyLabel} ${driverFullName} ${truckNumber}.xlsx`
    )
}
