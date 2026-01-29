import style from "../LogisticForm.module.css";
import {Button, Form, Input, Select} from "antd";
import {legalCompanyOptions, transportCompanyOptions} from "../../../options";
import TextArea from "antd/es/input/TextArea";
import type { FormInstance } from "antd/es/form";
import {SignatureOutlined} from "@ant-design/icons";

type Props = {
    form: FormInstance;
};

export const DriverTransportFormEcom = ({ form }: Props) => {

    const fillCargoDriverData = () => {
        console.log("clicked");
        form.setFieldsValue({
            cargoDriverData: `ООО «Логистика», 121471, г. Москва, ул. Рябиновая, дом 44, офис 402`
        });
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

                <Button onClick={fillCargoDriverData}
                        style={{position: 'absolute', top: -7, right: -28}}
                        type={"link"}
                        icon={<SignatureOutlined/>}/>
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
        </>
    )
}