import style from './HeaderLogistic.module.css'

interface HeaderProps {
    settings: boolean
    setSettings: (settings: boolean) => void
}

export const Header = ({setSettings}: HeaderProps) => {
    return (
        <header className={style.header}>
            <h2>СТОКМАНН - ЛОГИСТИК<span onClick={()=> setSettings(true)}>А</span></h2>
        </header>
    )
}