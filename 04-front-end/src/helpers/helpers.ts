export function localDateFormat(date: string): string {
    const dateInstance = new Date(date);
    return dateInstance.toLocaleString();
}
