export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT';
  sessionName?: string;
  markedBy?: string;
}

export interface MonthlyAttendanceStats {
  monthName: string;
  year: number;
  totalPresent: number;
  totalAbsent: number;
  totalRecordedDays: number;
  percentage: number;
  calendarDays: {
    dayOfWeek: number; // 0 (Sun) to 6 (Sat)
    dayOfMonth: number;
    dateString: string;
    status: 'PRESENT' | 'ABSENT' | 'NOT_RECORDED';
  }[];
}

export function computeMonthlyAttendance(
  year: number,
  monthIndex: number, // 0 = Jan, 11 = Dec
  records: AttendanceRecord[]
): MonthlyAttendanceStats {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const recordMap = new Map<string, 'PRESENT' | 'ABSENT'>();
  for (const r of records) {
    recordMap.set(r.date, r.status);
  }

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const calendarDays = [];

  let totalPresent = 0;
  let totalAbsent = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    const dayOfWeek = d.getDay();
    const mm = String(monthIndex + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateString = `${year}-${mm}-${dd}`;

    const status: 'PRESENT' | 'ABSENT' | 'NOT_RECORDED' = recordMap.get(dateString) || 'NOT_RECORDED';
    if (status === 'PRESENT') totalPresent++;
    if (status === 'ABSENT') totalAbsent++;

    calendarDays.push({
      dayOfWeek,
      dayOfMonth: day,
      dateString,
      status,
    });
  }

  const totalRecordedDays = totalPresent + totalAbsent;
  const percentage = totalRecordedDays > 0 ? Math.round((totalPresent / totalRecordedDays) * 100) : 0;

  return {
    monthName: monthNames[monthIndex],
    year,
    totalPresent,
    totalAbsent,
    totalRecordedDays,
    percentage,
    calendarDays,
  };
}
