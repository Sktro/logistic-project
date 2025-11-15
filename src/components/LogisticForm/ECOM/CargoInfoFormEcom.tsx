import style from "../LogisticForm.module.css";
import {Form, InputNumber} from "antd";

interface CargoInfoFormEcomProps {
    segmented: string
}

export const CargoInfoFormEcom = ({segmented}: CargoInfoFormEcomProps) => {
  return (
      <>
          <div className={style.cargoContainer}>
              <Form.Item className={style.itemForm}
                         name="cargoFirst"
                         label="Груз 1"
                         rules={[{required: true}]}>
                  <InputNumber min={0}
                               size={"small"}
                               style={{width: '135px'}}
                               addonAfter={'коробки'}/>
              </Form.Item>
              <Form.Item className={style.itemForm}
                         name="cargoSecond"
                         label="Груз 2"
                         rules={[{required: true}]}>
                  <InputNumber min={0}
                               size={"small"}
                               disabled={segmented === 'ЕКОМ №2' || segmented === 'ЕКОМ №1'}
                               style={{width: '150px'}}
                               addonAfter={'пустые б/б'}/>
              </Form.Item>
          </div>
      </>
  )
}