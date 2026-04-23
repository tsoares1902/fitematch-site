"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  CiCirclePlus,
  CiEdit,
  CiFacebook,
  CiInstagram,
  CiLinkedin,
} from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  TbCircleNumber4Filled,
} from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";

import { AuthUser, me, updateMe } from "@/services/auth";
import AccountMenu from "@/components/Common/AccountMenu";
import ViaCepLookup from "@/components/Common/ViaCepLookup";
import { useAuth } from "@/contexts/auth-context";
import { getProfileDataFromToken } from "@/utils/auth-profile";

const NOT_INFORMED_LABEL = "Não informado";

function decodeTokenPayload(token: string) {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decodedPayload = window.atob(paddedPayload);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getUserIdFromToken(token: string | null) {
  if (!token) {
    return null;
  }

  const payload = decodeTokenPayload(token);

  if (!payload) {
    return null;
  }

  if (typeof payload.userId === "string") {
    return payload.userId;
  }

  if (typeof payload.sub === "string") {
    return payload.sub;
  }

  if (typeof payload.id === "string") {
    return payload.id;
  }

  return null;
}

function mapMeResponseToUser(response: Awaited<ReturnType<typeof me>>): AuthUser {
  return response;
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return NOT_INFORMED_LABEL;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return NOT_INFORMED_LABEL;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function getDisplayValue(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return NOT_INFORMED_LABEL;
}

function getOptionalValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function hasInformedValue(value: string | number | null | undefined) {
  const displayValue = getDisplayValue(value);

  return (
    displayValue !== NOT_INFORMED_LABEL &&
    displayValue !== "Nao informado" &&
    displayValue !== "(XX) XXXXX-XXXX"
  );
}

function buildSocialLink(baseUrl: string, value: string | null) {
  if (!value) {
    return null;
  }

  return `${baseUrl}${value}`;
}

function formatStatusLabel(value: string) {
  if (!value.trim()) {
    return NOT_INFORMED_LABEL;
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function getDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatRg(value: string) {
  const digits = getDigitsOnly(value).slice(0, 9);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
}

function formatCpf(value: string) {
  const digits = getDigitsOnly(value).slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function buildUserUpdateData(user: AuthUser, overrides: Partial<AuthUser>): AuthUser {
  return {
    ...user,
    ...overrides,
    candidateProfile: {
      ...user.candidateProfile,
      ...overrides.candidateProfile,
      contacts: {
        ...user.candidateProfile?.contacts,
        ...overrides.candidateProfile?.contacts,
        address: {
          ...user.candidateProfile?.contacts?.address,
          ...overrides.candidateProfile?.contacts?.address,
        },
        phone: {
          ...user.candidateProfile?.contacts?.phone,
          ...overrides.candidateProfile?.contacts?.phone,
        },
        social: {
          ...user.candidateProfile?.contacts?.social,
          ...overrides.candidateProfile?.contacts?.social,
        },
      },
      documents: {
        ...user.candidateProfile?.documents,
        ...overrides.candidateProfile?.documents,
        cpf: {
          ...user.candidateProfile?.documents?.cpf,
          ...overrides.candidateProfile?.documents?.cpf,
        },
        rg: {
          ...user.candidateProfile?.documents?.rg,
          ...overrides.candidateProfile?.documents?.rg,
        },
      },
    },
  };
}

type SectionHeaderProps = {
  buttonLabel: string;
  isCreate?: boolean;
  onClick?: () => void;
  title: string;
};

function SectionHeader({
  buttonLabel,
  isCreate = false,
  onClick,
  title,
}: Readonly<SectionHeaderProps>) {
  const Icon = isCreate ? IoIosAddCircleOutline : CiEdit;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h2 className="text-2xl font-bold uppercase text-black md:text-3xl">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center justify-center gap-2 self-start rounded-xs border border-gray-500 bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-gray-700 hover:bg-gray-700 hover:text-white"
      >
        <Icon className="text-lg" />
        {buttonLabel}
      </button>
    </div>
  );
}

type DocumentsFormState = {
  cpf: string;
  rg: string;
};

type InfoFormState = {
  birthday: string;
  email: string;
  name: string;
};

type ContactFormState = {
  city: string;
  complement: string;
  neighborhood: string;
  number: string;
  phone: string;
  state: string;
  street: string;
  telegram: boolean;
  whatsapp: boolean;
  zipCode: string;
};

type SocialFormState = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

type SubmitFeedback = {
  message: string;
  type: "fail" | "success";
} | null;

function stripSocialPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function getSocialPreview(value: string | undefined) {
  return value?.trim() || "username";
}

function formatDateInputValue(value: string | Date | null | undefined) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function InfoModal({
  defaultValues,
  onClose,
  onSubmit,
}: Readonly<{
  defaultValues: InfoFormState;
  onClose: () => void;
  onSubmit: (values: InfoFormState) => Promise<void>;
}>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InfoFormState>({
    mode: "onBlur",
    defaultValues,
  });
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xs border border-gray-200 bg-[#FCFCFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[#FCFCFC] px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-bold uppercase text-black md:text-3xl">
              Edição de Informações
            </h2>
            <p className="mt-2 text-sm text-body-color">
              Atualize seus dados principais para manter o perfil correto e completo.
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

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              await onSubmit(values);
              setFeedback({
                message: "Dados salvos com sucesso.",
                type: "success",
              });
            } catch {
              setFeedback({
                message: "Não foi possível salvar os dados.",
                type: "fail",
              });
            }
          })}
          className="space-y-8 p-6 md:p-8"
          noValidate
        >
          {feedback ? (
            <div
              className={`space-y-6 rounded-sm px-6 py-4 text-center text-sm font-medium text-white ${
                feedback.type === "success" ? "bg-green-900" : "bg-red-900"
              }`}
            >
              <div
                className="w-full"
              >
                {feedback.message}
              </div>
            </div>
          ) : null}
          <div className="rounded-xs border border-gray-200 bg-white p-6">
            <p className="text-base leading-relaxed text-body-color">
              Revise suas informações pessoais e corrija qualquer dado desatualizado.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="profile-info-name"
                className="mb-2 block text-sm font-medium text-black"
              >
                Nome
              </label>
              <input
                id="profile-info-name"
                type="text"
                {...register("name", {
                  required: "Informe seu nome.",
                  minLength: {
                    value: 2,
                    message: "Informe um nome válido.",
                  },
                })}
                className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                placeholder="Digite seu nome completo"
              />
              {errors.name ? (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="profile-info-email"
                className="mb-2 block text-sm font-medium text-black"
              >
                E-mail
              </label>
              <input
                id="profile-info-email"
                type="email"
                {...register("email", {
                  required: "Informe seu e-mail.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Informe um e-mail válido.",
                  },
                })}
                className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                placeholder="Digite seu e-mail"
              />
              {errors.email ? (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="profile-info-birthday"
                className="mb-2 block text-sm font-medium text-black"
              >
                Data de nascimento
              </label>
              <input
                id="profile-info-birthday"
                type="date"
                {...register("birthday", {
                  required: "Informe sua data de nascimento.",
                })}
                className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
              />
              {errors.birthday ? (
                <p className="mt-2 text-sm text-red-600">{errors.birthday.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xs border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-100"
            >
              <IoIosArrowDropleft className="h-5 w-5 shrink-0" />
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shadow-submit inline-flex items-center justify-center gap-2 rounded-xs bg-green-900 px-6 py-3 text-sm font-medium text-white duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CiEdit className="h-5 w-5 shrink-0" />
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContactModal({
  defaultValues,
  isCreate,
  onClose,
  onSubmit,
}: Readonly<{
  defaultValues: ContactFormState;
  isCreate: boolean;
  onClose: () => void;
  onSubmit: (values: ContactFormState) => Promise<void>;
}>) {
  const {
    clearErrors,
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormState>({
    mode: "onBlur",
    defaultValues,
  });
  const zipCodeValue = useWatch({
    control,
    name: "zipCode",
  });
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, onClose]);

  const handleViaCepError = useCallback(() => {
    setValue("street", "");
    setValue("neighborhood", "");
    setValue("city", "");
    setValue("state", "");
    setError("zipCode", {
      type: "manual",
      message: "Não foi possível localizar este CEP.",
    });
  }, [setError, setValue]);

  const handleViaCepSuccess = useCallback((address: {
    city: string;
    neighborhood: string;
    state: string;
    street: string;
  }) => {
    clearErrors("zipCode");
    setValue("street", address.street, { shouldDirty: true, shouldValidate: true });
    setValue("neighborhood", address.neighborhood, { shouldDirty: true, shouldValidate: true });
    setValue("city", address.city, { shouldDirty: true, shouldValidate: true });
    setValue("state", address.state, { shouldDirty: true, shouldValidate: true });
  }, [clearErrors, setValue]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xs border border-gray-200 bg-[#FCFCFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[#FCFCFC] px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-bold uppercase text-black md:text-3xl">
              {isCreate ? "Cadastro de Contatos" : "Edição de Contatos"}
            </h2>
            <p className="mt-2 text-sm text-body-color">
              Cadastre ou atualize seus dados de contato e endereço.
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

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              await onSubmit(values);
              setFeedback({
                message: isCreate ? "Dados cadastrados com sucesso." : "Dados salvos com sucesso.",
                type: "success",
              });
            } catch {
              setFeedback({
                message: isCreate ? "Não foi possível cadastrar os dados." : "Não foi possível salvar os dados.",
                type: "fail",
              });
            }
          })}
          className="space-y-8 p-6 md:p-8"
          noValidate
        >
          {feedback ? (
            <div
              className={`space-y-6 rounded-sm px-6 py-4 text-center text-sm font-medium text-white ${
                feedback.type === "success" ? "bg-green-900" : "bg-red-900"
              }`}
            >
              <div
                className="w-full"
              >
                {feedback.message}
              </div>
            </div>
          ) : null}
          <ViaCepLookup
            zipCode={zipCodeValue}
            onError={handleViaCepError}
            onSuccess={handleViaCepSuccess}
          />
          <div className="rounded-xs border border-gray-200 bg-white p-6">
            <p className="text-base leading-relaxed text-body-color">
              Preencha seus canais de contato e o endereço completo para facilitar a comunicação.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label
                htmlFor="profile-contact-phone"
                className="mb-2 block text-sm font-medium text-black"
              >
                Telefone
              </label>
              <input
                id="profile-contact-phone"
                type="text"
                {...register("phone", {
                  required: "Informe seu telefone.",
                  minLength: {
                    value: 10,
                    message: "Informe um telefone válido.",
                  },
                })}
                className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                placeholder="Digite seu telefone"
              />
              {errors.phone ? (
                <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <label className="flex items-center gap-3 rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-black md:col-span-2">
              <input
                type="checkbox"
                {...register("whatsapp")}
                className="h-4 w-4"
              />
              Possui WhatsApp
            </label>
            <label className="flex items-center gap-3 rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-black md:col-start-3 md:col-span-2">
              <input
                type="checkbox"
                {...register("telegram")}
                className="h-4 w-4"
              />
              Possui Telegram
            </label>
          </div>
          <div className="space-y-6">
            <div className="md:grid md:grid-cols-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="profile-contact-zip-code"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  CEP
                </label>
                <input
                  id="profile-contact-zip-code"
                  type="text"
                  {...register("zipCode", {
                    required: "Informe seu CEP.",
                    minLength: {
                      value: 8,
                      message: "Informe um CEP válido.",
                    },
                  })}
                  className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                  placeholder="Digite seu CEP"
                />
                {errors.zipCode ? (
                  <p className="mt-2 text-sm text-red-600">{errors.zipCode.message}</p>
                ) : null}
              </div>
            </div>

            <div className="md:grid md:grid-cols-4 md:gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="profile-contact-street"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Endereço
                </label>
                <input
                  id="profile-contact-street"
                  type="text"
                  {...register("street", {
                    required: "Informe seu endereço.",
                  })}
                  disabled
                  className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                  placeholder="Digite seu endereço"
                />
                {errors.street ? (
                  <p className="mt-2 text-sm text-red-600">{errors.street.message}</p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="profile-contact-number"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Número
                </label>
                <input
                  id="profile-contact-number"
                  type="text"
                  {...register("number", {
                    required: "Informe o número.",
                  })}
                  className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                  placeholder="Número"
                />
                {errors.number ? (
                  <p className="mt-2 text-sm text-red-600">{errors.number.message}</p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="profile-contact-complement"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Complemento
                </label>
                <input
                  id="profile-contact-complement"
                  type="text"
                  {...register("complement")}
                  className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                  placeholder="Complemento"
                />
              </div>
            </div>
            <div className="md:grid md:grid-cols-4 md:gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="profile-contact-neighborhood"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Bairro
                </label>
                <input
                  id="profile-contact-neighborhood"
                  type="text"
                  {...register("neighborhood", {
                    required: "Informe seu bairro.",
                  })}
                  disabled
                  className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900 disabled:bg-gray-100"
                  placeholder="Digite seu bairro"
                />
                {errors.neighborhood ? (
                  <p className="mt-2 text-sm text-red-600">{errors.neighborhood.message}</p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="profile-contact-city"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Cidade
                </label>
                <input
                  id="profile-contact-city"
                  type="text"
                  {...register("city", {
                    required: "Informe sua cidade.",
                  })}
                  disabled
                  className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900 disabled:bg-gray-100"
                  placeholder="Digite sua cidade"
                />
                {errors.city ? (
                  <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="profile-contact-state"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Estado
                </label>
                <input
                  id="profile-contact-state"
                  type="text"
                  {...register("state", {
                    required: "Informe seu estado.",
                  })}
                  disabled
                  className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900 disabled:bg-gray-100"
                  placeholder="Digite seu estado"
                />
                {errors.state ? (
                  <p className="mt-2 text-sm text-red-600">{errors.state.message}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xs border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-100"
            >
              <IoIosArrowDropleft className="h-5 w-5 shrink-0" />
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shadow-submit inline-flex items-center justify-center gap-2 rounded-xs bg-green-900 px-6 py-3 text-sm font-medium text-white duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CiCirclePlus className="h-5 w-5 shrink-0" />
              {isCreate ? "Cadastrar" : "Editar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SocialModal({
  defaultValues,
  isCreate,
  onClose,
  onSubmit,
}: Readonly<{
  defaultValues: SocialFormState;
  isCreate: boolean;
  onClose: () => void;
  onSubmit: (values: SocialFormState) => Promise<void>;
}>) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SocialFormState>({
    mode: "onBlur",
    defaultValues: {
      facebook: stripSocialPrefix(
        defaultValues.facebook,
        "https://www.facebook.com/",
      ),
      instagram: stripSocialPrefix(defaultValues.instagram, "https://www.instagram.com/"),
      linkedin: stripSocialPrefix(
        defaultValues.linkedin,
        "https://www.linkedin.com/in/",
      ),
      twitter: stripSocialPrefix(defaultValues.twitter, "https://x.com/"),
    },
  });
  const socialValues = useWatch({
    control,
  });
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xs border border-gray-200 bg-[#FCFCFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[#FCFCFC] px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-bold uppercase text-black md:text-3xl">
              {isCreate ? "Cadastro de Redes Sociais" : "Edição de Redes Sociais"}
            </h2>
            <p className="mt-2 text-sm text-body-color">
              Cadastre ou atualize seus perfis sociais para completar seu perfil.
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

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              await onSubmit(values);
              setFeedback({
                message: isCreate ? "Dados cadastrados com sucesso." : "Dados salvos com sucesso.",
                type: "success",
              });
            } catch {
              setFeedback({
                message: isCreate ? "Não foi possível cadastrar os dados." : "Não foi possível salvar os dados.",
                type: "fail",
              });
            }
          })}
          className="space-y-8 p-6 md:p-8"
          noValidate
        >
          {feedback ? (
            <div
              className={`space-y-6 rounded-sm px-6 py-4 text-center text-sm font-medium text-white ${
                feedback.type === "success" ? "bg-green-900" : "bg-red-900"
              }`}
            >
              <div
                className="w-full"
              >
                {feedback.message}
              </div>
            </div>
          ) : null}
          <div className="rounded-xs border border-gray-200 bg-white p-6">
            <p className="text-base leading-relaxed text-body-color">
              Adicione suas redes sociais.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="profile-social-facebook"
                className="mb-2 block text-sm font-medium text-black"
              >
                Facebook - https://www.facebook.com/
                <span className="font-bold">{getSocialPreview(socialValues.facebook)}</span>
              </label>
              <div className="flex overflow-hidden rounded-xs border border-gray-200 bg-white focus-within:border-blue-900">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-sm text-body-color">
                  <CiFacebook className="text-sm" />
                </span>
                <input
                  id="profile-social-facebook"
                  type="text"
                  {...register("facebook")}
                  className="w-full px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                  placeholder="username"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="profile-social-instagram"
                className="mb-2 block text-sm font-medium text-black"
              >
                Instagram - https://www.instagram.com/
                <span className="font-bold">{getSocialPreview(socialValues.instagram)}</span>
              </label>
              <div className="flex overflow-hidden rounded-xs border border-gray-200 bg-white focus-within:border-blue-900">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-sm text-body-color">
                  <CiInstagram className="text-sm" />
                </span>
                <input
                  id="profile-social-instagram"
                  type="text"
                  {...register("instagram")}
                  className="w-full px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                  placeholder="username"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="profile-social-twitter"
                className="mb-2 block text-sm font-medium text-black"
              >
                X - https://x.com/i
                <span className="font-bold">{getSocialPreview(socialValues.twitter)}</span>
              </label>
              <div className="flex overflow-hidden rounded-xs border border-gray-200 bg-white focus-within:border-blue-900">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-sm text-body-color">
                  <FaXTwitter className="text-sm" />
                </span>
                <input
                  id="profile-social-twitter"
                  type="text"
                  {...register("twitter")}
                  className="w-full px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                  placeholder="username"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="profile-social-linkedin"
                className="mb-2 block text-sm font-medium text-black"
              >
                LinkedIn - https://www.linkedin.com/in/
                <span className="font-bold">{getSocialPreview(socialValues.linkedin)}</span>
              </label>
              <div className="flex overflow-hidden rounded-xs border border-gray-200 bg-white focus-within:border-blue-900">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-sm text-body-color">
                  <CiLinkedin className="text-sm" />
                </span>
                <input
                  id="profile-social-linkedin"
                  type="text"
                  {...register("linkedin")}
                  className="w-full px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xs border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-100"
            >
              <IoIosArrowDropleft className="h-5 w-5 shrink-0" />
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shadow-submit inline-flex items-center justify-center gap-2 rounded-xs bg-green-900 px-6 py-3 text-sm font-medium text-white duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CiCirclePlus className="h-5 w-5 shrink-0" />
              {isCreate ? "Cadastrar" : "Editar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DocumentsModal({
  defaultValues,
  isCreate,
  onClose,
  onSubmit,
}: Readonly<{
  defaultValues: DocumentsFormState;
  isCreate: boolean;
  onClose: () => void;
  onSubmit: (values: DocumentsFormState) => Promise<void>;
}>) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DocumentsFormState>({
    mode: "onBlur",
    defaultValues: {
      cpf: formatCpf(defaultValues.cpf),
      rg: formatRg(defaultValues.rg),
    },
  });
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xs border border-gray-200 bg-[#FCFCFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[#FCFCFC] px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-bold uppercase text-black md:text-3xl">
              {isCreate ? "Cadastro de Documentos" : "Edição de Documentos"}
            </h2>
            <p className="mt-2 text-sm text-body-color">
              Cadastre ou atualize seus documentos para manter seu perfil completo.
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

        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              await onSubmit({
                cpf: getDigitsOnly(values.cpf),
                rg: getDigitsOnly(values.rg),
              });
              setFeedback({
                message: isCreate ? "Dados cadastrados com sucesso." : "Dados salvos com sucesso.",
                type: "success",
              });
            } catch {
              setFeedback({
                message: isCreate ? "Não foi possível cadastrar os dados." : "Não foi possível salvar os dados.",
                type: "fail",
              });
            }
          })}
          className="space-y-8 p-6 md:p-8"
          noValidate
        >
          {feedback ? (
            <div
              className={`space-y-6 rounded-sm px-6 py-4 text-center text-sm font-medium text-white ${
                feedback.type === "success" ? "bg-green-900" : "bg-red-900"
              }`}
            >
              <div
                className="w-full"
              >
                {feedback.message}
              </div>
            </div>
          ) : null}
          <div className="rounded-xs border border-gray-200 bg-white p-6">
            <p className="text-base leading-relaxed text-body-color">
              Informe seus documentos pessoais para facilitar a validação do cadastro
              e manter suas informações atualizadas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="profile-document-rg"
                className="mb-2 block text-sm font-medium text-black"
              >
                RG
              </label>
              <input
                id="profile-document-rg"
                type="text"
                {...register("rg", {
                  required: "Informe seu RG.",
                  minLength: {
                    value: 12,
                    message: "Informe um RG válido.",
                  },
                  onChange: (event) => {
                    setValue("rg", formatRg(event.target.value));
                  },
                })}
                className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                placeholder="Digite seu RG"
              />
              {errors.rg ? (
                <p className="mt-2 text-sm text-red-600">{errors.rg.message}</p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="profile-document-cpf"
                className="mb-2 block text-sm font-medium text-black"
              >
                CPF
              </label>
              <input
                id="profile-document-cpf"
                type="text"
                {...register("cpf", {
                  required: "Informe seu CPF.",
                  minLength: {
                    value: 14,
                    message: "Informe um CPF válido.",
                  },
                  onChange: (event) => {
                    setValue("cpf", formatCpf(event.target.value));
                  },
                })}
                className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900"
                placeholder="Digite seu CPF"
              />
              {errors.cpf ? (
                <p className="mt-2 text-sm text-red-600">{errors.cpf.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xs border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-100"
            >
              <IoIosArrowDropleft className="h-5 w-5 shrink-0" />
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shadow-submit inline-flex items-center justify-center gap-2 rounded-xs bg-green-900 px-6 py-3 text-sm font-medium text-white duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CiCirclePlus className="h-5 w-5 shrink-0" />
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type ProgressPanelProps = {
  icon: React.ComponentType<{ className?: string }>;
  isComplete: boolean;
  label: string;
};

function ProgressPanel({ icon: StepIcon, isComplete, label }: ProgressPanelProps) {
  const StatusIcon = isComplete ? IoIosCheckmarkCircle : StepIcon;

  return (
    <div
      className={`flex items-center gap-3 rounded-xs border border-gray-200 px-4 py-3 ${
        isComplete ? "bg-gray-100" : "bg-white"
      }`}
    >
      <StatusIcon
        className={`text-2xl ${isComplete ? "text-green-700" : "text-gray-500"}`}
      />
      <span className="text-sm font-semibold text-black md:text-base">
        {label}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { accessToken } = useAuth();
  const tokenProfileData = useMemo(
    () => getProfileDataFromToken(accessToken),
    [accessToken],
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [infoDraft, setInfoDraft] = useState<InfoFormState>({
    birthday: "",
    email: "",
    name: "",
  });
  const [documentsDraft, setDocumentsDraft] = useState<DocumentsFormState>({
    cpf: "",
    rg: "",
  });
  const [contactDraft, setContactDraft] = useState<ContactFormState>({
    city: "",
    complement: "",
    neighborhood: "",
    number: "",
    phone: "",
    state: "",
    street: "",
    telegram: false,
    whatsapp: false,
    zipCode: "",
  });
  const [socialDraft, setSocialDraft] = useState<SocialFormState>({
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!accessToken) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        const response = await me(accessToken);
        const mappedUser = mapMeResponseToUser(response);
        const documents = mappedUser.candidateProfile?.documents;
        const contacts = mappedUser.candidateProfile?.contacts;
        const address = contacts?.address;
        const phone = contacts?.phone;
        const social = contacts?.social;

        if (isMounted) {
          setUser(mappedUser);
          setInfoDraft({
            birthday: formatDateInputValue(mappedUser.birthday),
            email: typeof mappedUser.email === "string" ? mappedUser.email : "",
            name: typeof mappedUser.name === "string" ? mappedUser.name : "",
          });
          setDocumentsDraft({
            cpf: typeof documents?.cpf?.number === "string" ? documents.cpf.number : "",
            rg: typeof documents?.rg?.number === "string" ? documents.rg.number : "",
          });
          setContactDraft({
            city: typeof address?.city === "string" ? address.city : "",
            complement: typeof address?.complement === "string" ? address.complement : "",
            neighborhood: typeof address?.neighborhood === "string" ? address.neighborhood : "",
            number:
              typeof address?.number === "string" || typeof address?.number === "number"
                ? String(address.number)
                : "",
            phone: typeof phone?.number === "string" ? phone.number : "",
            state: typeof address?.state === "string" ? address.state : "",
            street: typeof address?.street === "string" ? address.street : "",
            telegram: typeof phone?.isTelegram === "boolean" ? phone.isTelegram : false,
            whatsapp: typeof phone?.isWhatsapp === "boolean" ? phone.isWhatsapp : false,
            zipCode: typeof address?.zipCode === "string" ? address.zipCode : "",
          });
          setSocialDraft({
            facebook: typeof social?.facebook === "string" ? social.facebook : "",
            instagram: typeof social?.instagram === "string" ? social.instagram : "",
            linkedin: typeof social?.linkedin === "string" ? social.linkedin : "",
            twitter:
              typeof social?.x === "string"
                ? social.x
                : typeof social?.twitter === "string"
                  ? social.twitter
                  : "",
          });
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isMounted) {
      setIsLoading(true);
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const name = user?.name || tokenProfileData.name;
  const status = user ? getDisplayValue(user.status) : tokenProfileData.status;
  const email = user ? getDisplayValue(user.email) : tokenProfileData.email;
  const birthday = user ? formatDate(user.birthday) : tokenProfileData.birthday;
  const documents = user?.candidateProfile?.documents;
  const contacts = user?.candidateProfile?.contacts;
  const address = contacts?.address;
  const contactPhone = contacts?.phone;
  const socialData = contacts?.social;
  const identityDocument = user
    ? getDisplayValue(documents?.rg?.number)
    : tokenProfileData.identityDocument;
  const socialDocument = user
    ? getDisplayValue(documents?.cpf?.number)
    : tokenProfileData.socialDocument;
  const phone = user ? getDisplayValue(contactPhone?.number) : tokenProfileData.phone;
  const neighborhood = user
    ? getDisplayValue(address?.neighborhood)
    : tokenProfileData.neighborhood;
  const city = user ? getDisplayValue(address?.city) : tokenProfileData.city;
  const state = user ? getDisplayValue(address?.state) : tokenProfileData.state;
  const zipCode = user ? getDisplayValue(address?.zipCode) : tokenProfileData.zipCode;
  const createdAt = user ? formatDate(user.createdAt) : tokenProfileData.createdAt;
  const street = user ? getDisplayValue(address?.street) : tokenProfileData.street;
  const number = user ? getDisplayValue(address?.number) : tokenProfileData.number;
  const complement = user ? getDisplayValue(address?.complement) : tokenProfileData.complement;
  const social = {
    instagram: getOptionalValue(socialData?.instagram),
    facebook: getOptionalValue(socialData?.facebook),
    twitter: getOptionalValue(socialData?.x ?? socialData?.twitter),
    linkedin: getOptionalValue(socialData?.linkedin),
  };
  const socialLinks = [
    {
      key: "instagram",
      label: "Instagram",
      href: buildSocialLink("https://www.instagram.com/", social.instagram),
      icon: CiInstagram,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: buildSocialLink("https://www.facebook.com/", social.facebook),
      icon: CiFacebook,
    },
    {
      key: "twitter",
      label: "X",
      href: buildSocialLink("https://x.com/", social.twitter),
      icon: FaXTwitter,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: buildSocialLink("https://www.linkedin.com/in/", social.linkedin),
      icon: CiLinkedin,
    },
  ].filter((item) => item.href);
  const formattedStatus = formatStatusLabel(status);
  const isActiveStatus = status.trim().toLowerCase() === "active";
  const isPendingStatus = status.trim().toLowerCase() === "pending";
  const hasDocuments =
    identityDocument !== NOT_INFORMED_LABEL || socialDocument !== NOT_INFORMED_LABEL;
  const hasContacts =
    hasInformedValue(contactPhone?.number ?? tokenProfileData.phone) ||
    hasInformedValue(address?.street ?? tokenProfileData.street) ||
    hasInformedValue(address?.number ?? tokenProfileData.number) ||
    hasInformedValue(address?.complement ?? tokenProfileData.complement) ||
    hasInformedValue(address?.neighborhood ?? tokenProfileData.neighborhood) ||
    hasInformedValue(address?.city ?? tokenProfileData.city) ||
    hasInformedValue(address?.state ?? tokenProfileData.state) ||
    hasInformedValue(address?.zipCode ?? tokenProfileData.zipCode);
  const hasSocialLinks = socialLinks.length > 0;

  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AccountMenu />
          </div>
          <div className="space-y-6 lg:col-span-3">
            {!isLoading ? (
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                <ProgressPanel
                  icon={TbCircleNumber1Filled}
                  isComplete
                  label="Informações"
                />
                <ProgressPanel
                  icon={TbCircleNumber2Filled}
                  isComplete={hasDocuments}
                  label="Documentos"
                />
                <ProgressPanel
                  icon={TbCircleNumber3Filled}
                  isComplete={hasContacts}
                  label="Contatos"
                />
                <ProgressPanel
                  icon={TbCircleNumber4Filled}
                  isComplete={hasSocialLinks}
                  label="Redes sociais"
                />
              </div>
            ) : null}
            <div className="rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
              {isLoading ? (
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  Carregando dados do perfil...
                </p>
              ) : (
                <>
              <SectionHeader
                title="Informações"
                buttonLabel="Editar"
                onClick={() => setIsInfoModalOpen(true)}
              />
              <hr className="my-6 border-gray-200" />
              <div className="space-y-4">
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Status:</span>{" "}
                  {isPendingStatus ? (
                    <Link href="#" className="font-medium text-blue-900 hover:underline">
                      Pendente de ativação
                    </Link>
                  ) : (
                    <span className={isActiveStatus ? "text-green-900" : undefined}>
                      {formattedStatus}
                    </span>
                  )}
                </p>
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Nome:</span> {name}
                </p>
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">E-mail:</span> {email}
                </p>
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Data de nascimento:</span>{" "}
                  {birthday}
                </p>
                <p className="text-body-color text-base leading-relaxed md:text-lg">
                  <span className="font-bold text-black">Membro Desde:</span> {createdAt}
                </p>
              </div>
              <hr className="my-6 border-gray-200" />
              <SectionHeader
                title="Documentos"
                buttonLabel={hasDocuments ? "Editar" : "Cadastrar"}
                isCreate={!hasDocuments}
                onClick={() => setIsDocumentsModalOpen(true)}
              />
              {hasDocuments ? (
                <>
                  <hr className="my-6 border-gray-200" />
                  <div className="space-y-4">
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">RG:</span> {identityDocument}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">CPF:</span> {socialDocument}
                    </p>
                  </div>
                </>
              ) : null}
              <hr className="my-6 border-gray-200" />
              <SectionHeader
                title="Contatos"
                buttonLabel={hasContacts ? "Editar" : "Cadastrar"}
                isCreate={!hasContacts}
                onClick={() => setIsContactsModalOpen(true)}
              />
              {hasContacts ? (
                <>
                  <hr className="my-6 border-gray-200" />
                  <div className="space-y-4">
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">Telefone:</span> {phone}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">Endereço:</span> {street}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">Número:</span> {number}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">Complemento:</span> {complement}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">Bairro:</span> {neighborhood}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">Cidade:</span> {city}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">Estado:</span> {state}
                    </p>
                    <p className="text-body-color text-base leading-relaxed md:text-lg">
                      <span className="font-bold text-black">CEP:</span> {zipCode}
                    </p>
                  </div>
                </>
              ) : null}
              <hr className="my-6 border-gray-200" />
              <SectionHeader
                title="Redes Sociais"
                buttonLabel={hasSocialLinks ? "Editar" : "Cadastrar"}
                isCreate={!hasSocialLinks}
                onClick={() => setIsSocialModalOpen(true)}
              />
              {hasSocialLinks ? (
                <>
                  <hr className="my-6 border-gray-200" />
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((socialLink) => {
                      const Icon = socialLink.icon;

                      return (
                        <a
                          key={socialLink.key}
                          href={socialLink.href!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xs border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-blue-900 hover:text-blue-900"
                        >
                          <Icon className="text-lg" />
                          {socialLink.label}
                        </a>
                      );
                    })}
                  </div>
                </>
              ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isInfoModalOpen ? (
        <InfoModal
          defaultValues={infoDraft}
          onClose={() => setIsInfoModalOpen(false)}
          onSubmit={async (values) => {
            if (!accessToken || !user) {
              throw new Error("User not available");
            }

            const updatedUser = await updateMe(
              accessToken,
              buildUserUpdateData(user, {
                name: values.name,
                birthday: values.birthday,
                email: values.email,
              }),
            ) as AuthUser;
            setInfoDraft(values);
            setUser(updatedUser);
          }}
        />
      ) : null}
      {isDocumentsModalOpen ? (
        <DocumentsModal
          defaultValues={documentsDraft}
          isCreate={!hasDocuments}
          onClose={() => setIsDocumentsModalOpen(false)}
          onSubmit={async (values) => {
            if (!accessToken || !user) {
              throw new Error("User not available");
            }

            const updatedUser = await updateMe(
              accessToken,
              buildUserUpdateData(user, {
                candidateProfile: {
                  documents: {
                    cpf: { number: values.cpf },
                    rg: { number: values.rg },
                  },
                },
              }),
            ) as AuthUser;
            setDocumentsDraft(values);
            setUser(updatedUser);
          }}
        />
      ) : null}
      {isContactsModalOpen ? (
        <ContactModal
          defaultValues={contactDraft}
          isCreate={!hasContacts}
          onClose={() => setIsContactsModalOpen(false)}
          onSubmit={async (values) => {
            if (!accessToken || !user) {
              throw new Error("User not available");
            }

            const updatedUser = await updateMe(
              accessToken,
              buildUserUpdateData(user, {
                candidateProfile: {
                  contacts: {
                    address: {
                      city: values.city,
                      complement: values.complement,
                      neighborhood: values.neighborhood,
                      number: values.number,
                      state: values.state,
                      street: values.street,
                      zipCode: values.zipCode,
                    },
                    phone: {
                      isTelegram: values.telegram,
                      isWhatsapp: values.whatsapp,
                      number: values.phone,
                    },
                  },
                },
              }),
            ) as AuthUser;
            setContactDraft(values);
            setUser(updatedUser);
          }}
        />
      ) : null}
      {isSocialModalOpen ? (
        <SocialModal
          defaultValues={socialDraft}
          isCreate={!hasSocialLinks}
          onClose={() => setIsSocialModalOpen(false)}
          onSubmit={async (values) => {
            if (!accessToken || !user) {
              throw new Error("User not available");
            }

            const updatedUser = await updateMe(
              accessToken,
              buildUserUpdateData(user, {
                candidateProfile: {
                  contacts: {
                    social: {
                      facebook: values.facebook,
                      instagram: values.instagram,
                      linkedin: values.linkedin,
                      x: values.twitter,
                      twitter: values.twitter,
                    },
                  },
                },
              }),
            ) as AuthUser;
            setSocialDraft(values);
            setUser(updatedUser);
          }}
        />
      ) : null}
    </main>
  );
}
