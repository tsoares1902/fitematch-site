import Link from "next/link";
import { Feature } from "@/types/feature";
import { CiSearch } from "react-icons/ci";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { AiOutlineAlert } from "react-icons/ai";
import { IoLogoAndroid } from "react-icons/io";
import { FaApple } from "react-icons/fa";


const featuresData: Feature[] = [
  {
    id: 1,
    icon: <CiSearch size={40} />,
    title: "Busque Vagas",
    paragraph:
      <>
        Como candiadto, busque vagas nas mais renomadas academias, studios e negócios fitness.
      </>
  },
  {
    id: 2,
    icon: <MdFormatListBulletedAdd size={40} />,
    title: "Cadastre Vagas",
    paragraph:
      <>
        Como recrutador, cadastre vagas de sua empresa e acompanhe as candidaturas.
      </>
  },
  {
    id: 3,
    icon: <FaExchangeAlt size={40} />,
    title: "Sistema Match",
    paragraph:
      <>
        Crie parametros de candidatos e quando candiados se aplicarem receba os matches de vagas.
      </>
  },
  {
    id: 4,
    icon: <AiOutlineAlert size={40} />,
    title: "Alerta de Novas Vagas",
    paragraph:
      <>
        Adicione parametros para receber alertas de novas vagas com as características desejadas.
      </>
  },
  {
    id: 5,
    icon: <IoLogoAndroid size={40} />,
    title: "Aplicativo Android",
    paragraph:
      <>
        Em desenvolvimento para Android, em breve na {" "}
        <Link href="/#" className="text-primary hover:opacity-80">
          Play Store
        </Link>{" "}
        para download.
      </>
  },
  {
    id: 6,
    icon: <FaApple size={40} />,
    title: "Aplicativo iOS",
    paragraph:
      <>
        Em desenvolvimento para iOS, em breve na{" "}
        <Link href="/#" className="text-primary hover:opacity-80">
          Apple Store
        </Link>{" "}
        para download.
      </>
  },
];
export default featuresData;
