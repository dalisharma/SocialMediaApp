import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    function logout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">

            <div className="container">

                <Link
                    to="/home"
                    className="navbar-brand fw-bold fs-4"
                >
                    SocialMedia
                </Link>


                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

                        <Link
                            to="/home"
                            className="nav-link px-3"
                        >
                            Home
                        </Link>


                        {user && (
                            <>

                                <Link
                                    to="/friends"
                                    className="nav-link px-3"
                                >
                                    Friends
                                </Link>


                                <Link
                                    to="/create-post"
                                    className="nav-link px-3"
                                >
                                    Create Post
                                </Link>


                                <Link
                                    to={`/profile/${user.id}`}
                                    className="nav-link px-3"
                                >
                                    Profile
                                </Link>


                                <button
                                    onClick={logout}
                                    className="btn btn-danger btn-sm px-3 ms-lg-2"
                                >
                                    Logout
                                </button>

                            </>
                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}