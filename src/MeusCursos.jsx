import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Lock,
  Play,
  Clock,
  Users,
  Star,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

/**
 * CoursesGridLogoCards_20.jsx
 * -----------------------------------------------------------------------------
 * ✅ 20 cards (mock) prontos, com TODOS os campos dinâmicos.
 * ✅ Espaço reservado para imagem/logo quadrada (como o exemplo que você mandou).
 * ✅ Botões: Acessar/Continuar (baseado em progress) + Drive (driveUrl).
 * ✅ Estados: granted | locked | soon (controla texto/botões).
 *
 * Requisitos:
 * - TailwindCSS configurado no projeto
 * - lucide-react instalado
 *
 * Uso:
 *   <CoursesGridLogoCards
 *      courses={SEUS_CURSOS}
 *      onOpenCourse={(course)=> navigate(`/curso/${course.id}`)}
 *   />
 */

// ✅ MOCK COM 20 CURSOS (troque pelos seus dados reais quando quiser)
const MOCK_COURSES = [
  {
    "id": "course_01",
    "title": "Estratégia Med",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 4,
    "duration": "20h",
    "rating": 4.5,
    "students": 1970,
    "progress": 0.48,
    "level": "Avançado",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Estrat%C3%A9gia%20MED/estrategiaMED.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/logo-estrategiamed.png"
  },
  {
    "id": "course_02",
    "title": "Medgrupo",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 3,
    "duration": "18h",
    "rating": 4.7,
    "students": 2302,
    "progress": 0,
    "level": "Básico",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Medgrupo/medgrupo.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/medgrupo-logo.jpg"
  },
  {
    "id": "course_03",
    "title": "Liberdade Médica",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 3,
    "duration": "16h",
    "rating": 4.7,
    "students": 2754,
    "progress": 0.48,
    "level": "Intermediário",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Liberdade%20M%C3%A9dica/liberdademedica.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/lm-logo.jpg"
  },
  {
    "id": "course_04",
    "title": "Raciocínio Clínico na Emergência",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 3,
    "duration": "19h",
    "rating": 4.8,
    "students": 2759,
    "progress": 0.12,
    "level": "Básico",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Dr%C2%BA.%20Eduardo%20Jo%C3%A3o/raciocinioEmerg%C3%AAncia.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/raciocinioClinicoEmergencia-logo.webp"
  },
  {
    "id": "course_05",
    "title": "Afya",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 3,
    "duration": "19h",
    "rating": 4.7,
    "students": 1483,
    "progress": 0,
    "level": "Avançado",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Afya/afya.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/afya-logo.jpg"
  },
  {
    "id": "course_06",
    "title": "Neurofácil",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 4,
    "duration": "8h",
    "rating": 4.7,
    "students": 982,
    "progress": 0,
    "level": "Intermediário",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Neurof%C3%A1cil/neuroflix.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/neurofacil-logo.jpg"
  },
  {
    "id": "course_07",
    "title": "PS Zerado",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 1,
    "duration": "17h",
    "rating": 4.8,
    "students": 1096,
    "progress": 0,
    "level": "Básico",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/PS%20Zerado/pszerado.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/pszerado-logo.jpg"
  },
  {
    "id": "course_08",
    "title": "Simm",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 2,
    "duration": "10h",
    "rating": 5.0,
    "students": 1668,
    "progress": 0.25,
    "level": "Intermediário",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/SIMM/simm.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/simm-logo.png"
  },
  {
    "id": "course_09",
    "title": "Emergência - Dr. Ian Ward",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 4,
    "duration": "17h",
    "rating": 4.6,
    "students": 657,
    "progress": 0.12,
    "level": "Básico",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Emerg%C3%AAncia%20-%20Dr.%20Ian%20Ward/emergenciaIanWard.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/ianward-logo.jpeg"
  },
  {
    "id": "course_10",
    "title": "Oftreview",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 3,
    "duration": "20h",
    "rating": 4.6,
    "students": 1647,
    "progress": 0,
    "level": "Intermediário",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/OFTReview/oftreviewextensivo.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/oftreview-logo.jpg"
  },
  {
    "id": "course_11",
    "title": "Medreview",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 1,
    "duration": "11h",
    "rating": 4.9,
    "students": 951,
    "progress": 0.48,
    "level": "Intermediário",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/MEDReview/escolhermedreview.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/medreview-logo.png"
  },
  {
    "id": "course_12",
    "title": "Tá de Clinicagem",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 4,
    "duration": "13h",
    "rating": 4.5,
    "students": 2715,
    "progress": 0.48,
    "level": "Básico",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/T%C3%A1%20de%20Clinicagem/tdc.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/tdc-logo.jpg"
  },
  {
    "id": "course_13",
    "title": "Medcof",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 5,
    "duration": "15h",
    "rating": 4.7,
    "students": 1070,
    "progress": 0,
    "level": "Avançado",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Medcof/medcofselecao.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/medcof-logo.jpg"
  },
  {
    "id": "course_14",
    "title": "Casal Medresumos",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 1,
    "duration": "15h",
    "rating": 4.8,
    "students": 1369,
    "progress": 0.48,
    "level": "Avançado",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/CasalMED%20Resumos/casalMEDResumos.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/casalmedresumos-logo.jpg"
  },
  {
    "id": "course_15",
    "title": "Curso de Clínica Médica Ambulatorial – 4ª Edição",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 2,
    "duration": "10h",
    "rating": 4.9,
    "students": 2302,
    "progress": 0.48,
    "level": "Básico",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Cl%C3%ADnica%20M%C3%A9dica%20Ambulatorial%20%E2%80%93%20%204%C2%AA%20edi%C3%A7%C3%A3o/clinicaMedicaAmbulatorialIVEd.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/cma4edi-logo.webp"
  },
  {
    "id": "course_16",
    "title": "Curso de Clínica Médica Ambulatorial - 3ª Edição: Turma II",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 4,
    "duration": "19h",
    "rating": 4.6,
    "students": 712,
    "progress": 0,
    "level": "Avançado",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Cl%C3%ADnica%20M%C3%A9dica%20Ambulatorial%20-%203%C2%AA%20Edi%C3%A7%C3%A3o%20-%20Turma%20II/clinicaMedicaAmbulatorial3EdTurmaII.html",
    "imageUrl": "https://devjvs.github.io/MedicinaJVS/Imagens/cma3edi-logo.png"
  },
  {
    "id": "course_17",
    "title": "Cardiologia",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 4,
    "duration": "9h",
    "rating": 4.9,
    "students": 2733,
    "progress": 0.12,
    "level": "Intermediário",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Cursos%20de%20Cardiologia/cursosCardiologia.html",
    "imageUrl": "https://static.vecteezy.com/ti/vetor-gratis/p1/4212714-icone-cardiologia-coracao-gratis-vetor.jpg"
  },
  {
    "id": "course_18",
    "title": "Psiquiatria na Prática",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 3,
    "duration": "20h",
    "rating": 4.7,
    "students": 1285,
    "progress": 0.12,
    "level": "Avançado",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://medicinajvs.github.io/Medicina-JVS---Provis-rio/Psiquiatria%20na%20Prática/escolherpsiquiatrianapratica.html",
    "imageUrl": "https://psiqpratica.com.br/wp-content/uploads/2023/08/cropped-cropped-logo-psiquiatria-pratica_000.png"
  },
  {
    "id": "course_19",
    "title": "HCXFM-USP",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 2,
    "duration": "13h",
    "rating": 4.9,
    "students": 511,
    "progress": 0.25,
    "level": "Intermediário",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/HCXFM-USP/hcxfmUSP.html",
    "imageUrl": "https://hcxfmusp.org.br/portal/wp-content/uploads/2024/03/logo-hcx-fmusp.png"
  },
  {
    "id": "course_20",
    "title": "Neuropost",
    "year": "2024",
    "provider": "Drive",
    "professorsCount": 4,
    "duration": "12h",
    "rating": 4.5,
    "students": 1430,
    "progress": 0.25,
    "level": "Avançado",
    "tags": [],
    "access": "granted",
    "driveUrl": "https://devjvs.github.io/MedicinaJVS/Neuropost/selecaoCurso.html",
    "imageUrl": "https://i.scdn.co/image/ab67656300005f1f3be8ff55415861f93209dc5a"
  }
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatPercent(v) {
  const p = Math.round((v || 0) * 100);
  return `${p}%`;
}

function formatStudents(n) {
  if (typeof n !== "number") return "";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    brand: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value }) {
  const pct = Math.max(0, Math.min(1, value || 0));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-blue-600 transition-all"
        style={{ width: `${pct * 100}%` }}
      />
    </div>
  );
}

/**
 * Espaço reservado para imagem quadrada (logo).
 * - Ajuste o size para ficar do tamanho que você quiser.
 * - object-contain para logo (não cortar).
 */
function SquareImageSlot({ src, alt, size = "xl" }) {
  const sizeClass =
    size === "sm"
      ? "h-16 w-16"
      : size === "md"
      ? "h-20 w-20"
      : size === "lg"
      ? "h-24 w-24"
      : "h-28 w-28"; // xl

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border bg-white shadow-sm",
        sizeClass
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain p-2"
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400">
          <ImageIcon className="h-6 w-6" />
          <span className="mt-1 text-[11px]">Imagem</span>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onOpenCourse }) {
  const locked = course.access === "locked";
  const soon = course.access === "soon";
  const hasStarted = (course.progress || 0) > 0;

  // ✅ Se quiser deixar o Drive sempre visível, remova !locked && !soon
  const canOpenDrive = Boolean(course.driveUrl) && !locked && !soon;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-lg",
        locked && "opacity-95"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <SquareImageSlot src={course.imageUrl} alt={course.title} size="xl" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              {course.year && <Badge tone="neutral">{course.year}</Badge>}
              {course.level && <Badge tone="neutral">{course.level}</Badge>}

              {locked && <Badge tone="danger">Bloqueado</Badge>}
              {soon && <Badge tone="warning">Em breve</Badge>}
              {!locked && !soon && <Badge tone="success">Liberado</Badge>}
            </div>

            <h3 className="mt-3 line-clamp-2 text-base font-semibold text-slate-900">
              {course.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              {course.provider && (
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium">{course.provider}</span>
                </span>
              )}
              {typeof course.professorsCount === "number" && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.professorsCount} prof.
                </span>
              )}
              {course.duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
              )}
              {typeof course.rating === "number" && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {course.rating}
                </span>
              )}
              {typeof course.students === "number" && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {formatStudents(course.students)} alunos
                </span>
              )}
            </div>

            {!!(course.tags || []).length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(course.tags || []).slice(0, 3).map((t) => (
                  <Badge key={t} tone="neutral">{t}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
            <span>Progresso</span>
            <span className="font-medium">{formatPercent(course.progress)}</span>
          </div>
          <ProgressBar value={course.progress} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => !locked && !soon && onOpenCourse?.(course)}
            disabled={locked || soon}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
              locked || soon
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {locked ? (
              <>
                <Lock className="h-4 w-4" />
                Bloqueado
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {hasStarted ? "Continuar" : "Acessar curso"}
              </>
            )}
          </button>

          {canOpenDrive ? (
            <a
              href={course.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
              title="Abrir no Drive"
            >
              <ExternalLink className="h-4 w-4" />
              Drive
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-300"
              title="Drive indisponível (curso não liberado)"
            >
              <ExternalLink className="h-4 w-4" />
              Drive
            </button>
          )}
        </div>

        {(locked || soon) && (
          <p className="mt-3 text-xs text-slate-500">
            {locked
              ? "Este curso está bloqueado. Libere o acesso para continuar."
              : "Conteúdo em preparação. Você será avisado quando liberar."}
          </p>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-blue-500/15 transition group-hover:ring-4" />
    </div>
  );
}

export default function CoursesGridLogoCards({
  courses = MOCK_COURSES,
  onOpenCourse,
  title = "Meus Cursos",
  subtitle = "Todos os dados do card são dinâmicos (20 cursos no mock).",
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    const base = (courses || []).filter((c) =>
      (c.title || "").toLowerCase().includes(q.trim().toLowerCase())
    );

    const byAccess =
      filter === "all" ? base : base.filter((c) => c.access === filter);

    const sorted = [...byAccess].sort((a, b) => {
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sort === "progress") return (b.progress || 0) - (a.progress || 0);
      return 0;
    });

    return sorted;
  }, [courses, q, filter, sort]);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar curso..."
              className="w-full rounded-xl border bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 sm:w-64"
            />
          </div>

          <div className="inline-flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">Todos</option>
              <option value="granted">Liberados</option>
              <option value="locked">Bloqueados</option>
              <option value="soon">Em breve</option>
            </select>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="recent">Ordenar: padrão</option>
            <option value="rating">Ordenar: avaliação</option>
            <option value="progress">Ordenar: progresso</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onOpenCourse={onOpenCourse}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border bg-white p-8 text-center">
          <p className="text-sm text-slate-600">Nenhum curso encontrado.</p>
        </div>
      )}
    </div>
  );
}
