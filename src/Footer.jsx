import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./footer.css";
import "./styles.css";
import logo from "./assets/logo.png";

function Footer() {
  return (
    <>
      {/* Footer */}
      <div className="footer pt-4 pb-4 text-center text-white-50 text-md-start" id="footer">
        <div className="container">
          <div className="row fs-5">
            <div className="col-md-12 col-lg-6">
              <div className="info">
                <div className="d-flex"></div>
                <img src={logo} className="logo mb-2" alt="Logo" style={{ width: "55px", height: "55px" }} />
                <p>
                  My fingers danced over the keyboard, chasing high scores and virtual victories like a true gaming champion.
                </p>
                <div className="fa-copyright">
                  &copy; <span>2025 Bassant Tarek </span>. All rights reserved.
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-6">
              <div className="contact-us">
                <h5 className="mb-3">contact me :</h5>
                <a className="a" href="mailto:basant.tareq.2005@gmail.com">
                  basant.tareq.2005@gmail.com
                </a>

                <ul className="d-flex mt-3 list-unstyled gap-3">
                  <li>
                    <a href="https://www.linkedin.com/in/bassant-tarek-106a2031b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/bassant2005">
                      <i className="fa-brands fa-github"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;