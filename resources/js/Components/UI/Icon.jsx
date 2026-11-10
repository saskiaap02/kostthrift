/**
 * Bootstrap Icons (https://icons.getbootstrap.com).
 * `name` tanpa awalan "bi-", mis. "heart-fill". Atur ukuran lewat className, mis. "text-[18px]".
 */
export default function Icon({ name, className = '' }) {
    return <i className={`bi bi-${name} ${className}`} aria-hidden="true" />;
}
