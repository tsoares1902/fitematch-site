"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { createUser } from "@/api/user";

type CandidateRegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: string;
  acceptTermsOfUse: boolean;
  acceptPrivacyPolicy: boolean;
};

const inputClassName =
  "border-stroke text-body-color focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300";

const inputErrorClassName =
  "border-red-500 focus:border-red-500";

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

export function CandidateRegisterForm() {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CandidateRegisterFormData>({
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
        router.push("/account/signin");
      }
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, router]);

  const onSubmit = async (data: CandidateRegisterFormData) => {
    try {
      await createUser({
        role: "candidate",
        username: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        birthday: data.birthday,
        status: "active",
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
              <button className="border-stroke text-body-color hover:border-primary hover:bg-primary/5 hover:text-primary mb-6 flex w-full items-center justify-center rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300">
                <span className="mr-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_candidate_signup_google)">
                      <path
                        d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                        fill="#EB4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_candidate_signup_google">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Cadastrar com Google
              </button>
              <div className="mb-8 flex items-center justify-center">
                <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block"></span>
                <p className="text-body-color w-full px-5 text-center text-base font-medium">
                  Ou cadastre-se com seu e-mail
                </p>
                <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block"></span>
              </div>
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
                    htmlFor="firstName"
                    className="text-dark mb-3 block text-sm"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Digite seu primeiro nome"
                    aria-invalid={errors.firstName ? "true" : "false"}
                    className={`${inputClassName} ${errors.firstName ? inputErrorClassName : ""}`}
                    {...register("firstName", {
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
                  {errors.firstName ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  ) : null}
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="lastName"
                    className="text-dark mb-3 block text-sm"
                  >
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Digite seu sobrenome"
                    aria-invalid={errors.lastName ? "true" : "false"}
                    className={`${inputClassName} ${errors.lastName ? inputErrorClassName : ""}`}
                    {...register("lastName", {
                      required: "O sobrenome é obrigatório.",
                      minLength: {
                        value: 2,
                        message: "O sobrenome deve ter no mínimo 2 caracteres.",
                      },
                      maxLength: {
                        value: 64,
                        message: "O sobrenome deve ter no máximo 64 caracteres.",
                      },
                    })}
                  />
                  {errors.lastName ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.lastName.message}
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
                        href="/terms-of-use"
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
                        href="/privacy-policy"
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
                    className="shadow-submit bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Criar conta
                  </button>
                </div>
              </form>
              <p className="text-body-color text-center text-base font-medium">
                Já tem uma conta?{" "}
                <Link href="/account/signin" className="text-primary hover:underline">
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
