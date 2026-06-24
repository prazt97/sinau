-- DATABASE SCHEMA — Sinau LMS
-- Database: PostgreSQL
-- Deployment target: Railway
-- Required extension
create extension if not exists "pgcrypto";

-- =========================
-- ENUM TYPES
-- =========================

do $$ begin
  create type user_role as enum ('learner', 'creator', 'tutor', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type user_status as enum ('active', 'inactive', 'suspended');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type course_status as enum ('draft', 'review', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type lesson_type as enum ('text', 'video', 'file', 'embed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type discount_type as enum ('percentage', 'fixed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status as enum ('pending', 'approved', 'rejected', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type enrollment_status as enum ('active', 'completed', 'suspended');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type progress_status as enum ('not_started', 'in_progress', 'completed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type assignment_submission_status as enum ('submitted', 'reviewed', 'revision_required');
exception when duplicate_object then null;
end $$;

-- =========================
-- GLOBAL TABLES
-- =========================

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  full_name text not null,
  phone text,
  role user_role not null default 'learner',
  status user_status not null default 'active',
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- =========================
-- COURSE TABLES
-- =========================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references users(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  slug text unique not null,
  short_description text,
  description text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  estimated_duration_minutes integer default 0 check (estimated_duration_minutes >= 0),
  thumbnail_url text,
  status course_status not null default 'draft',
  learning_outcomes text[],
  requirements text[],
  published_at timestamptz,
  reviewed_by uuid references users(id) on delete set null,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists course_prices (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  regular_price numeric(14,2) not null default 0 check (regular_price >= 0),
  promo_price numeric(14,2) check (promo_price is null or promo_price >= 0),
  is_active boolean not null default true,
  effective_from timestamptz,
  effective_until timestamptz,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  title text not null,
  description text,
  lesson_type lesson_type not null default 'text',
  content text,
  video_url text,
  file_url text,
  embed_url text,
  duration_minutes integer default 0 check (duration_minutes >= 0),
  sort_order integer not null default 0,
  is_preview boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- PRICING & VOUCHER
-- =========================

create table if not exists vouchers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  discount_type discount_type not null,
  discount_value numeric(14,2) not null check (discount_value >= 0),
  max_discount_amount numeric(14,2) check (max_discount_amount is null or max_discount_amount >= 0),
  course_id uuid references courses(id) on delete cascade,
  usage_limit integer check (usage_limit is null or usage_limit >= 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean not null default true,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists voucher_usages (
  id uuid primary key default gen_random_uuid(),
  voucher_id uuid not null references vouchers(id) on delete cascade,
  learner_id uuid not null references users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  payment_confirmation_id uuid,
  discount_amount numeric(14,2) not null default 0 check (discount_amount >= 0),
  used_at timestamptz not null default now(),
  unique(voucher_id, learner_id, course_id, payment_confirmation_id)
);

-- =========================
-- PAYMENT & ENROLLMENT
-- =========================

create table if not exists payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  voucher_id uuid references vouchers(id) on delete set null,
  course_price numeric(14,2) not null check (course_price >= 0),
  discount_amount numeric(14,2) not null default 0 check (discount_amount >= 0),
  final_amount numeric(14,2) not null check (final_amount >= 0),
  paid_amount numeric(14,2) not null check (paid_amount >= 0),
  payment_method text not null,
  payer_name text not null,
  transfer_date date not null,
  proof_url text,
  status payment_status not null default 'pending',
  admin_notes text,
  verified_by uuid references users(id) on delete set null,
  verified_at timestamptz,
  rejected_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  payment_confirmation_id uuid references payment_confirmations(id) on delete set null,
  status enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  progress_percent numeric(5,2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  created_by uuid references users(id) on delete set null,
  unique(learner_id, course_id)
);

create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  status progress_status not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed_at timestamptz,
  unique(enrollment_id, lesson_id)
);

-- =========================
-- TUTORING & DISCUSSION
-- =========================

create table if not exists tutor_assignments (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  assigned_by uuid references users(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(tutor_id, course_id)
);

create table if not exists discussions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  learner_id uuid not null references users(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  title text not null,
  body text not null,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists discussion_replies (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references discussions(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  body text not null,
  is_tutor_answer boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================
-- ASSESSMENT
-- =========================

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  module_id uuid references modules(id) on delete set null,
  title text not null,
  description text,
  passing_score numeric(5,2) default 0 check (passing_score >= 0 and passing_score <= 100),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question_text text not null,
  question_type text not null default 'multiple_choice' check (question_type in ('multiple_choice', 'true_false', 'short_answer')),
  options jsonb,
  correct_answer jsonb,
  score numeric(8,2) not null default 1 check (score >= 0),
  sort_order integer not null default 0
);

create table if not exists quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  learner_id uuid not null references users(id) on delete cascade,
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  answers jsonb not null,
  score numeric(5,2),
  submitted_at timestamptz not null default now()
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  module_id uuid references modules(id) on delete set null,
  title text not null,
  description text not null,
  due_date timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  learner_id uuid not null references users(id) on delete cascade,
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  submission_text text,
  submission_file_url text,
  submission_link text,
  status assignment_submission_status not null default 'submitted',
  score numeric(5,2) check (score is null or (score >= 0 and score <= 100)),
  feedback text,
  reviewed_by uuid references users(id) on delete set null,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now()
);

-- =========================
-- INDEXES
-- =========================

create index if not exists idx_users_role on users(role);
create index if not exists idx_courses_status on courses(status);
create index if not exists idx_courses_creator on courses(creator_id);
create index if not exists idx_modules_course on modules(course_id);
create index if not exists idx_lessons_module on lessons(module_id);
create index if not exists idx_payment_status on payment_confirmations(status);
create index if not exists idx_payment_learner on payment_confirmations(learner_id);
create index if not exists idx_enrollments_learner on enrollments(learner_id);
create index if not exists idx_enrollments_course on enrollments(course_id);
create index if not exists idx_discussions_course on discussions(course_id);
create index if not exists idx_assignment_submissions_learner on assignment_submissions(learner_id);

-- =========================
-- UPDATED_AT TRIGGER
-- =========================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on users;
create trigger trg_users_updated_at
before update on users
for each row execute function set_updated_at();

drop trigger if exists trg_courses_updated_at on courses;
create trigger trg_courses_updated_at
before update on courses
for each row execute function set_updated_at();

drop trigger if exists trg_course_prices_updated_at on course_prices;
create trigger trg_course_prices_updated_at
before update on course_prices
for each row execute function set_updated_at();

drop trigger if exists trg_modules_updated_at on modules;
create trigger trg_modules_updated_at
before update on modules
for each row execute function set_updated_at();

drop trigger if exists trg_lessons_updated_at on lessons;
create trigger trg_lessons_updated_at
before update on lessons
for each row execute function set_updated_at();

drop trigger if exists trg_vouchers_updated_at on vouchers;
create trigger trg_vouchers_updated_at
before update on vouchers
for each row execute function set_updated_at();

drop trigger if exists trg_payment_confirmations_updated_at on payment_confirmations;
create trigger trg_payment_confirmations_updated_at
before update on payment_confirmations
for each row execute function set_updated_at();

drop trigger if exists trg_discussions_updated_at on discussions;
create trigger trg_discussions_updated_at
before update on discussions
for each row execute function set_updated_at();

-- =========================
-- PAYMENT APPROVAL FUNCTION
-- =========================
-- Use this transaction function from backend/API when admin approves payment.

create or replace function approve_payment_and_create_enrollment(
  p_payment_confirmation_id uuid,
  p_admin_id uuid
)
returns table(enrollment_id uuid) as $$
declare
  v_payment payment_confirmations%rowtype;
  v_enrollment_id uuid;
begin
  select * into v_payment
  from payment_confirmations
  where id = p_payment_confirmation_id
  for update;

  if not found then
    raise exception 'Payment confirmation not found';
  end if;

  if v_payment.status <> 'pending' then
    raise exception 'Only pending payment can be approved';
  end if;

  update payment_confirmations
  set status = 'approved',
      verified_by = p_admin_id,
      verified_at = now(),
      updated_at = now()
  where id = p_payment_confirmation_id;

  insert into enrollments (
    learner_id,
    course_id,
    payment_confirmation_id,
    status,
    created_by
  )
  values (
    v_payment.learner_id,
    v_payment.course_id,
    p_payment_confirmation_id,
    'active',
    p_admin_id
  )
  on conflict (learner_id, course_id)
  do update set
    status = 'active',
    payment_confirmation_id = excluded.payment_confirmation_id
  returning id into v_enrollment_id;

  if v_payment.voucher_id is not null then
    insert into voucher_usages (
      voucher_id,
      learner_id,
      course_id,
      payment_confirmation_id,
      discount_amount
    )
    values (
      v_payment.voucher_id,
      v_payment.learner_id,
      v_payment.course_id,
      p_payment_confirmation_id,
      v_payment.discount_amount
    )
    on conflict do nothing;

    update vouchers
    set usage_count = usage_count + 1,
        updated_at = now()
    where id = v_payment.voucher_id;
  end if;

  insert into audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (
    p_admin_id,
    'approve_payment',
    'payment_confirmations',
    p_payment_confirmation_id,
    jsonb_build_object('enrollment_id', v_enrollment_id)
  );

  return query select v_enrollment_id;
end;
$$ language plpgsql;

-- =========================
-- OPTIONAL SEED DATA
-- =========================

insert into categories (name, slug, description)
values
  ('Business', 'business', 'Course seputar bisnis dan entrepreneurship'),
  ('Digital Skill', 'digital-skill', 'Course keterampilan digital'),
  ('Productivity', 'productivity', 'Course produktivitas dan pengembangan diri')
on conflict (slug) do nothing;
