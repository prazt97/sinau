"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

type PendingAction =
  | { type: "publish" }
  | { type: "revision"; notes: string }
  | { type: "delete-module"; moduleId: string; title: string }
  | { type: "delete-lesson"; lessonId: string; title: string };

export function CourseReviewActions({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  async function runAction(action: PendingAction) {
    setIsPending(true);
    setMessage("");

    const body =
      action.type === "revision"
        ? { action: action.type, reviewNotes: action.notes }
        : action.type === "delete-module"
          ? { action: action.type, moduleId: action.moduleId }
          : action.type === "delete-lesson"
            ? { action: action.type, lessonId: action.lessonId }
            : { action: action.type };

    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { message: string };

    setMessage(result.message);
    setIsPending(false);
    setPendingAction(null);

    if (response.ok) router.refresh();
  }

  function requestRevision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const notes = String(
      new FormData(event.currentTarget).get("reviewNotes") ?? "",
    ).trim();

    if (!notes) {
      setMessage("Catatan revisi wajib diisi");
      return;
    }

    setPendingAction({ type: "revision", notes });
  }

  const dialogTitle =
    pendingAction?.type === "publish"
      ? "Publish course?"
      : pendingAction?.type === "revision"
        ? "Kembalikan ke creator?"
        : pendingAction?.type === "delete-module"
          ? "Hapus module?"
          : pendingAction?.type === "delete-lesson"
            ? "Hapus lesson?"
            : "";

  return (
    <div className="mt-5 grid gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => setPendingAction({ type: "publish" })}
          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Publish ke Katalog
        </button>
      </div>

      <form onSubmit={requestRevision} className="grid gap-2">
        <label className="grid gap-1 text-sm font-medium">
          Catatan revisi untuk creator
          <textarea
            name="reviewNotes"
            className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <button
          disabled={isPending}
          className="justify-self-start rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 outline-none transition hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950"
        >
          Kembalikan ke Creator
        </button>
      </form>

      {message ? (
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </p>
      ) : null}

      <ConfirmationDialog
        open={pendingAction !== null}
        title={dialogTitle}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          if (pendingAction) void runAction(pendingAction);
        }}
      >
        {pendingAction?.type === "publish" ? (
          <p>Course akan tampil di katalog dan module/lesson akan dipublish.</p>
        ) : pendingAction?.type === "revision" ? (
          <p>Course akan kembali menjadi draft agar creator dapat merevisi.</p>
        ) : pendingAction?.type === "delete-module" ? (
          <p>
            Module <strong>{pendingAction.title}</strong> beserta lesson di
            dalamnya akan dihapus.
          </p>
        ) : pendingAction?.type === "delete-lesson" ? (
          <p>
            Lesson <strong>{pendingAction.title}</strong> akan dihapus dari
            course ini.
          </p>
        ) : null}
      </ConfirmationDialog>
    </div>
  );
}

export function DeleteCourseContentButton({
  courseId,
  item,
}: {
  courseId: string;
  item:
    | { type: "delete-module"; moduleId: string; title: string }
    | { type: "delete-lesson"; lessonId: string; title: string };
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  async function deleteContent() {
    setIsPending(true);
    setMessage("");

    const body =
      item.type === "delete-module"
        ? { action: item.type, moduleId: item.moduleId }
        : { action: item.type, lessonId: item.lessonId };

    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { message: string };

    setMessage(result.message);
    setIsPending(false);
    setIsConfirming(false);

    if (response.ok) router.refresh();
  }

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsConfirming(true)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 outline-none transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
      >
        Hapus
      </button>
      {message ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {message}
        </span>
      ) : null}
      <ConfirmationDialog
        open={isConfirming}
        title={
          item.type === "delete-module" ? "Hapus module?" : "Hapus lesson?"
        }
        onCancel={() => setIsConfirming(false)}
        onConfirm={() => void deleteContent()}
      >
        {item.type === "delete-module" ? (
          <p>
            Module <strong>{item.title}</strong> beserta lesson di dalamnya akan
            dihapus.
          </p>
        ) : (
          <p>
            Lesson <strong>{item.title}</strong> akan dihapus dari course ini.
          </p>
        )}
      </ConfirmationDialog>
    </>
  );
}
