import {Header} from "./components/Header/Header";
import style from './App.module.css'
import {useState} from "react";
import LogisticForm from "./components/LogisticForm";
import Settings from "./components/Settings";


function App() {
    const [settings, setSettings] = useState<boolean>(false);

    return (
        <>
            <Header settings={settings} setSettings={setSettings}/>
            <main className={style.mainContainer}>
                {!settings && <LogisticForm/>}
                {settings && <Settings/>}
            </main>
        </>
    )
}

export default App