import {Header} from "./components/Header/Header";
import style from './App.module.css'
import {LogisticForm} from "./components/LogisticForm/LogisticForm";

function App() {


    return (
        <>
            <Header/>
            <main className={style.mainContainer}>
                <LogisticForm/>
            </main>
        </>
    )
}

export default App
