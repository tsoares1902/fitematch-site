"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { MdLogin } from "react-icons/md";

import { signIn } from "@/services/auth";
import { useLocale } from "@/contexts/locale-context";
import { localizePath } from "@/i18n/config";
import { useAuth } from "@/contexts/auth-context";
import {
  buildAuthClientContext,
  hasCompleteAuthClientContext,
} from "@/utils/auth-client-context";

type SignInFormData = {
  email: string;
  password: string;
  keepSignedIn: boolean;
};

type SubmitFeedback = {
  type: "success" | "fail";
  message: string;
} | null;

const inputClassName =
  "border-stroke text-body-color focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300";

const inputErrorClassName = "border-red-500 focus:border-red-500";

export function LoginForm() {
  const { setAuthTokens } = useAuth();
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: false,
    },
  });
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      const client = await buildAuthClientContext();

      if (!hasCompleteAuthClientContext(client)) {
        setFeedback({
          type: "fail",
          message: "Nao foi possivel coletar os dados do dispositivo.",
        });

        return;
      }

      const response = await signIn({
        client,
        email: data.email,
        password: data.password,
      });

      if (response.accessToken && response.refreshToken) {
        setAuthTokens(response.accessToken, response.refreshToken);
        reset({
          email: "",
          password: "",
          keepSignedIn: data.keepSignedIn,
        });
        setFeedback({
          type: "success",
          message: "Login success",
        });

        return;
      }

      setFeedback({
        type: "fail",
        message: "Login fail",
      });
    } catch {
      setFeedback({
        type: "fail",
        message: "Login fail",
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
                Login
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                Acesse sua conta.
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
                  <label htmlFor="email" className="text-dark mb-3 block text-sm">
                    Seu e-mail
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
                  <label htmlFor="password" className="text-dark mb-3 block text-sm">
                    Sua senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Digite sua senha"
                    aria-invalid={errors.password ? "true" : "false"}
                    className={`${inputClassName} ${errors.password ? inputErrorClassName : ""}`}
                    {...register("password", {
                      required: "A senha é obrigatória.",
                    })}
                  />
                  {errors.password ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>
                <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <label
                      htmlFor="keepSignedIn"
                      className="text-body-color flex cursor-pointer items-center text-sm font-medium select-none"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="keepSignedIn"
                          className="peer sr-only"
                          {...register("keepSignedIn")}
                        />
                        <div className="box border-body-color/20 peer-checked:border-primary mr-4 flex h-5 w-5 items-center justify-center rounded-sm border peer-checked:bg-primary">
                          <span className="opacity-0 peer-checked:opacity-100">
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="0.4"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                      Manter conectado
                    </label>
                  </div>
                  <div>
                    <a
                      href="#0"
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="shadow-submit flex w-full items-center justify-center gap-2 rounded-xs bg-blue-900 px-9 py-4 text-base font-medium text-white duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <MdLogin className="h-5 w-5 shrink-0" />
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </button>
                </div>
              </form>
              <p className="text-body-color text-center text-base font-medium">
                Ainda não tem uma conta?{" "}
                <Link
                  href={localizePath("/account/signup", locale)}
                  className="text-primary hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
