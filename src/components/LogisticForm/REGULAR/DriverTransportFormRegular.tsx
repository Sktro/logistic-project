import {Button, type CheckboxChangeEvent, Form, Input, Select} from "antd";
import style from "../LogisticForm.module.css";
import TextArea from "antd/es/input/TextArea";
import {transportCompanyOptions} from "../../../options";
import Checkbox from "antd/es/checkbox/Checkbox";
import {useState} from "react";
import type {FormInstance} from "antd/es/form";
import {SignatureOutlined} from '@ant-design/icons';

type Props = {
    form: FormInstance;
};

export const DriverTransportFormRegular = ({form}: Props) => {
    const [required, setRequired] = useState(true)

    const fillCargoDriverData = () => {
        console.log("clicked");
        form.setFieldsValue({
            cargoDriverData: `ООО «Логистика», 121471, г. Москва, ул. Рябиновая, дом 44, офис 402`
        });
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked
        setRequired(isChecked)
        if (!isChecked) {
            form.setFields([
                {name: "truckSealNumber", errors: [], value: ''}
            ])
        } else {
            form.setFields([{name: "truckSealNumber", errors: ['Введите № пломбы']}
            ])
        }
    }

    return (
        <>
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
                        <Checkbox onChange={handleCheckboxChange} checked={required}
                                  style={{alignSelf: "start", marginTop: '6px'}}/>
                    </div>

                </div>
            </div>
        </>
    )
}