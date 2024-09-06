import "../styles/header.css"

export default function Header() {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark torresmoColor">
        <div class="container-fluid">
            <img src="./logo.png" alt="Logo do restaurante" width="80" height="80" />
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
            {/* <ul class="navbar-nav">
                <li class="nav-item dropdown">
                <button class="btn torresmoColor text-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </button>
                <ul class="dropdown-menu text-light torresmoColor">
                    <li><a class="dropdown-item" href="TODO">Action</a></li>
                    <li><a class="dropdown-item" href="TODO">Another action</a></li>
                    <li><a class="dropdown-item" href="TODO">Something else here</a></li>
                </ul>
                </li>
            </ul> */}
            </div>
        </div>
        </nav>
    )
}