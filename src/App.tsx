import {Header} from "./components/Header/Header";
import style from './App.module.css'
import {LogisticFormRegular} from "./components/LogisticForm/LogisticFormRegular";
import {useState} from "react";
import {Radio, type RadioChangeEvent} from "antd";
import {LogisticFormECOM} from "./components/LogisticForm/LogisticFormEcom";

function App() {
    const [consignment, setConsignment] = useState(1)
    const onChange = (e: RadioChangeEvent) => {
        setConsignment(e.target.value)
    }

    return (
        <>
            <Header/>
            <main className={style.mainContainer}>
                Форма заполнения ТН
                <Radio.Group
                    style={{margin: '10px 0'}}
                    onChange={onChange}
                    value={consignment}
                    options={[
                        {value: 1, label: 'Регуляр'},
                        {value: 2, label: 'ЕКОМ'},
                    ]}
                />
                {consignment === 1 && <LogisticFormRegular/>}
                {consignment === 2 && <LogisticFormECOM/>}
            </main>
        </>
    )
}

export default App
