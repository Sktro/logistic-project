import {Form, Select} from "antd";
import style from "../LogisticForm.module.css";
import {
    legalCompanyOptions,
    loadingAddressOptions,
    ownershipTypeOptions
} from "../../../options";

type LocationDetailsFormRegularProps = {
    deliveryAddressOptions: { label: string, value: string }[]
}

export const LocationDetailsFormRegular = ({deliveryAddressOptions}: LocationDetailsFormRegularProps) => {
    return (
        <>
            <Form.Item className={style.companyLegalAddress}
                       name="companyLegalAddress"
                       label="Юр. адресс компании">
                <Select size={"small"}
                        options={legalCompanyOptions}
                        disabled/>
            </Form.Item>
            <div className={style.addressContainer}>
                <Form.Item className={style.itemForm}
                           name="deliveryAddress"
                           label="Доставка"
                           rules={[{required: true, message: 'Выберите адресс доставки'}]}>
                    <Select size={"small"}
                            style={{width: '130px'}}
                            showSearch
                            filterOption={(input, deliveryAddressOptions) =>
                                (deliveryAddressOptions?.label ?? '')
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={deliveryAddressOptions.sort((a, b) => a.label.localeCompare(b.label))}/>
                </Form.Item>
                <Form.Item className={style.itemForm}
                           name="loadingAddress"
                           label="Погрузка"
                           rules={[{required: true, message: 'Выберите адресс погрузки'}]}>
                    <Select size={"small"}
                            style={{width: '100px'}}
                            options={loadingAddressOptions}/>
                </Form.Item>
                <Form.Item className={style.itemForm}
                           name="ownershipType"
                           label="Тип владения"
                           rules={[{required: true, message: 'Выберите тип владения'}]}>
                    <Select size={"small"}
                            style={{width: '58px'}}
                            options={ownershipTypeOptions}/>
                </Form.Item>
            </div>
        </>
    )
}