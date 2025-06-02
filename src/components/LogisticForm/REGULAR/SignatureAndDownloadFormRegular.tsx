import style from "../LogisticForm.module.css";
import {Button, Form, Select} from "antd";
import {specialistOptions} from "../../../options";

export const SignatureAndDownloadFormRegular = () => {
    return (
        <>
            <div className={style.footerContainer}>
                <Form.Item className={style.itemForm}
                           name="specialist"
                           label="Подпись"
                           rules={[{required: true, message: 'Выберите подпись'}]}>
                    <Select size={"small"}
                            style={{width: '165px'}}
                            options={specialistOptions}/>
                </Form.Item>
            </div>
            <Form.Item>
                <Button type="default"
                        htmlType="submit">
                    Скачать накладную
                </Button>
            </Form.Item>
        </>
    )
}