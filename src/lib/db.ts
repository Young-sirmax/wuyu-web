import postgres from "postgres";

/**
 * 数据层：Web 版使用 .env 中提供的 PostgreSQL（原微信云开发云数据库的等价落点）。
 * 首次启动时自动建表（幂等）。库中数据全部来自真实用户操作，无任何种子/预设/演示数据。
 * 覆盖原版 6 个集合：
 *   wy_users / wy_parties / wy_toastmasters_clubs / wy_vlogs / wy_messages / wy_evaluations
 * 另有 wy_appointments 供「练习次数」统计（与云函数语义一致）。
 * 全部业务表使用 wy_ 前缀，避开平台模板预置的 users 等表。
 */

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/wuyu";

const sql = postgres(databaseUrl, {
  max: 5,
  connect_timeout: 20,
  idle_timeout: 30,
});

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS wy_users (
      openid text PRIMARY KEY,
      name text NOT NULL,
      phone text DEFAULT '',
      student_id text DEFAULT '',
      school text DEFAULT 'current',
      school_name text DEFAULT '本校',
      role text DEFAULT 'chinese',
      avatar text DEFAULT '',
      native_lang text DEFAULT 'zh',
      learn_langs jsonb DEFAULT '["en"]',
      bio text DEFAULT '',
      credit_score int DEFAULT 80,
      practice_count int DEFAULT 0,
      rating_avg double precision DEFAULT 0,
      is_online boolean DEFAULT true,
      create_time text
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS wy_parties (
      _id text PRIMARY KEY,
      owner_openid text,
      title text NOT NULL,
      topic text DEFAULT '',
      language text DEFAULT 'en',
      school text DEFAULT 'current',
      school_name text DEFAULT '本校',
      host jsonb,
      members jsonb,
      max_members int DEFAULT 3,
      status text DEFAULT 'recruiting',
      scheduled_time text,
      location text DEFAULT '待定',
      create_time text
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS wy_toastmasters_clubs (
      _id text PRIMARY KEY,
      name text,
      school text DEFAULT 'current',
      school_name text DEFAULT '本校',
      intro text DEFAULT '',
      meeting_time text DEFAULT '',
      location text DEFAULT '',
      member_count int DEFAULT 0,
      cover text DEFAULT '',
      next_meeting text
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS wy_vlogs (
      _id text PRIMARY KEY,
      title text,
      author text,
      author_avatar text,
      cover text,
      duration text DEFAULT '',
      plays int DEFAULT 0,
      create_time text
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS wy_messages (
      _id text PRIMARY KEY,
      openid text NOT NULL,
      type text DEFAULT 'system',
      title text,
      content text,
      is_read boolean DEFAULT false,
      extra jsonb,
      create_time text
    )`;
  await sql`CREATE INDEX IF NOT EXISTS wy_idx_messages_openid ON wy_messages (openid, create_time DESC)`;

  await sql`
    CREATE TABLE IF NOT EXISTS wy_evaluations (
      _id text PRIMARY KEY,
      owner_openid text NOT NULL,
      owner_name text DEFAULT '',
      owner_avatar text DEFAULT '',
      target_openid text NOT NULL,
      target_name text DEFAULT '',
      target_avatar text DEFAULT '',
      appointment_id text DEFAULT '',
      dimensions jsonb,
      comment text DEFAULT '',
      create_time text
    )`;
  await sql`CREATE INDEX IF NOT EXISTS wy_idx_evaluations_target ON wy_evaluations (target_openid)`;
  await sql`CREATE INDEX IF NOT EXISTS wy_idx_evaluations_owner ON wy_evaluations (owner_openid)`;

  await sql`
    CREATE TABLE IF NOT EXISTS wy_appointments (
      _id text PRIMARY KEY,
      openid text NOT NULL,
      partner jsonb,
      language text DEFAULT 'en',
      scheduled_time text,
      duration int DEFAULT 30,
      status text DEFAULT 'completed',
      party_id text DEFAULT '',
      is_evaluated boolean DEFAULT false,
      create_time text
    )`;
  await sql`CREATE INDEX IF NOT EXISTS wy_idx_appointments_openid ON wy_appointments (openid)`;
}

function rowsToUsers(rows: any[]) {
  return rows.map((r) => ({
    openid: r.openid,
    name: r.name,
    phone: r.phone || "",
    studentId: r.student_id || "",
    school: r.school,
    schoolName: r.school_name,
    role: r.role,
    avatar: r.avatar || "",
    nativeLang: r.native_lang,
    learnLangs: r.learn_langs || [],
    bio: r.bio || "",
    creditScore: r.credit_score,
    practiceCount: r.practice_count,
    ratingAvg: Number(r.rating_avg || 0),
    isOnline: !!r.is_online,
    createTime: r.create_time || "",
  }));
}

function rowsToParties(rows: any[]) {
  return rows.map((r) => ({
    _id: r._id,
    title: r.title,
    topic: r.topic || "",
    language: r.language,
    school: r.school,
    schoolName: r.school_name,
    host: r.host || {},
    members: r.members || [],
    maxMembers: r.max_members,
    status: r.status,
    scheduledTime: r.scheduled_time || "",
    location: r.location || "待定",
    createTime: r.create_time || "",
  }));
}

export function toMessage(row: any) {
  return {
    _id: row._id,
    type: row.type,
    title: row.title,
    content: row.content,
    isRead: !!row.is_read,
    createTime: row.create_time,
    extra: row.extra || undefined,
  };
}

export function toUser(row: any) {
  return rowsToUsers([row])[0];
}

export { sql, ensureSchema, rowsToUsers, rowsToParties };

/** 确保建表已就绪（幂等，各进程懒执行一次）；不写入任何种子/演示数据 */
let readyPromise: Promise<void> | null = null;
export function ensureReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      try {
        await ensureSchema();
        console.log("[db] schema ready (no seed data)");
      } catch (err) {
        console.error("[db] init failed:", err);
        readyPromise = null;
        throw err;
      }
    })();
  }
  return readyPromise;
}
