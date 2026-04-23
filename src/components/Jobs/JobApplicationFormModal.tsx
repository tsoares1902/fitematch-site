"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePublish } from "react-icons/md";

import { createNewJobApply } from "@/services/apply/apply.api";
import { getLocaleFromPathname, localizePath } from "@/i18n/config";
import { getJobMongoId } from "@/services/job/job.helpers";
import { Job } from "@/services/job/job.types";
import { useAuth } from "@/contexts/auth-context";

type JobApplicationFormState = {
  acceptTerms: boolean;
};

type SubmitFeedback = {
  type: "success" | "error";
  message: string;
} | null;

function getUserIdFromToken(token: string | null) {
  if (!token) {
    return null;
  }

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
    const parsedPayload = JSON.parse(decodedPayload) as Record<string, unknown>;

    if (typeof parsedPayload.userId === "string") {
      return parsedPayload.userId;
    }

    if (typeof parsedPayload.sub === "string") {
      return parsedPayload.sub;
    }

    if (typeof parsedPayload.id === "string") {
      return parsedPayload.id;
    }

    return null;
  } catch {
    return null;
  }
}

export default function JobApplicationFormModal({
  job,
  onClose,
}: Readonly<{
  job: Job;
  onClose: () => void;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? "pt";
  const { accessToken } = useAuth();
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<JobApplicationFormState>({
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = useWatch({
    control,
    name: "acceptTerms",
  });
  const companyName = job.company?.name || "a empresa";
  const city = job.company?.address?.city?.trim() || "cidade não informada";
  const state = job.company?.address?.state?.trim() || "estado não informado";
  const jobMongoId = getJobMongoId(job);
  const userId = getUserIdFromToken(accessToken);
  const isSuccess = feedback?.type === "success";

  useEffect(() => {
    if (!feedback || feedback.type !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      onClose();
      router.push(localizePath("/jobs", locale));
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, locale, onClose, router]);

  const onSubmit = async () => {
    if (!jobMongoId || !userId) {
      setFeedback({
        type: "error",
        message: "Nao foi possivel enviar sua candidatura. Tente novamente.",
      });
      return;
    }

    try {
      await createNewJobApply({
        companyId: job.companyId,
        jobId: jobMongoId,
        userId,
        status: "active",
      });

      setFeedback({
        type: "success",
        message: "Voce enviou sua candidatura a esta vaga.",
      });
      reset({
        acceptTerms: false,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel enviar sua candidatura. Tente novamente.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xs border border-gray-200 bg-[#FCFCFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[#FCFCFC] px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-bold text-black md:text-3xl">
              Candidatar a vaga de {job.title}
            </h2>
            <p className="mt-2 text-sm text-body-color">
              Revise as informações antes de participar do processo seletivo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSuccess}
            className="rounded-full border border-gray-200 p-2 text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IoMdClose className="h-6 w-6" />
            <span className="sr-only">Fechar modal</span>
          </button>
        </div>

        <div className="p-6 md:p-8">
          {feedback ? (
            <div className="mb-6">
              <div
                className={`w-full rounded-sm px-6 py-4 text-center text-sm font-medium text-white ${
                  feedback.type === "success" ? "bg-green-900" : "bg-red-900"
                }`}
              >
                {feedback.message}
                {feedback.type === "success" ? " Redirecionando em 5 segundos." : ""}
              </div>
            </div>
          ) : null}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`space-y-8 ${isSuccess ? "pointer-events-none opacity-70" : ""}`}
            noValidate
          >
            <div className="rounded-xs border border-gray-200 bg-white p-6">
              <p className="text-base leading-relaxed text-body-color">
                Ao enviar sua candidatura, você confirma que deseja participar
                do processo seletivo da {companyName} localizada na cidade de {city} - {state}.
              </p>
            </div>

            <div className="rounded-xs border border-gray-200 bg-white p-6">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field }) => (
                  <label
                    htmlFor="acceptJobApplicationTerms"
                    className="text-body-color flex cursor-pointer items-center gap-3 text-sm font-medium"
                  >
                    <input
                      type="checkbox"
                      id="acceptJobApplicationTerms"
                      checked={field.value}
                      disabled={isSuccess}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>
                      Quero candidatar a vaga de <strong>{job.title}</strong> na unidade{" "}
                      <strong>{companyName}</strong>.
                    </span>
                  </label>
                )}
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSuccess}
                className="inline-flex items-center justify-center gap-2 rounded-xs border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <IoMdClose className="h-5 w-5 shrink-0" />
                Fechar
              </button>
              <button
                type="submit"
                disabled={!acceptTerms || isSubmitting || isSuccess}
                className="shadow-submit inline-flex items-center justify-center gap-2 rounded-xs bg-green-900 px-6 py-3 text-sm font-medium text-white duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <MdOutlinePublish className="h-5 w-5 shrink-0" />
                Enviar Candidatura
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
