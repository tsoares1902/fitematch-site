"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { FaUserPlus } from "react-icons/fa";

import { signUp } from "@/services/auth";
import { useLocale } from "@/contexts/locale-context";
import { localizePath } from "@/i18n/config";

type RecruiterRegisterFormData = {
  name: string;
  email: string;
  password: string;
  birthday: string;
  acceptTermsOfUse: boolean;
  acceptPrivacyPolicy: boolean;
};

const inputClassName =
  "border-stroke text-body-color focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300";

const inputErrorClassName = "border-red-500 focus:border-red-500";

type SubmitFeedback = {
  type: "success" | "fail";
  message: string;
} | null;

function validateBirthday(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "A data deve estar no formato YYYY-MM-DD.";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Informe uma data válida.";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return "Informe uma data válida.";
  }

  return true;
}

export function RecruiterRegisterForm() {
  const router = useRouter();
  const locale = useLocale();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterRegisterFormData>({
    mode: "onBlur",
  });
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);

  const acceptTermsOfUse = useWatch({
    control,
    name: "acceptTermsOfUse",
    defaultValue: false,
  });
  const acceptPrivacyPolicy = useWatch({
    control,
    name: "acceptPrivacyPolicy",
    defaultValue: false,
  });
  const canSubmit = acceptTermsOfUse && acceptPrivacyPolicy && !isSubmitting;

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);

      if (feedback.type === "success") {
        router.push(localizePath("/account/login", locale));
      }
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, locale, router]);

  const onSubmit = async (data: RecruiterRegisterFormData) => {
    try {
      await signUp({
        name: data.name.trim(),
        email: data.email,
        password: data.password,
        birthday: data.birthday,
        productRole: "recruiter",
      });

      reset();
      setFeedback({
        type: "success",
        message: "Success",
      });
    } catch {
      setFeedback({
        type: "fail",
        message: "Fail",
      });
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-8 pb-16 md:pb-20 lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                Criar sua conta
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                Crie sua conta.
              </p>
              {feedback ? (
                <div
                  className={`mb-6 w-full rounded-sm px-6 py-3 text-center text-sm font-medium text-white ${
                    feedback.type === "success" ? "bg-green-900" : "bg-red-900"
                  }`}
                >
                  {feedback.message}
                </div>
              ) : null}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-8">
                  <label
                    htmlFor="name"
                    className="text-dark mb-3 block text-sm"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Digite seu nome completo"
                    aria-invalid={errors.name ? "true" : "false"}
                    className={`${inputClassName} ${errors.name ? inputErrorClassName : ""}`}
                    {...register("name", {
                      required: "O nome é obrigatório.",
                      minLength: {
                        value: 2,
                        message: "O nome deve ter no mínimo 2 caracteres.",
                      },
                      maxLength: {
                        value: 64,
                        message: "O nome deve ter no máximo 64 caracteres.",
                      },
                    })}
                  />
                  {errors.name ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>
                <div className="mb-8">
                  <label htmlFor="email" className="text-dark mb-3 block text-sm">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Digite seu e-mail"
                    aria-invalid={errors.email ? "true" : "false"}
                    className={`${inputClassName} ${errors.email ? inputErrorClassName : ""}`}
                    {...register("email", {
                      required: "O e-mail é obrigatório.",
                      maxLength: {
                        value: 255,
                        message: "O e-mail deve ter no máximo 255 caracteres.",
                      },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Informe um e-mail válido.",
                      },
                    })}
                  />
                  {errors.email ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="text-dark mb-3 block text-sm"
                  >
                    Sua senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Crie uma senha"
                    aria-invalid={errors.password ? "true" : "false"}
                    className={`${inputClassName} ${errors.password ? inputErrorClassName : ""}`}
                    {...register("password", {
                      required: "A senha é obrigatória.",
                      minLength: {
                        value: 8,
                        message: "A senha deve ter no mínimo 8 caracteres.",
                      },
                      maxLength: {
                        value: 128,
                        message: "A senha deve ter no máximo 128 caracteres.",
                      },
                    })}
                  />
                  {errors.password ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="birthday"
                    className="text-dark mb-3 block text-sm"
                  >
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    placeholder="2024-03-01"
                    aria-invalid={errors.birthday ? "true" : "false"}
                    className={`${inputClassName} ${errors.birthday ? inputErrorClassName : ""}`}
                    {...register("birthday", {
                      required: "A data de nascimento é obrigatória.",
                      validate: validateBirthday,
                    })}
                  />
                  {errors.birthday ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.birthday.message}
                    </p>
                  ) : null}
                </div>
                <div className="mb-8">
                  <p className="text-body-color mb-4 text-sm font-medium">
                    Ao criar uma conta, você concorda com:
                  </p>
                  <label
                    htmlFor="acceptTermsOfUse"
                    className="text-body-color mb-3 flex cursor-pointer items-center gap-3 text-sm font-medium"
                  >
                    <input
                      type="checkbox"
                      id="acceptTermsOfUse"
                      className="h-4 w-4"
                      {...register("acceptTermsOfUse")}
                    />
                    <span>
                      Li e aceito{" "}
                      <Link
                        href={localizePath("/terms-of-use", locale)}
                        className="text-primary hover:underline"
                      >
                        Termos de Uso
                      </Link>
                    </span>
                  </label>
                  <label
                    htmlFor="acceptPrivacyPolicy"
                    className="text-body-color flex cursor-pointer items-center gap-3 text-sm font-medium"
                  >
                    <input
                      type="checkbox"
                      id="acceptPrivacyPolicy"
                      className="h-4 w-4"
                      {...register("acceptPrivacyPolicy")}
                    />
                    <span>
                      Li e aceito a{" "}
                      <Link
                        href={localizePath("/privacy-policy", locale)}
                        className="text-primary hover:underline"
                      >
                        Política de Privacidade
                      </Link>
                    </span>
                  </label>
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="shadow-submit flex w-full items-center justify-center gap-2 rounded-xs bg-green-900 px-9 py-4 text-base font-medium text-white duration-300 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FaUserPlus className="h-5 w-5 shrink-0" />
                    Criar conta
                  </button>
                </div>
              </form>
              <p className="text-body-color text-center text-base font-medium">
                Já tem uma conta?{" "}
                <Link href={localizePath("/account/login", locale)} className="text-primary hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
