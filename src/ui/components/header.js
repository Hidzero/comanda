import "../styles/header.css"
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import logoPorco from '../../logo-porco.png';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark torresmoColor">
        <div className="container-fluid">
            <img src={logoPorco} alt="Logo do restaurante" width="150" height="80" />
            <img src={logo} alt="Logo do restaurante" width="80" height="80" />
            <div className="navbar-brand d-flex flex-row justify-content-center align-items-center">
                <Link className="m-3 navbar-brand" as={Link} to="/mesas">Mesas</Link>
                <Link className="navbar-brand hidden" as={Link} to="/caixa">Caixa</Link>
                <Link className="navbar-brand" as={Link} to="/cozinha">Cozinha</Link>
                {/* <Link className="navbar-brand" as={Link} to="/logout">Logout</Link> */}
            </div>
            <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
            </div>
        </div>
        <style jsx="true">{`
            @media (max-width: 1200px) {
            .hidden {
                display: none;
            }
        }
        `}
        </style>
        </nav>
    )
}