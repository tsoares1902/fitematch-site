"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { MdOutlinePublish } from "react-icons/md";

import { createNewJob } from "@/api/job.api";
import { Company } from "@/interfaces/company.interface";
import { buildSlug } from "@/utils/slug";

const roleOptions = ["intern", "freelance", "contract_person", "contract_company"] as const;

type RoleOption = (typeof roleOptions)[number];

type AdvertisementFormState = {
  companyId: string;
  isPaidAdvertising: boolean;
  role: RoleOption;
  slug: string;
  title: string;
  slots: number;
  salary: string;
  bonus: string;
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
      companyId: companies[0]?.id || "",
      isPaidAdvertising: false,
      role: "intern",
      slug: "",
      title: "",
      slots: 1,
      salary: "",
      bonus: "",
    },
  });

  const bonusValue = watch("bonus");
  const titleValue = watch("title");
  const companyIdValue = watch("companyId");
  const slotsValue = watch("slots");
  const isPaidAdvertising = watch("isPaidAdvertising");

  const remainingBonusCharacters = useMemo(
    () => 255 - (bonusValue?.length || 0),
    [bonusValue],
  );

  useEffect(() => {
    const companyName =
      companies.find((company) => company.id === companyIdValue)?.name || "";
    const slugParts = [companyName, titleValue].filter(Boolean).join(" ");

    setValue("slug", buildSlug(slugParts), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [companies, companyIdValue, setValue, titleValue]);

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
        (company) => company.id === data.companyId,
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
        slug: data.slug,
        title: data.title,
        slots: data.slots,
        benefits: {
          salary: data.salary ? Number(data.salary.replace(/[^\d,-]/g, "").replace(".", "").replace(",", ".")) || null : null,
          transportation: false,
          alimentation: false,
          health: false,
          parking: false,
          bonus: data.bonus.trim(),
        },
        role: data.role,
        isPaidAdvertising: data.isPaidAdvertising,
        status: "pending",
      });

      reset({
        ...data,
        companyId: companies[0]?.id || "",
        isPaidAdvertising: false,
        role: "intern",
        slug: "",
        title: "",
        slots: 1,
        salary: "",
        bonus: "",
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
                <Controller
                  control={control}
                  name="isPaidAdvertising"
                  render={({ field }) => (
                    <SwitchField
                      label={`Colocar em Destaque: ${isPaidAdvertising ? "Sim" : "Não"}`}
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-full md:max-w-[320px]"
                    />
                  )}
                />

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
                        <option key={company.id} value={company.id}>
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

                  <label className="block w-full max-w-[320px] space-y-2">
                    <span className="text-sm font-medium text-black">Tipo de Vaga</span>
                    <select
                      aria-invalid={errors.role ? "true" : "false"}
                      className={`${inputClassName} ${errors.role ? inputErrorClassName : ""}`}
                      {...register("role", {
                        required: "Selecione o tipo de vaga.",
                      })}
                    >
                      <option value="intern">Estágio</option>
                      <option value="freelance">Autônomo</option>
                      <option value="contract_person">CLT</option>
                      <option value="contract_company">PJ</option>
                    </select>
                    {errors.role ? (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.role.message}
                      </p>
                    ) : null}
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-black">Slug</span>
                  <input
                    type="text"
                    readOnly
                    aria-invalid={errors.slug ? "true" : "false"}
                    className={`w-full cursor-not-allowed rounded-xs border bg-gray-100 px-4 py-3 text-sm outline-none ${errors.slug ? "border-red-500 text-red-500" : "border-gray-200 text-gray-500"}`}
                    placeholder="slug"
                    {...register("slug", {
                      required: "O slug é obrigatório.",
                    })}
                  />
                  {errors.slug ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.slug.message}
                    </p>
                  ) : null}
                </label>

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

                <label className="space-y-2">
                  <span className="text-sm font-medium text-black">Bônus</span>
                  <textarea
                    rows={5}
                    maxLength={255}
                    placeholder="Descreva regras ou detalhes adicionais do bônus."
                    aria-invalid={errors.bonus ? "true" : "false"}
                    className={`${inputClassName} resize-none ${errors.bonus ? inputErrorClassName : ""}`}
                    {...register("bonus", {
                      required: "O bônus é obrigatório.",
                      validate: (value) =>
                        value.trim().length > 0 || "O bônus é obrigatório.",
                      maxLength: {
                        value: 255,
                        message: "O bônus deve ter no máximo 255 caracteres.",
                      },
                    })}
                  />
                  <p className="text-right text-xs text-body-color">
                    {remainingBonusCharacters} caracteres restantes
                  </p>
                  {errors.bonus ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.bonus.message}
                    </p>
                  ) : null}
                </label>

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
