import {Button, DatePicker, Form, Input, InputNumber, Select} from "antd";
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
import {useEffect} from "react";
import {useWatch} from "antd/es/form/Form";
import {saveAs} from "file-saver";

interface FormValues {
    transportCompany: string // Транспортная компания
    driverData: string // Данные водителя
    currentDate: dayjs.Dayjs // Дата(текущая)
    waybillNumber: string // № ТРН
    deliveryDate: string // Дата доставки
    companyLegalAddress: string // Юр.адресс компании
    deliveryAddress: string // Адрес доставки
    cargoDescriptionsFirst: string // Наименование груза 1
    cargoDescriptionsSecond: string // Наименование груза 2
    quantityFirst: number // кол-во груза 1
    quantitySecond: number // кол-во груза 2
    cargoQuantityFirst: string // Тип груза 1
    cargoQuantitySecond: string // Тип груза 2
    transport: string // Марка машины
    truckNumber: string // Номер машины
    loadingAddress: string // Адрес погрузки
    truckSealNumber: string // № пломбы
    specialist: string // Подпись
    ownershipType: string // Тип владения
    driverFullName: string // ФИО водителя
}

export const LogisticForm = () => {
    const [form] = Form.useForm()

    const cargoDescFirst = useWatch('cargoDescriptionsFirst', form)
    const cargoDescSecond = useWatch('cargoDescriptionsSecond', form)

    useEffect(() => {
        form.setFieldsValue({
            deliveryDate: 1,
            currentDate: dayjs(),
            companyLegalAddress: legalCompanyOptions[0].value,
            quantityFirst: 0,
            quantitySecond: 0,
        })
    }, [form])

    const handleFinish = async (values: FormValues) => {
        // 1) Загрузим в память шаблон
        const arrayBuffer = await fetch('/template.xlsx').then(r => r.arrayBuffer())
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(arrayBuffer)

        // 2) Работать будем с первым листом
        const sheet = workbook.worksheets[0]

        // 3) Заполним нужные ячейки
        const deliveryDateOffset = Number(values.deliveryDate)
        const deliveryDateCalc = values.currentDate.add(deliveryDateOffset, 'day').format('DD.MM.YYYY')

        const cellMap: Record<string, string> = {
            B42: values.transportCompany,
            AD42: `${values.driverFullName}, ${values.driverData}`,
            D8: values.currentDate.format('DD.MM.YYYY'),
            R8: `${values.currentDate.format('YYYY.MM.DD')}-${values.waybillNumber}`,
            B37: `Дата и время доставки - ${deliveryDateCalc}`,
            B12: values.companyLegalAddress,
            B19: values.deliveryAddress,
            B22: values.cargoDescriptionsFirst,
            B23: values.cargoDescriptionsSecond,
            AC22: values.cargoDescriptionsFirst ? `${values.quantityFirst} ${values.cargoQuantityFirst}` : '',
            AC23: values.quantitySecond
                ? `${values.quantitySecond} ${values.cargoQuantitySecond}`
                : '',
            B64: values.quantitySecond
                ? `${values.quantityFirst} ${values.cargoQuantityFirst}, ${values.quantitySecond} ${values.cargoQuantitySecond}`
                : `${values.quantityFirst} ${values.cargoQuantityFirst}`,
            B45: values.transport,
            AD45: values.truckNumber.toUpperCase(),
            B58: values.loadingAddress,
            B66: `Пломба № ${values.truckSealNumber}`,
            B68: values.specialist,
            AS48: values.ownershipType,
            AB68: values.driverFullName,
        };


        for (const [addr, text] of Object.entries(cellMap)) {
            const cell = sheet.getCell(addr);
            cell.value = text;
            cell.numFmt = '@';    // формат «текст», чтобы точно сохранить строку
        }

        // 4) Запишем книгу обратно в бинарный буфер
        const buffer = await workbook.xlsx.writeBuffer();

        // 5) И скачиваем
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Заполненная_накладная.xlsx');
    }

    return (
            <Form form={form}
                  onFinish={handleFinish}
                  initialValues={{deliveryDate: 1}}
                  className={style.formContainer}>
                <span>Форма заполнения ТН</span>
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
                        <div >
                            <Form.Item className={style.itemForm}
                                       name="transportCompany"
                                       label="ТК"
                                       rules={[{required: true, message: 'Выберите ТК'}]}>
                                <Select size={"small"}
                                        options={transportCompanyOptions}/>
                            </Form.Item>
                            <Form.Item className={style.itemForm}
                                       name="truckSealNumber"
                                       label="№ пломбы"
                                       rules={[{required: true, message: 'Введите номер пломбы'}]}>
                                <Input size={"small"}/>
                            </Form.Item>
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
                     <Form.Item className={style.itemForm}
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

                <div>
                    <Form.Item className={style.itemForm}
                               name="specialist"
                               label="Подпись"
                               rules={[{required: true, message: 'Выберите подпись'}]}>
                        <Select size={"small"}
                                options={specialistOptions}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default"
                                htmlType="submit">
                            Скачать накладную
                        </Button>
                    </Form.Item>
                </div>
            </Form>
    )
}