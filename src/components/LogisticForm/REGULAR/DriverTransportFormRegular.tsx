import {type CheckboxChangeEvent, Form, Input, Select} from "antd";
import style from "../LogisticForm.module.css";
import TextArea from "antd/es/input/TextArea";
import {transportCompanyOptions} from "../../../options";
import Checkbox from "antd/es/checkbox/Checkbox";
import {useState} from "react";

export const DriverTransportFormRegular = () => {
    const [form] = Form.useForm()
    const [required, setRequired] = useState(true)

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