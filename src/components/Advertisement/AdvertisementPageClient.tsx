"use client";

import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";

import AccountMenu from "@/components/Common/AccountMenu";
import { Company } from "@/interfaces/company.interface";

import AdvertisementFormModal from "./AdvertisementFormModal";

export default function AdvertisementPageClient({
  companies,
}: Readonly<{
  companies: Company[];
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <main className="bg-white pt-8 pb-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <AccountMenu />
            </div>
            <div className="rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12 lg:col-span-3">
              <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                Anúncios
              </h1>
              <p className="mb-6 text-body-color text-base leading-relaxed md:text-lg">
                Crie e gerencie anuncios de vagas.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center gap-3 rounded-xs border border-green-900 bg-green-900 px-6 py-3 text-base font-medium text-[#FCFCFC] transition-colors duration-300 hover:border-green-700 hover:bg-green-700"
              >
                <IoMdAddCircleOutline className="h-5 w-5 shrink-0" />
                <span>Criar anuncio</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen ? (
        <AdvertisementFormModal
          companies={companies}
          onClose={() => setIsModalOpen(false)}
        />
      ) : null}
    </>
  );
}
