import dayjs from "dayjs";

export interface ValuesConsignmentRegular {
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

export interface ValuesConsignmentECOM {
    transportCompany: string // Транспортная компания
    driverPhoneNumber: number // Телефон водителя
    driverData: string // Данные водителя
    currentDate: dayjs.Dayjs // Дата(текущая)
    waybillNumber: string // № ТРН
    deliveryDate: string // Дата доставки
    cargoFirst: number // груз в коробках
    cargoSecond: number // груз в пустых б/б
    companyLegalAddress: string // Юр.адресс компании
    deliveryAddress: string // Адрес доставки
    transport: string // Марка машины
    truckNumber: string // Номер машины
    truckSealNumber: string // № пломбы
    specialist: string // Подпись
    driverFullName: string // ФИО водителя

    // направления ecom #1
    smolenka: number // Смоленский пассаж-2
    okeaniya: number // Океания
    kapitoliy: number // Капитолий Вернадского
    modniy: number // Модный сезон
    aviapark: number // Авиапарк
    evropolis: number // Европолис
    megaHimki: number // Мега Химки

    // направления ecom #2
    belayaDacha: number // Мега Белая Дача
    kashirskayaPlaza: number // Каширская Плаза
    columbus: number // Колумбус
    tepliyStan: number // Теплый Стан
    vegasKuncevo: number // Вегас Кунцево
    vegasMyakinino: number // Вегас Мякинино
    rigaMoll: number // Рига Молл
}