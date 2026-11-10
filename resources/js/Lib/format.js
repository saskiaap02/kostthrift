/** 115000 -> "Rp 115.000" */
export function formatRupiah(value) {
    return `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`;
}

/** "Rina Kartika Putri" -> "RK" */
export function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}
