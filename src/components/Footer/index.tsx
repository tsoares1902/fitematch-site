"use client";
import Link from "next/link";

const currentYear = new Date(Date.now()).getFullYear();

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white pt-16 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link
                  href="/"
                  className="mb-8 inline-block text-2xl font-bold tracking-tight text-black transition-colors hover:text-gray-900"
                >
                  fitematch
                </Link>
                <p className="mb-9 text-base leading-relaxed text-body-color">
                  Você pode nos encontrar em alguns canais:
                </p>
                <div className="flex items-center">
                  <a
                    href="/"
                    aria-label="facebook-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-6 text-body-color duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.1 10.4939V7.42705C12.1 6.23984 13.085 5.27741 14.3 5.27741H16.5V2.05296L13.5135 1.84452C10.9664 1.66676 8.8 3.63781 8.8 6.13287V10.4939H5.5V13.7183H8.8V20.1667H12.1V13.7183H15.4L16.5 10.4939H12.1Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <a
                    href="/"
                    aria-label="instagram-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-6 text-body-color duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current"
                    >
                      <rect x="3.5" y="3.5" width="17" height="17" rx="5" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="/"
                    aria-label="x-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-6 text-body-color duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9831 19.25L9.82094 13.3176L4.61058 19.25H2.40625L8.843 11.9233L2.40625 2.75H8.06572L11.9884 8.34127L16.9034 2.75H19.1077L12.9697 9.73737L19.6425 19.25H13.9831ZM16.4378 17.5775H14.9538L5.56249 4.42252H7.04674L10.808 9.6899L11.4584 10.6039L16.4378 17.5775Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <a
                    href="/"
                    aria-label="youtube-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-6 text-body-color duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      className="fill-current"
                    >
                      <path d="M17.5058 2.07119C17.3068 1.2488 16.7099 0.609173 15.9423 0.395963C14.5778 7.26191e-08 9.0627 0 9.0627 0C9.0627 0 3.54766 7.26191e-08 2.18311 0.395963C1.41555 0.609173 0.818561 1.2488 0.619565 2.07119C0.25 3.56366 0.25 6.60953 0.25 6.60953C0.25 6.60953 0.25 9.68585 0.619565 11.1479C0.818561 11.9703 1.41555 12.6099 2.18311 12.8231C3.54766 13.2191 9.0627 13.2191 9.0627 13.2191C9.0627 13.2191 14.5778 13.2191 15.9423 12.8231C16.7099 12.6099 17.3068 11.9703 17.5058 11.1479C17.8754 9.68585 17.8754 6.60953 17.8754 6.60953C17.8754 6.60953 17.8754 3.56366 17.5058 2.07119ZM7.30016 9.44218V3.77687L11.8771 6.60953L7.30016 9.44218Z" />
                    </svg>
                  </a>
                  <a
                    href="/"
                    aria-label="linkedin-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-6 text-body-color duration-300 hover:text-primary"
                  >
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M15.2196 0H1.99991C1.37516 0 0.875366 0.497491 0.875366 1.11936V14.3029C0.875366 14.8999 1.37516 15.4222 1.99991 15.4222H15.1696C15.7943 15.4222 16.2941 14.9247 16.2941 14.3029V1.09448C16.3441 0.497491 15.8443 0 15.2196 0ZM5.44852 13.1089H3.17444V5.7709H5.44852V13.1089ZM4.29899 4.75104C3.54929 4.75104 2.97452 4.15405 2.97452 3.43269C2.97452 2.71133 3.57428 2.11434 4.29899 2.11434C5.02369 2.11434 5.62345 2.71133 5.62345 3.43269C5.62345 4.15405 5.07367 4.75104 4.29899 4.75104ZM14.07 13.1089H11.796V9.55183C11.796 8.7061 11.771 7.58674 10.5964 7.58674C9.39693 7.58674 9.222 8.53198 9.222 9.47721V13.1089H6.94792V5.7709H9.17202V6.79076H9.19701C9.52188 6.19377 10.2466 5.59678 11.3711 5.59678C13.6952 5.59678 14.12 7.08925 14.12 9.12897V13.1089H14.07Z" />
                    </svg>
                  </a>
                  <a
                    href="/download-app"
                    aria-label="play-store-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-6 text-body-color duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M4.25 3.5C4.25 2.94 4.88 2.61 5.34 2.92L18.83 11.92C19.25 12.2 19.25 12.8 18.83 13.08L5.34 22.08C4.88 22.39 4.25 22.06 4.25 21.5V3.5Z" />
                      <path d="M8.24 5.58L15.94 12L8.24 18.42" fill="white" fillOpacity="0.28" />
                    </svg>
                  </a>
                  <a
                    href="/download-app"
                    aria-label="apple-store-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M16.75 12.62c-.03-2.42 1.98-3.59 2.07-3.65-1.13-1.65-2.89-1.88-3.51-1.91-1.49-.16-2.92.88-3.67.88-.76 0-1.92-.86-3.16-.83-1.62.03-3.13.95-3.96 2.4-1.69 2.93-.43 7.24 1.21 9.61.8 1.16 1.76 2.46 3.02 2.41 1.21-.05 1.67-.78 3.13-.78 1.46 0 1.88.78 3.15.75 1.3-.02 2.13-1.18 2.92-2.35.92-1.34 1.29-2.64 1.31-2.71-.03-.01-2.51-.96-2.53-3.82Z" />
                      <path d="M14.29 5.47c.66-.8 1.11-1.91.99-3.02-.95.04-2.1.63-2.78 1.42-.61.71-1.15 1.84-1 2.92 1.06.08 2.14-.54 2.79-1.32Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            </div>

            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black">
                  Suporte & Ajuda
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary"
                    >
                      Politica de Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-of-use"
                      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary"
                    >
                      Termos de Uso
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent"></div>
          <div className="py-8">
            <p className="text-center text-base text-body-color">
              © {currentYear} fitematch - Todos os direitos reservados
            </p>
            <p className="text-center text-base text-body-color">
              developer by <a
                href="http://drowper.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                drowper
              </a>
            </p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
