"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { MdOutlinePublish } from "react-icons/md";

import { createNewJob } from "@/services/job/job.api";
import { Company } from "@/services/company/company.types";

function getCompanyId(company: Company) {
  return company._id ?? company.id ?? "";
}

type AdvertisementFormState = {
  companyId: string;
  title: string;
  description: string;
  slots: number;
  salary: string;
  healthInsurance: boolean;
  dentalInsurance: boolean;
  alimentationVoucher: boolean;
  transportationVoucher: boolean;
};

type SubmitFeedback = {
  type: "success" | "fail";
  message: string;
} | null;

const inputClassName =
  "w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900";

const inputErrorClassName = "border-red-500 focus:border-red-500";

function SwitchField({
  label,
  checked,
  onChange,
  className,
}: Readonly<{
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}>) {
  return (
    <label
      className={`flex items-center justify-between gap-4 rounded-xs border border-gray-200 bg-white px-4 py-3 ${className || ""}`}
    >
      <span className="text-sm font-medium text-black">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${
          checked ? "bg-green-900" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
        <span className="sr-only">{label}</span>
      </button>
    </label>
  );
}

export default function AdvertisementFormModal({
  companies,
  onClose,
}: Readonly<{
  companies: Company[];
  onClose: () => void;
}>) {
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdvertisementFormState>({
    mode: "onBlur",
    defaultValues: {
      companyId: companies[0] ? getCompanyId(companies[0]) : "",
      title: "",
      description: "",
      slots: 1,
      salary: "",
      healthInsurance: false,
      dentalInsurance: false,
      alimentationVoucher: false,
      transportationVoucher: false,
    },
  });

  const slotsValue = watch("slots");

  useEffect(() => {
    if (feedback?.type !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, onClose]);

  const onSubmit = async (data: AdvertisementFormState) => {
    try {
      const hasSelectedCompany = companies.some(
        (company) => getCompanyId(company) === data.companyId,
      );

      if (!hasSelectedCompany) {
        setFeedback({
          type: "fail",
          message: "Não foi possivel criar sua vaga!",
        });

        return;
      }

      await createNewJob({
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        slots: data.slots,
        requirements: {
          educationLevel: [],
          languages: [],
          hardSkills: {
            required: [],
            niceToHave: [],
          },
          softSkills: {
            required: [],
            niceToHave: [],
          },
        },
        benefits: {
          salary: Number(data.salary.replace(/[^\d,-]/g, "").replace(".", "").replace(",", ".")) || 0,
          healthInsurance: data.healthInsurance,
          dentalInsurance: data.dentalInsurance,
          alimentationVoucher: data.alimentationVoucher,
          transportationVoucher: data.transportationVoucher,
        },
        status: "pending",
      });

      reset({
        ...data,
        companyId: companies[0] ? getCompanyId(companies[0]) : "",
        title: "",
        description: "",
        slots: 1,
        salary: "",
        healthInsurance: false,
        dentalInsurance: false,
        alimentationVoucher: false,
        transportationVoucher: false,
      });
      setFeedback({
        type: "success",
        message: "Vaga criada com sucesso",
      });
    } catch (error) {
      const apiMessage = axios.isAxiosError(error)
        ? Array.isArray(error.response?.data?.message)
          ? error.response?.data?.message.join(" ")
          : error.response?.data?.message
        : null;

      setFeedback({
        type: "fail",
        message: apiMessage || "Não foi possivel criar sua vaga!",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xs border border-gray-200 bg-[#FCFCFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[#FCFCFC] px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-bold text-black md:text-3xl">
              Criar vaga
            </h2>
            <p className="mt-2 text-sm text-body-color">
              Preencha os dados do anuncio antes de publicar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-900"
          >
            <IoMdClose className="h-6 w-6" />
            <span className="sr-only">Fechar modal</span>
          </button>
        </div>

        <div className="p-6 md:p-8">
          {feedback?.type === "success" ? (
            <div className="space-y-6">
              <div className="w-full rounded-sm bg-green-900 px-6 py-4 text-center text-sm font-medium text-white">
                {feedback.message}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xs border border-green-900 bg-green-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-green-700 hover:bg-green-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <>
              {feedback ? (
                <div
                  className="mb-6 w-full rounded-sm bg-red-900 px-6 py-3 text-center text-sm font-medium text-white"
                >
                  {feedback.message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block w-full max-w-[320px] space-y-2">
                    <span className="text-sm font-medium text-black">Unidade</span>
                    <select
                      aria-invalid={errors.companyId ? "true" : "false"}
                      className={`${inputClassName} ${errors.companyId ? inputErrorClassName : ""}`}
                      {...register("companyId", {
                        required: "Selecione uma unidade.",
                      })}
                    >
                      {companies.map((company) => (
                        <option key={getCompanyId(company)} value={getCompanyId(company)}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {errors.companyId ? (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.companyId.message}
                      </p>
                    ) : null}
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_180px]">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-black">Título</span>
                    <input
                      type="text"
                      placeholder="Personal Trainer"
                      aria-invalid={errors.title ? "true" : "false"}
                      className={`${inputClassName} ${errors.title ? inputErrorClassName : ""}`}
                      {...register("title", {
                        required: "O título é obrigatório.",
                        minLength: {
                          value: 2,
                          message: "O título deve ter no mínimo 2 caracteres.",
                        },
                        maxLength: {
                          value: 255,
                          message: "O título deve ter no máximo 255 caracteres.",
                        },
                      })}
                    />
                    {errors.title ? (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    ) : null}
                  </label>

                  <div className="space-y-2">
                    <span className="text-sm font-medium text-black">Vagas</span>
                    <div className={`flex overflow-hidden rounded-xs border bg-white ${errors.slots ? "border-red-500" : "border-gray-200"}`}>
                      <button
                        type="button"
                        onClick={() =>
                          setValue("slots", Math.max(1, Number(slotsValue || 1) - 1), {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className="flex h-[50px] w-12 items-center justify-center border-r border-gray-200 text-lg font-semibold text-black transition-colors hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        aria-invalid={errors.slots ? "true" : "false"}
                        className="h-[50px] w-full bg-white px-4 text-center text-sm text-black outline-none"
                        {...register("slots", {
                          valueAsNumber: true,
                          required: "Informe a quantidade de vagas.",
                          min: {
                            value: 1,
                            message: "A quantidade mínima é 1.",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setValue("slots", Number(slotsValue || 1) + 1, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className="flex h-[50px] w-12 items-center justify-center border-l border-gray-200 text-lg font-semibold text-black transition-colors hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    {errors.slots ? (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.slots.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-black">Descrição</span>
                  <textarea
                    rows={5}
                    placeholder="Descreva as responsabilidades da vaga."
                    aria-invalid={errors.description ? "true" : "false"}
                    className={`${inputClassName} resize-none ${errors.description ? inputErrorClassName : ""}`}
                    {...register("description", {
                      required: "A descrição é obrigatória.",
                      minLength: {
                        value: 10,
                        message: "A descrição deve ter no mínimo 10 caracteres.",
                      },
                    })}
                  />
                  {errors.description ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  ) : null}
                </label>

                <hr className="border-gray-200" />

                <div className="grid gap-6">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-black">Salário</span>
                    <input
                      type="text"
                      placeholder="R$ 3.500,00"
                      aria-invalid={errors.salary ? "true" : "false"}
                      className={`${inputClassName} ${errors.salary ? inputErrorClassName : ""}`}
                      {...register("salary", {
                        required: "Informe o salário.",
                        maxLength: {
                          value: 255,
                          message: "O salário deve ter no máximo 255 caracteres.",
                        },
                      })}
                    />
                    {errors.salary ? (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.salary.message}
                      </p>
                    ) : null}
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name="healthInsurance"
                    render={({ field }) => (
                      <SwitchField
                        label="Plano de saúde"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="dentalInsurance"
                    render={({ field }) => (
                      <SwitchField
                        label="Plano odontológico"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="alimentationVoucher"
                    render={({ field }) => (
                      <SwitchField
                        label="Vale alimentação"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="transportationVoucher"
                    render={({ field }) => (
                      <SwitchField
                        label="Vale transporte"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 rounded-xs border border-orange-900 bg-[#FCFCFC] px-6 py-3 text-sm font-medium text-orange-900 transition-colors hover:border-orange-700 hover:bg-orange-700 hover:text-white"
                  >
                    <IoIosArrowDropleft className="h-5 w-5" />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xs border border-green-900 bg-green-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-green-700 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <MdOutlinePublish className="h-5 w-5" />
                    {isSubmitting ? "Publicando..." : "Publicar"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
