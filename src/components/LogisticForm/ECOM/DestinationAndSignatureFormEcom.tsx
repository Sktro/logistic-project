import style from "../LogisticForm.module.css";
import {Form, Select} from "antd";
import {specialistOptions} from "../../../options";

interface DestinationAndSignatureFormEcomProps {
    deliveryAddressOptionsFromEcom: { label: string, value: string }[]
}

export const DestinationAndSignatureFormEcom = ({deliveryAddressOptionsFromEcom}: DestinationAndSignatureFormEcomProps) => {
    return (
        <div className={style.addressContainer}>
            <Form.Item className={style.itemForm}
                       name="deliveryAddress"
                       label="Доставка">
                <Select size={"small"}
                        style={{width: '130px'}}
                        filterOption={(input, deliveryAddressOptionsFromEcom) =>
                            (deliveryAddressOptionsFromEcom?.label ?? '')
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        showSearch
                        options={deliveryAddressOptionsFromEcom.sort((a, b) => a.label.localeCompare(b.label))}/>
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