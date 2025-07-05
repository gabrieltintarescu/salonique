/**
 * Date utility functions for handling timezone conversions
 * Romania timezone: Europe/Bucharest
 */

import { parseISO } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

// Romania timezone
const ROMANIA_TIMEZONE = 'Europe/Bucharest';

/**
 * Convert a Date object to UTC for database storage
 * Takes a date that represents Romania time and converts it to UTC
 */
export function toUTCForDatabase(date: Date): string {
    // Treat the input date as Romania time and convert to UTC
    const utcDate = fromZonedTime(date, ROMANIA_TIMEZONE);
    return utcDate.toISOString();
}

/**
 * Create a Date object from database ISO string (UTC) and convert to Romania time
 */
export function fromDatabaseToRomaniaTime(isoString: string): Date {
    // Parse the UTC date from database and convert to Romania time
    const utcDate = parseISO(isoString);
    return toZonedTime(utcDate, ROMANIA_TIMEZONE);
}

/**
 * Create a new Date representing current time in Romania timezone
 */
export function nowInRomania(): Date {
    return toZonedTime(new Date(), ROMANIA_TIMEZONE);
}

/**
 * Create a date in Romania timezone - simplified approach
 */
export function createRomaniaDate(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): Date {
    // Create date string in Romania timezone format
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

    // Parse as if it's in Romania timezone
    const tempDate = new Date(dateStr);
    return fromZonedTime(tempDate, ROMANIA_TIMEZONE);
}

/**
 * Format a date for display in Romania timezone
 */
export function formatDateTime(date: Date): string {
    return date.toLocaleString('ro-RO', {
        timeZone: 'Europe/Bucharest',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

/**
 * Format time only for display in Romania timezone
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('ro-RO', {
        timeZone: 'Europe/Bucharest',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Check if two dates are on the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

/**
 * Add minutes to a date
 */
export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
}

/**
 * Debug function to log timezone information
 */
export function debugTimezone(date: Date, label: string = 'Date'): void {
    console.log(`${label}:`, {
        romaniaTime: date.toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' }),
        iso: date.toISOString(),
        utcForDb: toUTCForDatabase(date),
        browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: date.getTimezoneOffset()
    });
}