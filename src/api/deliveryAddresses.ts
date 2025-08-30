import axios from "axios";
import Papa from "papaparse";

export type DeliveryAddress = { label: string; value: string };

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQroOI_yU8alncfKmr1XNahvkU6xKR4ra085qFDg5ifmyDRthkKPCvFQfzOaptoWLRbeipb2oVDHPR6/pub?output=csv";

export async function loadDeliveryAddresses(): Promise<DeliveryAddress[]> {
    const {data} = await axios.get(SHEET_URL, {responseType: "text"});

    const parsed = Papa.parse<DeliveryAddress>(data, {
        header: true,
        skipEmptyLines: true,
    });
    return (parsed.data as DeliveryAddress[]).filter(
        (row) => row.label && row.value
    );
}