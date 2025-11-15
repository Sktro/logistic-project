import style from "../LogisticForm.module.css";
import {Form, InputNumber} from "antd";
import {thirdRouteECOM} from "../../../options";

export const RouteThreeShopsFormEcom = () => {
    return (
        <div className={style.shopContainer}>
            {thirdRouteECOM.map((shop) => (
                <Form.Item
                    key={shop.name}
                    className={style.itemForm}
                    name={shop.name}
                    label="ТЦ"
                    rules={[{required: true}]}
                >
                    <InputNumber
                        min={0}
                        size="small"
                        style={{width: '235px'}}
                        addonBefore={shop.label}
                    />
                </Form.Item>
            ))}
        </div>
    )
}