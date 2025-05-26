import dayjs from "dayjs";

export interface ValuesConsignmentRegular  {
    transportCompany: string // Транспортная компания
    driverData: string // Данные водителя
    currentDate: dayjs.Dayjs // Дата(текущая)
    waybillNumber: string // № ТРН
    deliveryDate: string // Дата доставки
    companyLegalAddress: string // Юр.адресс компании
    deliveryAddress: string // Адрес доставки
    cargoDescriptionsFirst: string // Наименование груза 1
    cargoDescriptionsSecond: string // Наименование груза 2
    quantityFirst: number // кол-во груза 1
    quantitySecond: number // кол-во груза 2
    cargoQuantityFirst: string // Тип груза 1
    cargoQuantitySecond: string // Тип груза 2
    transport: string // Марка машины
    truckNumber: string // Номер машины
    loadingAddress: string // Адрес погрузки
    truckSealNumber: string // № пломбы
    specialist: string // Подпись
    ownershipType: string // Тип владения
    driverFullName: string // ФИО водителя
}

export interface ValuesConsignmentECOM  {
    transportCompany: string // Транспортная компания
    phoneNumberDriver: number // Телефон водителя
    driverData: string // Данные водителя
    currentDate: dayjs.Dayjs // Дата(текущая)
    waybillNumber: string // № ТРН
    deliveryDate: string // Дата доставки
    companyLegalAddress: string // Юр.адресс компании
    deliveryAddress: string // Адрес доставки
    transport: string // Марка машины
    truckNumber: string // Номер машины
    loadingAddress: string // Адрес погрузки
    truckSealNumber: string // № пломбы
    specialist: string // Подпись
    ownershipType: string // Тип владения
    driverFullName: string // ФИО водителя
}