import {Button, DatePicker, Form, Input, InputNumber, Segmented, Select} from "antd";
import style from "./LogisticForm.module.css";
import TextArea from "antd/es/input/TextArea";
import {
    deliveryAddressOptions,
    legalCompanyOptions, shopsOptionsECOM1, shopsOptionsECOM2, specialistOptions,
    transportCompanyOptions
} from "../../options";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {EcomOneShopsForm} from "./EcomOneShopsForm";
import {EcomTwoShopsForm} from "./EcomTwoShopsForm";
import type {ValuesConsignmentECOM} from "../../typesForm";
import ExcelJS from "exceljs";
import {saveAs} from "file-saver";
import {useWatch} from "antd/es/form/Form";

type SegmentedType = 'ЕКОМ №1' | 'ЕКОМ №2'
type submitType = 'invoice' | 'route'

export const LogisticFormECOM = () => {
    const [form] = Form.useForm()
    const [segmented, setSegmented] = useState<SegmentedType>('ЕКОМ №1')
    const [submitType, setSubmitType] = useState<submitType>('invoice')
    const deliveryAddressValue = useWatch('deliveryAddress', form)
    const transportCompanyValue = useWatch('transportCompany', form)
    const specialistValue = useWatch('specialist', form)

    const specialistLabel = specialistOptions.find(
        opt => opt.value === specialistValue
    )?.label ?? ""

    const deliveryAddressLabel = deliveryAddressOptions.find(
        opt => opt.value === deliveryAddressValue
    )?.label

    const transportCompanyLabel = transportCompanyOptions.find(
        opt => opt.value === transportCompanyValue
    )?.label
    // еком №1 + адрес досавки + ТК + ФИО + номер машины

    useEffect(() => {
        form.setFieldsValue({
            transportCompany: transportCompanyOptions[2].value,
            companyLegalAddress: legalCompanyOptions[0].value,
            cargoFirst: 0,
            cargoSecond: 0,
            currentDate: dayjs(),
            deliveryDate: 1,
            truckSealNumber: '',
            smolenka: 0,
            okeaniya: 0,
            kapitoliy: 0,
            modniy: 0,
            aviapark: 0,
            evropolis: 0,
            megaHimki: 0,
            belayaDacha: 0,
            kashirskayaPlaza: 0,
            columbus: 0,
            tepliyStan: 0,
            vegasKuncevo: 0,
            vegasMyakinino: 0,
            rigaMoll: 0,
            driverFullName: '',
            driverPhoneNumber: '',
            driverData: '',
            transport: '',
            truckNumber: '',
            waybillNumber: '',
            deliveryAddress: segmented === 'ЕКОМ №1' ? deliveryAddressOptions[0].value : deliveryAddressOptions[4].value,
            specialist: undefined,
        })
    }, [form, segmented])

    const handleFinish = async (values: ValuesConsignmentECOM) => {
        if (submitType === 'invoice') {
            // логика для накладной
            const arrayBuffer = await fetch('ecom.xlsx')
                .then(r => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`)
                    return r.arrayBuffer()
                })
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.load(arrayBuffer)
            const sheet = workbook.worksheets[0]

            const deliveryDateOffset = Number(values.deliveryDate)
            const deliveryDateCalc = values.currentDate.add(deliveryDateOffset, 'day').format('DD.MM.YYYY')
            const cargoDescriptions = values.cargoSecond !== 0 ? `коробки - ${values.cargoFirst} шт., пустые б/б - ${values.cargoSecond} шт.` : `коробки - ${values.cargoFirst} шт.`

            const cellMap: Record<string, string> = {
                D8: values.currentDate.format('DD.MM.YYYY'),
                R8: `${values.currentDate.format('DD.MM.YYYY')}-${values.waybillNumber}`,
                B12: values.companyLegalAddress,
                B19: values.deliveryAddress,
                B23: cargoDescriptions,
                B37: `Дата и время доставки - ${deliveryDateCalc}`,
                B42: values.transportCompany,
                AD42: `${values.driverFullName}, ${values.driverData}, номер телефона: ${values.driverPhoneNumber}`,
                B45: String(values.transport),
                AD45: String(values.truckNumber).toUpperCase(),
                B66: `Пломба № ${values.truckSealNumber}`,
                B68: values.specialist,
                AB68: values.driverFullName,
            }

            for (const [addr, text] of Object.entries(cellMap)) {
                const cell = sheet.getCell(addr)
                cell.value = text
                cell.numFmt = '@'
            }

            sheet.getCell('AF8').value = {formula: 'D8'}
            sheet.getCell('AT8').value = {formula: 'R8'}
            sheet.getCell('B17').value = {formula: 'B12'}
            sheet.getCell('B54').value = {formula: 'B12'}
            sheet.getCell('B56').value = {formula: 'B12'}
            sheet.getCell('AB58').value = {formula: 'D8'}
            sheet.getCell('B60').value = {formula: 'D8'}
            sheet.getCell('AB60').value = {formula: 'D8'}
            sheet.getCell('B64').value = {formula: 'B23'}
            sheet.getCell('B64').value = {formula: 'B23'}
            sheet.getCell('B76').value = {formula: 'B19'}
            sheet.getCell('AB76').value = {formula: 'B37'}
            sheet.getCell('B80').value = {formula: 'B23'}
            sheet.getCell('B80').value = {formula: 'B23'}
            sheet.getCell('AB80').value = {formula: 'AD23'}
            sheet.getCell('AB84').value = {formula: 'AB68'}

            const buffer = await workbook.xlsx.writeBuffer()
            saveAs(new Blob([buffer], {type: 'application/octet-stream'}), `${segmented} ${deliveryAddressLabel} ${transportCompanyLabel} ${form.getFieldValue('driverFullName')} ${form.getFieldValue('truckNumber')}.xlsx`)
        } else {
            // логика для маршрутного листа
            const arrayBuffer = await fetch('rl.xlsx')
                .then(r => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`)
                    return r.arrayBuffer()
                })
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.load(arrayBuffer)
            const sheet = workbook.worksheets[0]

            const cargoDescriptions = values.cargoSecond !== 0
                ? `коробки - ${values.cargoFirst} шт., пустые б/б - ${values.cargoSecond} шт.`
                : `коробки - ${values.cargoFirst} шт.`

            const baseCellMap: Record<string, string> = {
                B4: values.currentDate.format('DD.MM.YYYY'),
                B6: `${values.transport} ${values.truckNumber}`,
                G6: values.transportCompany,
                B8: `${values.driverFullName}, тел. ${values.driverPhoneNumber}`,
                G12: values.truckSealNumber,
                H12: specialistLabel ?? '',
                A20: `Итого: ${cargoDescriptions}`,
            }

            if (segmented === 'ЕКОМ №1') {
                const ecom1CellMap: Record<string, string> = {
                    ...baseCellMap,
                    A2: `МАРШРУТНЫЙ ЛИСТ № 1`,

                    A13: shopsOptionsECOM1[0].shop,
                    B13: shopsOptionsECOM1[0].deliveryTime,
                    E13: `8-265 - ${values.smolenka} кор`,

                    A14: shopsOptionsECOM1[1].shop,
                    B14: shopsOptionsECOM1[1].deliveryTime,
                    E14: `8-267 - ${values.okeaniya} кор`,

                    A15: shopsOptionsECOM1[2].shop,
                    B15: shopsOptionsECOM1[2].deliveryTime,
                    E15: `8-279 - ${values.kapitoliy} кор`,

                    A16: shopsOptionsECOM1[3].shop,
                    B16: shopsOptionsECOM1[3].deliveryTime,
                    E16: `8-291 - ${values.modniy} кор`,

                    A17: shopsOptionsECOM1[4].shop,
                    B17: shopsOptionsECOM1[4].deliveryTime,
                    E17: `8-260 - ${values.aviapark} кор`,

                    A18: shopsOptionsECOM1[4].shop,
                    B18: shopsOptionsECOM1[4].deliveryTime,
                    E18: `8-255 - ${values.evropolis} кор`,

                    A19: shopsOptionsECOM1[4].shop,
                    B19: shopsOptionsECOM1[4].deliveryTime,
                    E19: `8-252 - ${values.megaHimki} кор`,
                }

                for (const [addr, text] of Object.entries(ecom1CellMap)) {
                    const cell = sheet.getCell(addr)
                    cell.value = text
                    cell.numFmt = '@'
                }

                const buffer = await workbook.xlsx.writeBuffer()
                saveAs(new Blob([buffer], {type: 'application/octet-stream'}), `${segmented} МАРШРУТНЫЙ ЛИСТ ${deliveryAddressLabel} ${form.getFieldValue('driverFullName')} ${form.getFieldValue('truckNumber')}.xlsx`)
            } else {
                const ecom2CellMap: Record<string, string> = {
                    ...baseCellMap,
                    A2: `МАРШРУТНЫЙ ЛИСТ № 2`,
                    B12: '16-30',

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

                    A18: shopsOptionsECOM2[4].shop,
                    B18: shopsOptionsECOM2[4].deliveryTime,
                    E18: `8-273 - ${values.vegasMyakinino} кор`,

                    A19: shopsOptionsECOM2[4].shop,
                    B19: shopsOptionsECOM2[4].deliveryTime,
                    E19: `8-264 - ${values.rigaMoll} кор`,
                }

                for (const [addr, text] of Object.entries(ecom2CellMap)) {
                    const cell = sheet.getCell(addr)
                    cell.value = text
                    cell.numFmt = '@'
                }

                const buffer = await workbook.xlsx.writeBuffer()
                saveAs(new Blob([buffer], {type: 'application/octet-stream'}), `${segmented} МАРШРУТНЫЙ ЛИСТ ${deliveryAddressLabel} ${form.getFieldValue('driverFullName')} ${form.getFieldValue('truckNumber')}.xlsx`)
            }
        }
    }

    const handleChangeSegmented = (value: SegmentedType) => {
        setSegmented(value)
    }


    return (
        <>
            <Segmented<SegmentedType>
                options={['ЕКОМ №1', 'ЕКОМ №2']}
                style={{marginBottom: '10px'}}
                onChange={handleChangeSegmented}
            />
            <Form form={form}
                  onFinish={handleFinish}
                  initialValues={{deliveryDate: 1}}
                  className={style.formContainer}>
                <div className={style.driverContainer}>
                    <Form.Item className={style.companyLegalAddress}
                               name="companyLegalAddress"
                               label="Юр. адресс компании">
                        <Select size={"small"}
                                options={legalCompanyOptions}
                                disabled/>
                    </Form.Item>
                    <div style={{flex: 1}}>
                        <Form.Item className={style.itemForm}
                                   name="driverFullName"
                                   label="ФИО водителя"
                                   rules={[{required: true, message: 'Введите ФИО водителя'}]}>
                            <Input size="small"/>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item className={style.itemForm}
                                   name="driverPhoneNumber"
                                   label="Телефон"
                                   rules={[{required: true, message: 'Введите номер телефона водителя'}]}>
                            <Input size="small" style={{width: '130px'}}/>
                        </Form.Item>
                    </div>
                </div>
                <Form.Item className={style.itemForm}
                           name="driverData"
                           label="Данные водителя"
                           rules={[{required: true, message: 'Введите данные водителя'}]}>
                    <TextArea size={"small"} className={style.textAria}/>
                </Form.Item>
                <div className={style.infoContainer}>
                    <div className={style.carContainer}>
                        <Form.Item className={style.itemForm}
                                   name="transport"
                                   label="Марка машины"
                                   rules={[{required: true, message: 'Введите марку машины'}]}>
                            <Input size={"small"}/>
                        </Form.Item>
                        <Form.Item className={style.itemForm}
                                   name="truckNumber"
                                   label="Номер машины"
                                   rules={[{required: true, message: 'Введите номер машины'}]}>
                            <Input size={"small"}/>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item className={style.itemForm}
                                   name="transportCompany"
                                   label="ТК">
                            <Select size={"small"}
                                    disabled
                                    options={transportCompanyOptions}/>
                        </Form.Item>
                        <Form.Item className={style.itemForm}
                                   name="truckSealNumber"
                                   rules={[{required: true, message: 'Введите № пломбы'}]}
                                   label="№ пломбы">
                            <Input size={"small"}/>
                        </Form.Item>
                    </div>
                </div>
                <div className={style.cargoContainer}>
                    <Form.Item className={style.itemForm}
                               name="cargoFirst"
                               label="Груз 1"
                               rules={[{required: true}]}>
                        <InputNumber min={0}
                                     size={"small"}
                                     style={{width: '135px'}}
                                     addonAfter={'коробки'}/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="cargoSecond"
                               label="Груз 2"
                               rules={[{required: true}]}>
                        <InputNumber min={0}
                                     size={"small"}
                                     disabled={segmented === 'ЕКОМ №2'}
                                     style={{width: '150px'}}
                                     addonAfter={'пустые б/б'}/>
                    </Form.Item>
                </div>
                <div className={style.dateContainer}>
                    <Form.Item className={style.itemForm}
                               name="currentDate"
                               label="Дата">
                        <DatePicker size={"small"}
                                    disabled/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="deliveryDate"
                               label="Доставка"
                               rules={[{required: true}]}>
                        <InputNumber min={0}
                                     max={9}
                                     size={"small"}
                                     style={{width: '130px'}}
                                     addonBefore="+"
                                     addonAfter={'день'}/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="waybillNumber"
                               label="№ ТРН"
                               style={{width: '130px'}}
                               rules={[{required: true, message: 'Введите номер ТРН'}]}>
                        <Input size={"small"}/>
                    </Form.Item>
                </div>
                <div className={style.addressContainer}>
                    <Form.Item className={style.itemForm}
                               name="deliveryAddress"
                               label="Доставка">
                        <Select size={"small"}
                                style={{width: '130px'}}
                                showSearch
                                options={deliveryAddressOptions}/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="specialist"
                               label="Подпись"
                               rules={[{required: true, message: 'Выберите подпись'}]}>
                        <Select size={"small"}
                                style={{width: '165px'}}
                                options={specialistOptions}/>
                    </Form.Item>
                </div>

                {segmented === 'ЕКОМ №1' && <EcomOneShopsForm/>}
                {segmented === 'ЕКОМ №2' && <EcomTwoShopsForm/>}

                <div className={style.buttonContainer}>
                    <Button
                        htmlType="submit"
                        onClick={() => setSubmitType('invoice')}
                    >
                        Скачать ТН
                    </Button>
                    <Button
                        htmlType="submit"
                        onClick={() => setSubmitType('route')}
                    >
                        Скачать МЛ
                    </Button>
                </div>
            </Form>
        </>

    )
}