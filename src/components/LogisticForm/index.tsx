import {LogisticFormECOM} from "./ECOM/LogisticFormEcom.tsx";
import {LogisticFormRegular} from "./REGULAR/LogisticFormRegular.tsx";
import {useState} from "react";
import {Radio} from "antd";

type ConsignmentType = 'regular' | 'ecom'

const LogisticForm = () => {
    const [consignment, setConsignment] = useState<ConsignmentType>('regular')
    const [deliveryAddressOptions, setDeliveryAddressOptions] = useState<{ label: string; value: string }[]>([]);
    const [deliveryAddressOptionsFromEcom, setDeliveryAddressOptionsFromEcom] = useState<{ label: string; value: string }[]>([]);
    return (
        <>
            <span>Форма заполнения ТН</span>
            <Radio.Group
                style={{margin: '10px 0'}}
                onChange={(e) => setConsignment(e.target.value)}
                value={consignment}
                options={[
                    {value: 'regular', label: 'Регуляр'},
                    {value: 'ecom', label: 'ЕКОМ'},
                ]}
            />

            {consignment === 'regular' && <LogisticFormRegular deliveryAddressOptions={deliveryAddressOptions} setDeliveryAddressOptions={setDeliveryAddressOptions}/>}
            {consignment === 'ecom' && <LogisticFormECOM deliveryAddressOptionsFromEcom={deliveryAddressOptionsFromEcom} setDeliveryAddressOptionsFromEcom={setDeliveryAddressOptionsFromEcom}/>}
        </>
    )
}

export default LogisticForm