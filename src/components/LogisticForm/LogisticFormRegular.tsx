import {Button, type CheckboxChangeEvent, DatePicker, Form, Input, InputNumber, Select} from "antd";
import style from './LogisticForm.module.css'
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import {
    deliveryAddressOptions, legalCompanyOptions,
    loadingAddressOptions, ownershipTypeOptions,
    specialistOptions,
    transportCompanyOptions,
    typeCargo
} from "../../options";
import {useEffect, useState} from "react";
import {useWatch} from "antd/es/form/Form";
import {saveAs} from "file-saver";
import type {ValuesConsignmentRegular} from "../../typesForm";
import Checkbox from "antd/es/checkbox/Checkbox";

export const LogisticFormRegular = () => {
    const [form] = Form.useForm()
    const [required, setRequired] = useState(true)
    const cargoDescFirst = useWatch('cargoDescriptionsFirst', form)
    const cargoDescSecond = useWatch('cargoDescriptionsSecond', form)
    const deliveryAddressValue = useWatch('deliveryAddress', form)
    const transportCompanyValue = useWatch('transportCompany', form)

    const deliveryAddressLabel = deliveryAddressOptions.find(
        opt => opt.value === deliveryAddressValue
    )?.label

    const transportCompanyLabel = transportCompanyOptions.find(
        opt => opt.value === transportCompanyValue
    )?.label

    useEffect(() => {
        form.setFieldsValue({
            deliveryDate: 1,
            currentDate: dayjs(),
            companyLegalAddress: legalCompanyOptions[0].value,
            quantityFirst: 0,
            quantitySecond: 0,
            truckSealNumber: '',
            cargoDescriptionsFirst: '',
            cargoDescriptionsSecond: '',
        })
    }, [form])

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked
        setRequired(isChecked)

        if (!isChecked) {
            form.setFields([
                {
                    name: "truckSealNumber",
                    errors: [],
                    value: '',
                },
            ])
        } else {
            form.setFields([
                {
                    name: "truckSealNumber",
                    errors: ['Введите № пломбы'],
                },
            ])
        }
    }

    const handleFinish = async (values: ValuesConsignmentRegular) => {
        const arrayBuffer = await fetch('regular.xlsx')
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.arrayBuffer()
            })
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(arrayBuffer)

        const sheet = workbook.worksheets[0]

        const deliveryDateOffset = Number(values.deliveryDate)
        const deliveryDateCalc = values.currentDate.add(deliveryDateOffset, 'day').format('DD.MM.YYYY')

        const cellMap: Record<string, string> = {
            B42: values.transportCompany,
            AD42: `${values.driverFullName}, ${values.driverData}`,
            D8: values.currentDate.format('DD.MM.YYYY'),
            R8: `${values.currentDate.format('DD.MM.YYYY')}-${values.waybillNumber}`,
            B37: `Дата и время доставки - ${deliveryDateCalc}`,
            B12: values.companyLegalAddress,
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

        sheet.getCell('B17').value = {formula: 'B12'}
        sheet.getCell('B54').value = {formula: 'B12'}
        sheet.getCell('B56').value = {formula: 'B12'}

        sheet.getCell('B64').value = {
            formula: 'IF(AND(AC22<>"", AC23<>""), AC22 & ", " & AC23, AC22 & AC23)'
        }

        sheet.getCell('B76').value = {formula: 'B19'}

        sheet.getCell('B80').value = {formula: 'B64'}
        sheet.getCell('AB80').value = {formula: 'B64'}

        sheet.getCell('AB84').value = {formula: 'AB68'}

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer], {type: 'application/octet-stream'}), `ТН Тверь ${deliveryAddressLabel} ${transportCompanyLabel} ${form.getFieldValue('driverFullName')} ${form.getFieldValue('truckNumber')}.xlsx`)
    }



    return (
        <Form form={form}
              onFinish={handleFinish}
              initialValues={{deliveryDate: 1}}
              className={style.formContainer}>

            <div>
                <Form.Item className={style.itemForm}
                           name="driverFullName"
                           label="ФИО водителя"
                           rules={[{required: true, message: 'Введите ФИО водителя'}]}>
                    <Input size={"small"}/>
                </Form.Item>
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
                                   label="ТК"
                                   rules={[{required: true, message: 'Выберите ТК'}]}>
                            <Select size={"small"}
                                    options={transportCompanyOptions}/>
                        </Form.Item>
                        <div className={style.truckContainer}>
                            <Form.Item className={style.itemForm}
                                       name="truckSealNumber"
                                       rules={[{required: required, message: 'Введите № пломбы'}]}
                                       label="№ пломбы">
                                <Input size={"small"} style={{maxWidth: '150px'}} disabled={!required}/>
                            </Form.Item>
                            <Checkbox onChange={handleCheckboxChange} checked={required} style={{alignSelf: "start", marginTop: '6px'}}/>
                        </div>

                    </div>
                </div>


            </div>

            <div>
                <Form.Item className={style.itemForm}
                           name="cargoDescriptionsFirst"
                           label="Наименование груза 1">
                    <TextArea size={"small"} className={style.textAria}/>
                </Form.Item>

                <div className={style.cargo}>
                    <Form.Item className={style.itemForm}
                               name="quantityFirst"
                               label="Кол-во груза 1"
                               rules={[{required: true}]}>
                        <InputNumber min={0}
                                     disabled={!cargoDescFirst}
                                     size={"small"}
                                     style={{width: '50px'}}/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="cargoQuantityFirst"
                               label="Тип груза 1">
                        <Select options={typeCargo}
                                disabled={!cargoDescFirst}
                                size={"small"}
                                style={{width: '100px'}}/>
                    </Form.Item>
                </div>

                <Form.Item className={style.itemForm}
                           name="cargoDescriptionsSecond"
                           label="Наименование груза 2">
                    <TextArea size={"small"} className={style.textAria}/>
                </Form.Item>
                <div className={style.cargo}>
                    <Form.Item className={style.itemForm}
                               name="quantitySecond"
                               label="Кол-во груза 2"
                               rules={[{required: true}]}>
                        <InputNumber min={0}
                                     disabled={!cargoDescSecond}
                                     size={"small"}
                                     style={{width: '50px'}}/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="cargoQuantitySecond"
                               label="Тип груза 2">
                        <Select options={typeCargo}
                                disabled={!cargoDescSecond}
                                size={"small"}
                                style={{width: '100px'}}/>
                    </Form.Item>
                </div>

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


            <div>
                <Form.Item className={style.companyLegalAddress}
                           name="companyLegalAddress"
                           label="Юр. адресс компании">
                    <Select size={"small"}
                            options={legalCompanyOptions}
                            disabled/>
                </Form.Item>
                <div className={style.addressContainer}>
                    <Form.Item className={style.itemForm}
                               name="deliveryAddress"
                               label="Доставка"
                               rules={[{required: true, message: 'Выберите адресс доставки'}]}>
                        <Select size={"small"}
                                style={{width: '130px'}}
                                showSearch
                                options={deliveryAddressOptions}/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="loadingAddress"
                               label="Погрузка"
                               rules={[{required: true, message: 'Выберите адресс погрузки'}]}>
                        <Select size={"small"}
                                style={{width: '100px'}}
                                options={loadingAddressOptions}/>
                    </Form.Item>
                    <Form.Item className={style.itemForm}
                               name="ownershipType"
                               label="Тип владения"
                               rules={[{required: true, message: 'Выберите тип владения'}]}>
                        <Select size={"small"}
                                style={{width: '58px'}}
                                options={ownershipTypeOptions}/>
                    </Form.Item>
                </div>

            </div>

            <div className={style.footerContainer}>
                <Form.Item className={style.itemForm}
                           name="specialist"
                           label="Подпись"
                           rules={[{required: true, message: 'Выберите подпись'}]}>
                    <Select size={"small"}
                            style={{width: '165px'}}
                            options={specialistOptions}/>
                </Form.Item>
            </div>
            <Form.Item>
                <Button type="default"
                        htmlType="submit">
                    Скачать накладную
                </Button>
            </Form.Item>
        </Form>

    )
}