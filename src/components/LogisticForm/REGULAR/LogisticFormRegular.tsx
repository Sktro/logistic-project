import {Form} from "antd";
import style from '../LogisticForm.module.css'
import dayjs from 'dayjs';
import {
    deliveryAddressOptions, legalCompanyOptions,
    transportCompanyOptions,
} from "../../../options";
import {useEffect} from "react";
import {useWatch} from "antd/es/form/Form";
import type {ValuesConsignmentRegular} from "../../../typesForm";
import {generateAndSaveExcelRegular} from "../../../lib/excelUtilsRegular";
import {DriverTransportFormRegular} from "./DriverTransportFormRegular";
import {CargoInfoFormRegular} from "./CargoInfoFormRegular";
import {DateAndWaybillFormRegular} from "./DateAndWaybillFormRegular";
import {LocationDetailsFormRegular} from "./LocationDetailsFormRegular";
import {SignatureAndDownloadFormRegular} from "./SignatureAndDownloadFormRegular";

export const LogisticFormRegular = () => {
    const [form] = Form.useForm()
    const deliveryAddressValue = useWatch('deliveryAddress', form)
    const transportCompanyValue = useWatch('transportCompany', form)

    useEffect(() => {
        form.setFieldsValue({
            deliveryDate: 1,
            currentDate: dayjs(),
            companyLegalAddress: legalCompanyOptions[0].value,
            quantityFirst: 0,
            quantitySecond: 0,
            truckSealNumber: '',
            cargoDescriptionsFirst: '',
            cargoDescriptionsSecond: '',
        })
    }, [form])

    const handleFinish = async (values: ValuesConsignmentRegular) => {
        const deliveryAddressLabel = deliveryAddressOptions.find(opt => opt.value === deliveryAddressValue)?.label || ''
        const transportCompanyLabel = transportCompanyOptions.find(opt => opt.value === transportCompanyValue)?.label || ''
        await generateAndSaveExcelRegular(values, deliveryAddressLabel, transportCompanyLabel, values.driverFullName, values.truckNumber)
    }

    return (
        <Form form={form}
              onFinish={handleFinish}
              initialValues={{deliveryDate: 1}}
              className={style.formContainer}>
            <DriverTransportFormRegular/>
            <CargoInfoFormRegular/>
            <DateAndWaybillFormRegular/>
            <LocationDetailsFormRegular/>
            <SignatureAndDownloadFormRegular/>
        </Form>
    )
}