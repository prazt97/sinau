"use client";
import {
  FormEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CourseMenu } from "@/components/course-menu";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  lessonType: string;
  content: string | null;
  sortOrder: number;
};

type CourseModule = {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: Lesson[];
};

type CourseSummary = {
  title: string;
  slug: string;
  status: string;
  level: string | null;
  shortDescription: string | null;
  description: string | null;
};

type ContentResponse = {
  success: boolean;
  message: string;
  data?: {
    course: CourseSummary;
    modules: CourseModule[];
  };
};

export default function Builder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [course, setCourse] = useState<CourseSummary>();
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const firstModuleId = useMemo(() => modules[0]?.id ?? "", [modules]);
  const hasLesson = useMemo(
    () => modules.some((courseModule) => courseModule.lessons.length > 0),
    [modules],
  );
  const canSubmitReview =
    course?.status === "draft" && modules.length > 0 && hasLesson;

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`/api/courses/${id}/content`);
    const result = (await response.json()) as ContentResponse;

    if (response.ok && result.data) {
      setCourse(result.data.course);
      setModules(result.data.modules);
    } else {
      setMessage(result.message);
    }

    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const r = await fetch(`/api/courses/${id}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    const result = (await r.json()) as { message: string };
    setMessage(result.message);
    if (r.ok) {
      e.currentTarget.reset();
      await loadContent();
    }
  }

  async function updateContent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const response = await fetch(`/api/courses/${id}/content`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    const result = (await response.json()) as { message: string };
    setMessage(result.message);
    if (response.ok) await loadContent();
  }

  async function submitForReview() {
    setMessage("");
    setIsSubmittingReview(true);

    const response = await fetch(`/api/courses/${id}/submit-review`, {
      method: "POST",
    });
    const result = (await response.json()) as { message: string };

    setMessage(result.message);
    setIsSubmittingReview(false);

    if (response.ok) await loadContent();
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Builder</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {course
              ? `${course.title} - ${course.status}`
              : "Susun module dan lesson untuk course draft atau review."}
          </p>
        </div>
        <button
          type="button"
          onClick={submitForReview}
          disabled={!canSubmitReview || isSubmittingReview}
          className="w-fit rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmittingReview ? "Mengirim..." : "Submit Course"}
        </button>
      </div>

      {course?.status === "draft" && !canSubmitReview ? (
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-200">
          Tambahkan minimal satu module dan satu lesson sebelum submit course.
        </p>
      ) : null}

      <div className="mt-5">
        <CourseMenu role="creator" />
      </div>

      {course ? (
        <form
          onSubmit={updateContent}
          className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <input type="hidden" name="type" value="course" />
          <h2 className="text-base font-semibold">Edit Course</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Judul course <span className="text-red-600">*</span>
              <input
                name="title"
                required
                defaultValue={course.title}
                className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Slug <span className="text-red-600">*</span>
              <input
                name="slug"
                required
                defaultValue={course.slug}
                className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm font-medium">
            Level
            <select
              name="level"
              defaultValue={course.level ?? "beginner"}
              className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Deskripsi singkat
            <textarea
              name="shortDescription"
              defaultValue={course.shortDescription ?? ""}
              className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Deskripsi lengkap
            <textarea
              name="description"
              defaultValue={course.description ?? ""}
              className="min-h-32 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <button className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
            Update Course
          </button>
        </form>
      ) : null}

      <section className="mt-6 grid gap-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Memuat konten course...
          </div>
        ) : modules.length ? (
          modules.map((courseModule) => (
            <article
              key={courseModule.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                    Module {courseModule.sortOrder}
                  </p>
                  <h2 className="mt-1 text-base font-semibold">
                    {courseModule.title}
                  </h2>
                  {courseModule.description ? (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {courseModule.description}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {courseModule.lessons.length} lesson
                </span>
              </div>

              <form
                onSubmit={updateContent}
                className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950"
              >
                <input type="hidden" name="type" value="module" />
                <input type="hidden" name="moduleId" value={courseModule.id} />
                <h3 className="text-sm font-semibold">Edit Module</h3>
                <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                  <label className="grid gap-1 text-sm font-medium">
                    Judul <span className="text-red-600">*</span>
                    <input
                      name="title"
                      required
                      defaultValue={courseModule.title}
                      className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-blue-950"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-medium">
                    Urutan
                    <input
                      name="sortOrder"
                      type="number"
                      min="0"
                      defaultValue={courseModule.sortOrder}
                      className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-blue-950"
                    />
                  </label>
                </div>
                <label className="grid gap-1 text-sm font-medium">
                  Deskripsi
                  <textarea
                    name="description"
                    defaultValue={courseModule.description ?? ""}
                    className="min-h-20 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-blue-950"
                  />
                </label>
                <button className="justify-self-end rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 outline-none transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950">
                  Update Module
                </button>
              </form>

              <div className="mt-4 grid gap-2">
                {courseModule.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-950"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{lesson.title}</p>
                      <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                        {lesson.lessonType}
                      </span>
                    </div>
                    {lesson.content ? (
                      <p className="mt-2 line-clamp-2 text-slate-600 dark:text-slate-300">
                        {lesson.content}
                      </p>
                    ) : null}
                    <form
                      onSubmit={updateContent}
                      className="mt-3 grid gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <input type="hidden" name="type" value="lesson" />
                      <input type="hidden" name="lessonId" value={lesson.id} />
                      <h4 className="text-sm font-semibold">Edit Lesson</h4>
                      <label className="grid gap-1 text-sm font-medium">
                        Module <span className="text-red-600">*</span>
                        <select
                          name="moduleId"
                          required
                          defaultValue={courseModule.id}
                          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
                        >
                          {modules.map((moduleOption) => (
                            <option
                              key={moduleOption.id}
                              value={moduleOption.id}
                            >
                              {moduleOption.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="grid gap-3 sm:grid-cols-[1fr_140px_120px]">
                        <label className="grid gap-1 text-sm font-medium">
                          Judul <span className="text-red-600">*</span>
                          <input
                            name="title"
                            required
                            defaultValue={lesson.title}
                            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
                          />
                        </label>
                        <label className="grid gap-1 text-sm font-medium">
                          Tipe
                          <select
                            name="lessonType"
                            defaultValue={lesson.lessonType}
                            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
                          >
                            <option value="text">Text</option>
                            <option value="video">Video</option>
                            <option value="file">File</option>
                            <option value="embed">Embed</option>
                          </select>
                        </label>
                        <label className="grid gap-1 text-sm font-medium">
                          Urutan
                          <input
                            name="sortOrder"
                            type="number"
                            min="0"
                            defaultValue={lesson.sortOrder}
                            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
                          />
                        </label>
                      </div>
                      <label className="grid gap-1 text-sm font-medium">
                        Konten
                        <textarea
                          name="content"
                          defaultValue={lesson.content ?? ""}
                          className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
                        />
                      </label>
                      <button className="justify-self-end rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 outline-none transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950">
                        Update Lesson
                      </button>
                    </form>
                  </div>
                ))}
                {!courseModule.lessons.length ? (
                  <p className="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Belum ada lesson di module ini.
                  </p>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada module. Simpan module pertama sebelum menambahkan lesson.
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={submit}
          className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <input type="hidden" name="type" value="module" />
          <h2 className="text-base font-semibold">Tambah Module</h2>
          <label className="grid gap-1 text-sm font-medium">
            Judul <span className="text-red-600">*</span>
            <input
              name="title"
              required
              className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Urutan
            <input
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={modules.length + 1}
              className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Deskripsi
            <textarea
              name="description"
              className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <button className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
            Simpan Module
          </button>
        </form>

        <form
          onSubmit={submit}
          className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <input type="hidden" name="type" value="lesson" />
          <h2 className="text-base font-semibold">Tambah Lesson</h2>
          <label className="grid gap-1 text-sm font-medium">
            Module <span className="text-red-600">*</span>
            <select
              name="moduleId"
              required
              defaultValue={firstModuleId}
              disabled={!modules.length}
              className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            >
              {modules.map((courseModule) => (
                <option key={courseModule.id} value={courseModule.id}>
                  {courseModule.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Judul <span className="text-red-600">*</span>
            <input
              name="title"
              required
              disabled={!modules.length}
              className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Tipe
              <select
                name="lessonType"
                disabled={!modules.length}
                className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="file">File</option>
                <option value="embed">Embed</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Urutan
              <input
                name="sortOrder"
                type="number"
                min="0"
                defaultValue="1"
                disabled={!modules.length}
                className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm font-medium">
            Konten
            <textarea
              name="content"
              disabled={!modules.length}
              className="min-h-32 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <button
            disabled={!modules.length}
            className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Simpan Lesson
          </button>
        </form>
      </section>

      {message && (
        <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </p>
      )}
    </main>
  );
}
