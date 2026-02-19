import { FaFacebook, FaInstagram } from "react-icons/fa";
import { NavLink } from "react-router";
const Footer = () => {
  return (
    <footer
      className="bg-[#1E5BCC] text-white p-4 pb-0 flex flex-col items-center font-crimsontext"
      aria-labelledby="footer-heading"
    >
      <div className="w-full max-w-300 flex flex-col gap-0 lg:gap-4">
        <h2 id="footer-heading" className="sr-only">
          Sidfot
        </h2>

        <div className="flex justify-between">
          {/* Help / Navigation */}
          <nav
            className="flex flex-col gap-2.5"
            aria-labelledby="footer-help-heading"
          >
            <h3
              className="font-bold text-[18px] lg:text-[32px]"
              id="footer-help-heading"
            >
              Hjälp
            </h3>
            <ul className="flex flex-col gap-2.5 text-[12px] lg:text-[20px]">
              <li>
                <NavLink
                  to="om-oss"
                  className="hover:underline"
                  aria-label="Läs mer om Asaad Food"
                >
                  Om oss
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="kontakta-oss"
                  className="hover:underline"
                  aria-label="Kontakta Asaad Food"
                >
                  Kontakta oss
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Contact / Social */}
          <div
            className="flex flex-col gap-2.5"
            aria-labelledby="footer-contact-heading"
          >
            <h3
              className="font-bold text-[18px] lg:text-[32px]"
              id="footer-contact-heading"
            >
              Håll kontakten
            </h3>
            <address className="not-italic flex flex-col gap-2.5 text-[12px] lg:text-[20px]">
              <a
                href="mailto:info@asaadfood.se"
                className="hover:underline"
                aria-label="Skicka e-post till Asaad Food"
              >
                info@asaadfood.se
              </a>

              <ul
                className="flex gap-3"
                aria-label="Asaad Foods sociala medier"
              >
                <li>
                  <a
                    href="https://www.instagram.com/asaadfood"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Följ Asaad Food på Instagram (öppnas i ny flik)"
                  >
                    <FaInstagram
                      size={24}
                      className="lg:w-8.5 lg:h-8.5"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.facebook.com/AsaadFood/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Följ Asaad Food på Facebook (öppnas i ny flik)"
                  >
                    <FaFacebook
                      size={22}
                      className="lg:w-8 lg:h-8"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>
        {/* Copyright */}
        <div className="self-center">
          <span className="text-[#e4e4e4] text-[8px] font-bold md:text-[12px] lg:text-[18px]">
            &copy; 2026 ASAAD FOOD AB. Alla rättigheter förbehållna.
          </span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
