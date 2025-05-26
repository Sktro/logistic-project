import style from "./LogisticForm.module.css";
import {Form, InputNumber} from "antd";

const centers = [
    {name: 'belayaDacha', label: 'Мега Белая Дача'},
    {name: 'kashirskayaPlaza', label: 'Каширская Плаза'},
    {name: 'columbus', label: 'Колумбус'},
    {name: 'tepliyStan', label: 'Теплый Стан'},
    {name: 'vegasKuncevo', label: 'Вегас Кунцево'},
    {name: 'vegasMyakinino', label: 'Вегас Мякинино'},
    {name: 'rigaMoll', label: 'Рига Молл'},
];

export const EcomTwoShopsForm = () => {
    return (
        <div className={style.shopContainer}>
            {centers.map((center) => (
                <Form.Item
                    key={center.name}
                    className={style.itemForm}
                    name={center.name}
                    label="ТЦ"
                    rules={[{required: true}]}
                >
                    <InputNumber
                        min={0}
                        size="small"
                        style={{width: '235px'}}
                        addonBefore={center.label}
                    />
                </Form.Item>
            ))}
        </div>
    )
}