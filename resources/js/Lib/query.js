/**
 * Buang filter kosong / default supaya URL tetap rapi:
 * { q: '', kondisi: 'second', urut: 'terbaru' } -> { kondisi: 'second' }
 */
export function cleanFilters(filters = {}) {
    return Object.fromEntries(
        Object.entries(filters).filter(
            ([key, value]) =>
                value !== '' && value !== null && value !== undefined && !(key === 'urut' && value === 'terbaru'),
        ),
    );
}
