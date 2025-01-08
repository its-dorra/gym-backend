import { isAfter } from "date-fns";

import { db } from "@/db";
import { attendanceTable } from "@/db/schemas/attendance.schema";
import { ErrorWithStatus, type MemberId } from "@/lib/types";

import { getMemberMembership, incrememntMemberSessions } from "./memberships";

export function getAttendancesByMemberId(memberId: MemberId) {
  return db.query.attendanceTable.findMany({ where: (fields, { eq }) => eq(fields.memberId, memberId) });
}

export async function addAttendance(memberId: MemberId, checkInTime: Date = new Date()) {
  const memberMembership = await getMemberMembership(memberId);

  if (!memberMembership || isAfter(checkInTime, memberMembership.endDate || memberMembership.sessionUsed === memberMembership.totalSessions))
    throw new ErrorWithStatus("You don't have a membership or your membership expired", 400);

  const [newAttendance] = await Promise.all([
    db.insert(attendanceTable).values({ memberId, checkInTime }).returning().then(res => res?.[0]),
    incrememntMemberSessions(memberMembership.id, memberMembership.sessionUsed + 1),
  ]);

  return newAttendance;
}
