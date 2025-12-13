import style from "../LogisticForm.module.css";
import {DatePicker, Form, Input, InputNumber} from "antd";

export const DateAndWaybillFormRegular = () => {
    return (
        <div className={style.dateContainer}>
            <Form.Item className={style.itemForm}
                       name="currentDate"
                       label="Дата">
                <DatePicker size={"small"}/>
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
    )
}