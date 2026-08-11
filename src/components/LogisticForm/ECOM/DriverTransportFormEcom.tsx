import style from "../LogisticForm.module.css";
import {Button, Form, Input, Select} from "antd";
import {legalCompanyOptions, transportCompanyOptions} from "../../../options";
import TextArea from "antd/es/input/TextArea";
import type { FormInstance } from "antd/es/form";

type Props = {
    form: FormInstance;
};

export const DriverTransportFormEcom = ({ form }: Props) => {

    const fillCargoDriverData = (text: string) => {
        form.setFieldsValue({
            cargoDriverData: ''
        });

        setTimeout(() => {
            form.setFieldsValue({
                cargoDriverData: text
            });
        }, 0);
    };

    const fillDataLogistika = () => {
        fillCargoDriverData(`ООО «Логистика», 121471, г. Москва, ул. Рябиновая, дом 44, офис 402`);
    };

    const fillDataVera = () => {
        fillCargoDriverData(`ООО «Вера», 170028, г. Тверь, ул. Коминтерна, дом 46, оф. 3, ИНН 6950092949`);
    };

    return (
        <>
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
            <div className={style.transportBox}>
                <Form.Item className={style.itemForm}
                           name="cargoDriverData"
                           label="Данные перевозчика"
                           rules={[{required: true, message: 'Введите данные перевозчика'}]}>
                    <TextArea size={"small"}/>
                </Form.Item>

                <Button style={{position: 'absolute', top: -3, right: -28}}
                        size={"small"}
                        onClick={fillDataLogistika}>Л</Button>
                <Button style={{position: 'absolute', top: 23, right: -27}}
                        size={"small"}
                        onClick={fillDataVera}>В</Button>
            </div>

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
        </>
    )
}