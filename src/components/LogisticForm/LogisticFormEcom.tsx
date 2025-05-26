import {Button, DatePicker, Form, Input, InputNumber, Segmented, Select} from "antd";
import style from "./LogisticForm.module.css";
import TextArea from "antd/es/input/TextArea";
import {
    deliveryAddressOptions,
    legalCompanyOptions,
    loadingAddressOptions, ownershipTypeOptions, specialistOptions,
    transportCompanyOptions
} from "../../options";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {EcomShopsForm} from "./EcomOneShopsForm";
import {EcomTwoShopsForm} from "./EcomTwoShopsForm";
import type {ValuesConsignmentECOM} from "../../typesForm";

type SegmentedType = 'ЕКОМ №1' | 'ЕКОМ №2'
type submitType = 'invoice' | 'route'

export const LogisticFormECOM = () => {
    const [form] = Form.useForm()
    const [segmented, setSegmented] = useState<SegmentedType>('ЕКОМ №1')
    const [submitType, setSubmitType] = useState<submitType>('invoice')

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
            deliveryAddress: undefined,
            loadingAddress: undefined,
            ownershipType: undefined,
            specialist: undefined,
        })
    }, [form, segmented])

    const handleFinish = (values: ValuesConsignmentECOM) => {
        if (submitType  === 'invoice') {
            // логика для накладной
            console.log('накладная')
        } else {
            // логика для маршрутного листа
            console.log('маршрутный лист')
        }
    };

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
                                style={{width: '60px'}}
                                options={ownershipTypeOptions}/>
                    </Form.Item>
                </div>

                {segmented === 'ЕКОМ №1' && <EcomShopsForm/>}
                {segmented === 'ЕКОМ №2' && <EcomTwoShopsForm/>}


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