import style from "../LogisticForm.module.css";
import {Form, Select} from "antd";
import {deliveryAddressOptions, specialistOptions} from "../../../options";

export const DestinationAndSignatureFormEcom = () => {
    return (
        <div className={style.addressContainer}>
            <Form.Item className={style.itemForm}
                       name="deliveryAddress"
                       label="Доставка">
                <Select size={"small"}
                        style={{width: '130px'}}
                        filterOption={(input, deliveryAddressOptions) =>
                            (deliveryAddressOptions?.label ?? '')
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        showSearch
                        options={deliveryAddressOptions.sort((a, b) => a.label.localeCompare(b.label))}/>
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
    )
}