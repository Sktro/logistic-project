import {Form, InputNumber, Select} from "antd";
import style from "../LogisticForm.module.css";
import TextArea from "antd/es/input/TextArea";
import {typeCargo} from "../../../options";
import {useWatch} from "antd/es/form/Form";

export const CargoInfoFormRegular = () => {
    const cargoDescFirst = useWatch('cargoDescriptionsFirst')
    const cargoDescSecond = useWatch('cargoDescriptionsSecond')
    return (
        <>
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
        </>
    )
}