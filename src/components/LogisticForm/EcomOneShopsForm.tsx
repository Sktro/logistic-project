import {Form, InputNumber} from 'antd';
import style from './LogisticForm.module.css'
import {useEffect} from "react";
const centers = [
    {name: 'smolenka', label: 'Смоленский пассаж-2'},
    {name: 'okeaniya', label: 'Океания'},
    {name: 'kapitoliy', label: 'Капитолий Вернадского'},
    {name: 'modniy', label: 'Модный сезон'},
    {name: 'aviapark', label: 'Авиапарк'},
    {name: 'evropolis', label: 'Европолис'},
    {name: 'megaHimki', label: 'Мега Химки'},
];

export const EcomShopsForm = () => {
    const [form] = Form.useForm()
    useEffect(() => {
        form.setFieldsValue({

        })
    }, [form])

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
    );
};
