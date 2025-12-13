import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import type {ValuesConsignmentECOM} from '../typesForm';

type SubmitType = 'invoice' | 'route'

interface GenerateExcelParams {
    values: ValuesConsignmentECOM
    submitType: SubmitType
    segmented: string
    deliveryAddressLabel: string
    transportCompanyLabel: string
    specialistLabel?: string
    shopsOptionsECOM1: { shop: string; deliveryTime: string }[]
    shopsOptionsECOM2: { shop: string; deliveryTime: string }[]
    shopsOptionsECOM3: { shop: string; deliveryTime: string }[]
}

export async function generateAndSaveExcelECOM({
                                                   values,
                                                   submitType,
                                                   segmented,
                                                   deliveryAddressLabel,
                                                   transportCompanyLabel,
                                                   specialistLabel = '',
                                                   shopsOptionsECOM1,
                                                   shopsOptionsECOM2,
                                                   shopsOptionsECOM3,
                                               }: GenerateExcelParams): Promise<void> {
    if (submitType === 'invoice') {
        const arrayBuffer = await fetch('ecom.xlsx').then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.arrayBuffer()
        });
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(arrayBuffer)
        const sheet = workbook.worksheets[0]

        const deliveryDateOffset = Number(values.deliveryDate)
        const deliveryDateCalc = values.currentDate.add(deliveryDateOffset, 'day').format('DD.MM.YYYY')
        const cargoDescriptions =
            values.cargoSecond !== 0
                ? `коробки - ${values.cargoFirst} шт., пустые б/б - ${values.cargoSecond} шт.`
                : `коробки - ${values.cargoFirst} шт.`

        const cellMap: Record<string, string> = {
            D8: values.currentDate.format('DD.MM.YYYY'),
            R8: `${values.currentDate.format('DD.MM.YYYY')}-${values.waybillNumber}`,
            AD12: values.companyLegalAddress,
            B19: values.deliveryAddress,
            B23: cargoDescriptions,
            B37: `Дата и время доставки - ${deliveryDateCalc}`,
            B12: values.transportCompany,
            AD42: `${values.driverFullName}, ${values.driverData}, номер телефона: ${values.driverPhoneNumber}`,
            B45: String(values.transport),
            AD45: String(values.truckNumber).toUpperCase(),
            B66: `Пломба № ${values.truckSealNumber}`,
            B68: values.specialist,
            AB68: values.driverFullName,
            B42: values.cargoDriverData,
        };

        for (const [addr, text] of Object.entries(cellMap)) {
            const cell = sheet.getCell(addr)
            cell.value = text
            cell.numFmt = '@'
        }

        sheet.getCell('AF8').value = {formula: 'D8'}
        sheet.getCell('AT8').value = {formula: 'R8'}
        sheet.getCell('B17').value = {formula: 'AD12'}
        sheet.getCell('B54').value = {formula: 'AD12'}
        sheet.getCell('B56').value = {formula: 'AD12'}
        sheet.getCell('AB58').value = {formula: 'D8'}
        sheet.getCell('B60').value = {formula: 'D8'}
        sheet.getCell('AB60').value = {formula: 'D8'}
        sheet.getCell('B64').value = {formula: 'B23'}
        sheet.getCell('B76').value = {formula: 'B19'}
        sheet.getCell('AB76').value = {formula: 'B37'}
        sheet.getCell('B80').value = {formula: 'B23'}
        sheet.getCell('AB80').value = {formula: 'AD23'}
        sheet.getCell('AB84').value = {formula: 'AB68'}

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(
            new Blob([buffer], {type: 'application/octet-stream'}),
            `${segmented} ${deliveryAddressLabel} ${transportCompanyLabel} ${values.driverFullName} ${values.truckNumber}.xlsx`
        );
    } else {
        const filePath = segmented === 'ЕКОМ №1' ? 'rl1.xlsx' : 'rl.xlsx';

        // Логика для маршрутного листа
        const arrayBuffer = await fetch(filePath).then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.arrayBuffer()
        });
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(arrayBuffer)
        const sheet = workbook.worksheets[0]

        const cargoDescriptions =
            values.cargoSecond !== 0
                ? `коробки - ${values.cargoFirst} шт., пустые б/б - ${values.cargoSecond} шт.`
                : `коробки - ${values.cargoFirst} шт.`

        const baseCellMap: Record<string, string> = {
            B4: values.currentDate.format('DD.MM.YYYY'),
            B6: `${values.transport} ${values.truckNumber}`,
            G6: values.transportCompany,
            B8: `${values.driverFullName}, тел. ${values.driverPhoneNumber}`,
            G12: values.truckSealNumber,
            H12: specialistLabel,
        }

        let cellMap: Record<string, string>;

        if (segmented === 'ЕКОМ №1') {
            cellMap = {
                ...baseCellMap,
                A2: `МАРШРУТНЫЙ ЛИСТ № 1`,
                A16: `Итого: ${cargoDescriptions}`,
                B12: '18-00',

                A13: shopsOptionsECOM1[0].shop,
                B13: shopsOptionsECOM1[0].deliveryTime,
                E13: `8-265 - ${values.smolenka} кор`,

                A14: shopsOptionsECOM1[1].shop,
                B14: shopsOptionsECOM1[1].deliveryTime,
                E14: `8-291 - ${values.modniy} кор`,

                A15: shopsOptionsECOM1[2].shop,
                B15: shopsOptionsECOM1[2].deliveryTime,
                E15: `8-291 - ${values.modniy} кор`,
            };
        } else if (segmented === 'ЕКОМ №2') {
            cellMap = {
                ...baseCellMap,
                A2: `МАРШРУТНЫЙ ЛИСТ № 2`,
                A20: `Итого: ${cargoDescriptions}`,
                B12: '18-30',

                A13: shopsOptionsECOM2[0].shop,
                B13: shopsOptionsECOM2[0].deliveryTime,
                E13: `8-253 - ${values.belayaDacha} кор`,

                A14: shopsOptionsECOM2[1].shop,
                B14: shopsOptionsECOM2[1].deliveryTime,
                E14: `8-280 - ${values.kashirskayaPlaza} кор`,

                A15: shopsOptionsECOM2[2].shop,
                B15: shopsOptionsECOM2[2].deliveryTime,
                E15: `8-269 - ${values.columbus} кор`,

                A16: shopsOptionsECOM2[3].shop,
                B16: shopsOptionsECOM2[3].deliveryTime,
                E16: `8-277 - ${values.tepliyStan} кор`,

                A17: shopsOptionsECOM2[4].shop,
                B17: shopsOptionsECOM2[4].deliveryTime,
                E17: `8-272 - ${values.vegasKuncevo} кор`,

                A18: shopsOptionsECOM2[5].shop,
                B18: shopsOptionsECOM2[5].deliveryTime,
                E18: `8-273 - ${values.vegasMyakinino} кор`,

                A19: shopsOptionsECOM2[6].shop,
                B19: shopsOptionsECOM2[6].deliveryTime,
                E19: `8-264 - ${values.rigaMoll} кор`,
            }
        } else {
            cellMap = {
                ...baseCellMap,
                A2: `МАРШРУТНЫЙ ЛИСТ № 3`,
                A20: `Итого: ${cargoDescriptions}`,
                B12: '19-00',

                A13: shopsOptionsECOM3[0].shop,
                B13: shopsOptionsECOM3[0].deliveryTime,
                E13: `8-265 - ${values.smolenka} кор`,

                A14: shopsOptionsECOM3[1].shop,
                B14: shopsOptionsECOM3[1].deliveryTime,
                E14: `8-282 - ${values.metropolis} кор`,

                A15: shopsOptionsECOM3[2].shop,
                B15: shopsOptionsECOM3[2].deliveryTime,
                E15: `8-267 - ${values.okeaniya} кор`,

                A16: shopsOptionsECOM3[3].shop,
                B16: shopsOptionsECOM3[3].deliveryTime,
                E16: `8-279 - ${values.kapitoliy} кор`,

                A17: shopsOptionsECOM3[4].shop,
                B17: shopsOptionsECOM3[4].deliveryTime,
                E17: `8-260 - ${values.aviapark} кор`,

                A18: shopsOptionsECOM3[5].shop,
                B18: shopsOptionsECOM3[5].deliveryTime,
                E18: `8-255 - ${values.evropolis} кор`,

                A19: shopsOptionsECOM3[6].shop,
                B19: shopsOptionsECOM3[6].deliveryTime,
                E19: `8-252 - ${values.megaHimki} кор`,
            };
        }

        for (const [addr, text] of Object.entries(cellMap)) {
            const cell = sheet.getCell(addr);
            cell.value = text;
            cell.numFmt = '@';
        }

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer], {type: 'application/octet-stream'}),
            `${segmented} МАРШРУТНЫЙ ЛИСТ ${deliveryAddressLabel} ${values.driverFullName} ${values.truckNumber}.xlsx`
        );
    }
}
