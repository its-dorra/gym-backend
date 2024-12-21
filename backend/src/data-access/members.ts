import { count, eq } from "drizzle-orm";

import type { MemberId, QueryParams, UserId } from "@/lib/types";

import { db } from "@/db";
import { type InsertedMember, memberTable } from "@/db/schemas/member.schema";

export async function getMembers({ page, pageSize }: QueryParams) {
  const offset = (page - 1) * pageSize;

  const [data, { totalCount }] = await Promise.all([
    db.query.memberTable.findMany({
      limit: pageSize,
      offset,
    }),
    db.select({ totalCount: count() }).from(memberTable).then(res => res[0]),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { currentPage: page, totalCount, data, totalPages };
}

export function getOneMember(memberId: MemberId) {
  return db.query.memberTable.findFirst({ where: eq(memberTable.id, memberId) });
}

export function createMember(userId: UserId, member: InsertedMember) {
  return db.insert(memberTable).values({ ...member, userId }).returning().then(res => res[0]);
}

export function updateMember(memberId: MemberId, updatedMember: Partial<InsertedMember>) {
  return db.update(memberTable).set(updatedMember).where(eq(memberTable.id, memberId)).returning().then(res => res[0]);
}

export function deleteMember(memberId: MemberId) {
  return db.update(memberTable).set({ deletedAt: new Date() }).where(eq(memberTable.id, memberId));
}
