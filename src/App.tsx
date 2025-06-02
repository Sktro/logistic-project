import {Header} from "./components/Header/Header";
import style from './App.module.css'
import {LogisticFormRegular} from "./components/LogisticForm/REGULAR/LogisticFormRegular";
import {useState} from "react";
import {Radio} from "antd";
import {LogisticFormECOM} from "./components/LogisticForm/ECOM/LogisticFormEcom";

type ConsignmentType = 'regular' | 'ecom'

function App() {
    const [consignment, setConsignment] = useState<ConsignmentType>('regular')

    return (
        <>
            <Header/>
            <main className={style.mainContainer}>
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

                {consignment === 'regular' && <LogisticFormRegular/>}
                {consignment === 'ecom' && <LogisticFormECOM/>}
            </main>
        </>
    )
}

export default App