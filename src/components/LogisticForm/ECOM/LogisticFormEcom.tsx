import {Form, Segmented} from "antd";
import style from "../LogisticForm.module.css";
import {
    legalCompanyOptions, shopsOptionsECOM1, shopsOptionsECOM2, specialistOptions,
    transportCompanyOptions
} from "../../../options";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {RouteOneShopsFormEcom} from "./RouteOneShopsFormEcom";
import {RouteTwoShopsFormEcom} from "./RouteTwoShopsFormEcom";
import type {submitActionsType, ValuesConsignmentECOM} from "../../../typesForm";
import {useWatch} from "antd/es/form/Form";
import {generateAndSaveExcelECOM} from "../../../lib/excelUtilsECOM";
import {DriverTransportFormEcom} from "./DriverTransportFormEcom";
import {CargoInfoFormEcom} from "./CargoInfoFormEcom";
import {DateAndWaybillFormEcom} from "./DateAndWaybillFormEcom";
import {DestinationAndSignatureFormEcom} from "./DestinationAndSignatureFormEcom";
import {DocumentDownloadPanel} from "./DocumentDownloadPanel";
import {loadDeliveryAddresses} from "../../../api/deliveryAddresses.ts";

type SegmentedType = 'ЕКОМ №1' | 'ЕКОМ №2'

interface LogisticFormECOMProps {
    deliveryAddressOptionsFromEcom: { label: string, value: string }[]
    setDeliveryAddressOptionsFromEcom: (options: { label: string, value: string }[]) => void;
}

export const LogisticFormECOM = ({setDeliveryAddressOptionsFromEcom, deliveryAddressOptionsFromEcom}: LogisticFormECOMProps) => {
    const [form] = Form.useForm()
    const [segmented, setSegmented] = useState<SegmentedType>('ЕКОМ №1')
    const [submitType, setSubmitType] = useState<submitActionsType>('invoice')
    const deliveryAddressValue = useWatch('deliveryAddress', form)
    const transportCompanyValue = useWatch('transportCompany', form)
    const specialistValue = useWatch('specialist', form)

    useEffect(() => {
        loadDeliveryAddresses().then(setDeliveryAddressOptionsFromEcom);
        form.setFieldsValue({
            transportCompany: transportCompanyOptions[2].value,
            companyLegalAddress: legalCompanyOptions[0].value,
            cargoFirst: 0,
            cargoSecond: 0,
            currentDate: dayjs(),
            deliveryDate: 1,
            truckSealNumber: '',
            smolenka: 0,
            okeaniya: 0,
            kapitoliy: 0,
            modniy: 0,
            aviapark: 0,
            evropolis: 0,
            megaHimki: 0,
            belayaDacha: 0,
            kashirskayaPlaza: 0,
            columbus: 0,
            tepliyStan: 0,
            vegasKuncevo: 0,
            vegasMyakinino: 0,
            rigaMoll: 0,
            driverFullName: '',
            driverPhoneNumber: '',
            driverData: '',
            transport: '',
            truckNumber: '',
            waybillNumber: '',
            deliveryAddress: segmented === 'ЕКОМ №1' ? deliveryAddressOptionsFromEcom.find(s => s.label === "Химки")?.value : deliveryAddressOptionsFromEcom.find(s => s.label === "Рига")?.value,
            specialist: undefined,
        })
    }, [form, segmented])

    const handleFinish = async (values: ValuesConsignmentECOM) => {
        const specialistLabel = specialistOptions.find(opt => opt.value === specialistValue)?.label ?? ""
        const deliveryAddressLabel = deliveryAddressOptionsFromEcom.find(opt => opt.value === deliveryAddressValue)?.label ?? ""
        const transportCompanyLabel = transportCompanyOptions.find(opt => opt.value === transportCompanyValue)?.label ?? ""
        await generateAndSaveExcelECOM({
            values,
            submitType,
            segmented,
            deliveryAddressLabel,
            transportCompanyLabel,
            specialistLabel,
            shopsOptionsECOM1,
            shopsOptionsECOM2,
        })
    }

    const handleChangeSegmented = (value: SegmentedType) => {
        setSegmented(value)
    }

    return (
        <>
            <Segmented<SegmentedType>
                options={['ЕКОМ №1', 'ЕКОМ №2']}
                style={{marginBottom: '10px'}}
                onChange={handleChangeSegmented}
            />
            <Form form={form}
                  onFinish={handleFinish}
                  initialValues={{deliveryDate: 1}}
                  className={style.formContainer}>
                <DriverTransportFormEcom/>
                <CargoInfoFormEcom segmented={segmented}/>
                <DateAndWaybillFormEcom/>
                <DestinationAndSignatureFormEcom deliveryAddressOptionsFromEcom={deliveryAddressOptionsFromEcom}/>
                {segmented === 'ЕКОМ №1' ? <RouteOneShopsFormEcom/> : <RouteTwoShopsFormEcom/>}
                <DocumentDownloadPanel setSubmitType={setSubmitType}/>
            </Form>
        </>

    )
}